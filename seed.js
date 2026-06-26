import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import Plan from './models/plan.model.js';

dotenv.config();

const planes = [
  { name: 'Básico',        precio: 5000,  minimo: '1 mes',  status: 'active' },
  { name: 'Profesional',   precio: 12000, minimo: '3 meses', status: 'active' },
  { name: 'Enterprise',    precio: 25000, minimo: '6 meses', status: 'active' },
];

const seed = async () => {
  await connectDB();

  for (const plan of planes) {
    const exists = await Plan.findOne({ name: plan.name });
    if (!exists) {
      await Plan.create({
        ...plan,
        createdAt: new Date().toISOString().split('T')[0],
      });
      console.log(`✓ Plan "${plan.name}" creado`);
    } else {
      console.log(`  Plan "${plan.name}" ya existe, se omite`);
    }
  }

  console.log('Seed completado.');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
