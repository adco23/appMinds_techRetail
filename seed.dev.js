import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Decimal from 'decimal.js';
import mongoose from 'mongoose';
import connectDB from './utils/db.js';
import { toD128 } from './utils/decimal.helper.js';

import Plan         from './models/plan.model.js';
import Commerce     from './models/commerce.model.js';
import User         from './models/user.model.js';
import Store        from './models/store.model.js';
import Subscription from './models/subscription.model.js';
import Product      from './models/product.model.js';
import Order        from './models/order.model.js';
import SaleDetail   from './models/saleDetail.model.js';
import Transaction  from './models/transaction.model.js';

dotenv.config();

// ─── helpers ────────────────────────────────────────────────────────────────

const hash    = plain => bcrypt.hash(plain, 10);
const PASS    = 'admin123';
const today   = new Date();
const date    = d => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
// Calcula subtotal manualmente (replica la lógica del pre-save de SaleDetail)
const subtotal = (precio, cantidad) => toD128(new Decimal(precio.toString()).mul(new Decimal(cantidad)));

// ─── seed ───────────────────────────────────────────────────────────────────

const seed = async () => {
  await connectDB();
  console.log('\n🌱  Iniciando seed de datos de prueba...\n');

  // ── 1. Limpiar colecciones ─────────────────────────────────────────────
  await Promise.all([
    Transaction.deleteMany({}),
    SaleDetail.deleteMany({}),
    Order.deleteMany({}),
    Product.deleteMany({}),
    Subscription.deleteMany({}),
    Store.deleteMany({}),
    User.deleteMany({}),
    Commerce.deleteMany({}),
    Plan.deleteMany({}),
  ]);
  console.log('✓  Colecciones limpiadas\n');

  // ── 2. Planes ─────────────────────────────────────────────────────────
  const [planBasico, planPro, planEnterprise] = await Plan.insertMany([
    { name: 'Básico',      price: toD128(5000),  minimum: '1 mes',   commission: toD128(3),  status: 'active', createdAt: date(today) },
    { name: 'Profesional', price: toD128(12000), minimum: '3 meses', commission: toD128(2),  status: 'active', createdAt: date(today) },
    { name: 'Enterprise',  price: toD128(25000), minimum: '6 meses', commission: toD128(1),  status: 'active', createdAt: date(today) },
  ]);
  console.log(`✓  Planes creados: ${planBasico.name}, ${planPro.name}, ${planEnterprise.name}`);

  // ── 3. Comercio ────────────────────────────────────────────────────────
  const commerce = await Commerce.create({
    name:    'TechShop SA',
    cuit:    '30-12345678-9',
    email:   'contacto@techshop.com',
    phone:   '+54 11 4444-5555',
    address: 'Av. Corrientes 1234, Buenos Aires',
    status:  1,
  });
  console.log(`✓  Comercio creado: ${commerce.name}`);

  // ── 4. Usuarios ────────────────────────────────────────────────────────
  const pwd = await hash(PASS);

  const [adminPlataforma, adminComercio, cliente] = await User.insertMany([
    {
      firstName:  'Admin',
      lastName:   'Plataforma',
      email:      'admin@plataforma.com',
      password:   pwd,
      role:       'platform-admin',
      commerceId: null,
      status:     'Activo',
    },
    {
      firstName:  'Admin',
      lastName:   'Comercio',
      email:      'admin@comercio.com',
      password:   pwd,
      role:       'commerce-admin',
      commerceId: commerce._id,
      status:     'Activo',
    },
    {
      firstName:  'Carlos',
      lastName:   'López',
      email:      'cliente@test.com',
      password:   pwd,
      role:       'client',
      commerceId: null,
      status:     'Activo',
    },
  ]);
  console.log(`✓  Usuarios creados:`);
  console.log(`     platform-admin → ${adminPlataforma.email}  /  ${PASS}`);
  console.log(`     commerce-admin → ${adminComercio.email}  /  ${PASS}`);
  console.log(`     client         → ${cliente.email}  /  ${PASS}`);

  // ── 5. Tiendas ────────────────────────────────────────────────────────
  const [storeCentro, storeNorte] = await Store.insertMany([
    { name: 'TechShop Centro', category: 'Electrónica',  subdomain: 'techshop-centro', status: 'Activo',   commerceId: commerce._id },
    { name: 'TechShop Norte',  category: 'Accesorios',   subdomain: 'techshop-norte',  status: 'Inactivo', commerceId: commerce._id },
  ]);
  console.log(`✓  Tiendas creadas: ${storeCentro.name} (Activa), ${storeNorte.name} (Inactiva)`);

  // ── 6. Suscripciones ──────────────────────────────────────────────────
  const subActiva = await Subscription.create({
    detail:    planPro.name,
    amount:    toD128(12000),
    startDate: date(today),
    expDate:   date(addDays(today, 90)),
    status:    'Activa',
    storeId:   storeCentro._id,
  });

  const subCancelada = await Subscription.create({
    detail:    planBasico.name,
    amount:    toD128(5000),
    startDate: date(addDays(today, -60)),
    expDate:   date(addDays(today, -30)),
    status:    'Cancelada',
    storeId:   storeNorte._id,
  });
  console.log(`✓  Suscripciones creadas: Activa (${subActiva.detail}), Cancelada (${subCancelada.detail})`);

  // ── 7. Productos ──────────────────────────────────────────────────────
  const productos = await Product.insertMany([
    // storeCentro
    { name: 'Smartphone Samsung A54',  description: 'Celular 128GB, 6GB RAM',    price: toD128(350000), stock: 20, category: 'Smartphones',  storeId: storeCentro._id, status: 'active'   },
    { name: 'Auriculares Bluetooth',   description: 'Inalámbricos, 30h batería', price: toD128(45000),  stock: 50, category: 'Audio',         storeId: storeCentro._id, status: 'active'   },
    { name: 'Tablet Lenovo M10',       description: '10 pulgadas, 64GB',         price: toD128(180000), stock: 0,  category: 'Tablets',       storeId: storeCentro._id, status: 'inactive' },
    // storeNorte
    { name: 'Funda iPhone 15',         description: 'Silicona premium, varios colores', price: toD128(8000),  stock: 100, category: 'Fundas',   storeId: storeNorte._id, status: 'active'   },
    { name: 'Cable USB-C 2m',          description: 'Carga rápida 65W',          price: toD128(4500),   stock: 80,  category: 'Cables',       storeId: storeNorte._id, status: 'active'   },
  ]);
  const [prodSmartphone, prodAuris, prodTablet, prodFunda, prodCable] = productos;
  console.log(`✓  Productos creados: ${productos.length} (3 activos, 1 inactivo, 1 sin stock)`);

  // ── 8. Órdenes + detalles ─────────────────────────────────────────────

  // Orden 1 → COMPLETADA
  const orden1 = await Order.create({
    clientId:      cliente._id,
    storeId:       storeCentro._id,
    paymentMethod: 'tarjeta',
    status:        1,
    date:          addDays(today, -10),
  });

  // insertMany saltea el pre-save hook; subtotal se calcula manualmente
  const [det1a, det1b] = await SaleDetail.insertMany([
    { cantidad: 1, precioUnitario: toD128(350000), subtotal: subtotal(toD128(350000), 1), ventaId: orden1._id, productoId: prodSmartphone._id },
    { cantidad: 2, precioUnitario: toD128(45000),  subtotal: subtotal(toD128(45000),  2), ventaId: orden1._id, productoId: prodAuris._id },
  ]);

  const total1 = 350000 + 45000 * 2; // 440000
  orden1.totalAmount = toD128(total1);
  orden1.detailsId   = [det1a._id, det1b._id];
  orden1.paymentId   = 'PAY-001-TEST';
  await orden1.save();

  // Orden 2 → PENDIENTE
  const orden2 = await Order.create({
    clientId:      cliente._id,
    storeId:       storeCentro._id,
    paymentMethod: 'transferencia',
    status:        0,
    date:          addDays(today, -2),
  });

  const [det2a] = await SaleDetail.insertMany([
    { cantidad: 1, precioUnitario: toD128(180000), subtotal: subtotal(toD128(180000), 1), ventaId: orden2._id, productoId: prodTablet._id },
  ]);

  orden2.totalAmount = toD128(180000);
  orden2.detailsId   = [det2a._id];
  await orden2.save();

  // Orden 3 → CANCELADA
  const orden3 = await Order.create({
    clientId:      cliente._id,
    storeId:       storeCentro._id,
    paymentMethod: 'efectivo',
    status:        2,
    date:          addDays(today, -20),
  });

  const [det3a, det3b] = await SaleDetail.insertMany([
    { cantidad: 3, precioUnitario: toD128(8000), subtotal: subtotal(toD128(8000), 3), ventaId: orden3._id, productoId: prodFunda._id },
    { cantidad: 1, precioUnitario: toD128(4500), subtotal: subtotal(toD128(4500), 1), ventaId: orden3._id, productoId: prodCable._id },
  ]);

  const total3 = 8000 * 3 + 4500;
  orden3.totalAmount = toD128(total3);
  orden3.detailsId   = [det3a._id, det3b._id];
  await orden3.save();

  console.log(`✓  Órdenes creadas: Completada (#1 $${total1.toLocaleString()}), Pendiente (#2 $180,000), Cancelada (#3 $${total3.toLocaleString()})`);

  // ── 9. Transacciones (solo orden completada) ──────────────────────────
  // El pre-save de Transaction calcula feeAmount y netAmount según el plan activo de la tienda.
  const tx = await Transaction.create({
    receiptId:     'REC-2026-001',
    grossAmount:   toD128(total1),
    date:          addDays(today, -10),
    status:        'aprobada',
    paymentMethod: 'tarjeta',
    gatewayRef:    'MP-SANDBOX-001',
    saleId:        orden1._id,
  });
  console.log(`✓  Transacción creada: ${tx.receiptId} (comisión ${planPro.name} 2%)`);

  // ── Resumen ────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  SEED COMPLETADO — Credenciales de prueba');
  console.log('══════════════════════════════════════════════════════');
  console.log(`  admin@plataforma.com  /  ${PASS}  →  platform-admin`);
  console.log(`  admin@comercio.com    /  ${PASS}  →  commerce-admin`);
  console.log(`  cliente@test.com      /  ${PASS}  →  client`);
  console.log('══════════════════════════════════════════════════════\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
