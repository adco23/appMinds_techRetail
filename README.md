# App Minds - Tech Retail Solutions SRL

## Descripción

Sistema backend para una plataforma de e-commerce autogestionada, que permite a comercios crear sus propias tiendas online integrando servicios de pagos y logística mediante un modelo de suscripción mensual más comisión por transacción.

Esta tercera entrega incorpora autenticación con sesiones, autorización basada en roles y middlewares de protección de rutas, sobre la base construida en entregas anteriores (Node.js + Express + MongoDB Atlas + Mongoose + Pug).

---

## Tecnologías utilizadas

- **Node.js** — Entorno de ejecución del servidor
- **Express.js v5** — Framework para el manejo de rutas, middlewares y controladores
- **MongoDB Atlas** — Base de datos NoSQL en la nube
- **Mongoose** — ODM para modelado de datos, validaciones y consultas a MongoDB
- **bcrypt** — Hash seguro de contraseñas
- **express-session** — Gestión de sesiones del lado del servidor
- **Pug** — Motor de plantillas para generación de vistas dinámicas HTML
- **decimal.js** — Aritmética de precisión para montos monetarios
- **morgan** — Logger de peticiones HTTP
- **dotenv** — Gestión de variables de entorno
- **cors** — Habilitación de CORS
- **Nodemon** — Recarga automática del servidor en desarrollo
- **Prettier** — Formateo de código
- **ES Modules (import/export)** — Sintaxis moderna unificada en todo el proyecto

---

## Estructura del proyecto

```
├── controllers/         # Lógica de presentación por módulo
│   ├── commerce.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   ├── saleDetail.controller.js
│   ├── store.controller.js
│   ├── subscription.controller.js
│   ├── transaction.controller.js
│   └── user.controller.js
├── middlewares/         # Middlewares personalizados
│   ├── auth.middleware.js       # Sesiones, carga de usuario autenticado
│   ├── error.middleware.js      # Manejo centralizado de errores
│   └── simulation.middleware.js # Roles y control de acceso por suscripción
├── models/              # Esquemas Mongoose por colección
│   ├── commerce.model.js
│   ├── order.model.js
│   ├── plan.model.js
│   ├── product.model.js
│   ├── saleDetail.model.js
│   ├── store.model.js
│   ├── subscription.model.js
│   ├── transaction.model.js
│   └── user.model.js
├── routes/              # Definición de endpoints
│   ├── index.js
│   ├── commerce.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   ├── product.views.routes.js
│   ├── saleDetail.routes.js
│   ├── store.routes.js
│   ├── subscription.routes.js
│   ├── transaction.routes.js
│   ├── user.routes.js
│   └── views.routes.js
├── services/            # Lógica de negocio asíncrona
│   ├── commerce.service.js
│   ├── order.service.js
│   ├── plan.service.js
│   ├── product.service.js
│   ├── saleDetail.service.js
│   ├── store.service.js
│   ├── subscription.service.js
│   ├── transaction.service.js
│   └── user.service.js
├── utils/               # Utilidades compartidas
│   └── db.js            # Conexión a MongoDB
├── views/               # Templates Pug
│   ├── auth/
│   ├── commerces/
│   ├── home/
│   ├── layouts/
│   ├── orders/
│   ├── products/
│   ├── stores/
│   ├── subscriptions/
│   ├── transactions/
│   └── users/
├── data/                # JSON de seed para desarrollo
├── .env                 # Variables de entorno (no incluido en el repositorio)
├── .env.example         # Plantilla de variables de entorno
├── app.js               # Configuración de Express
├── server.js            # Punto de entrada
├── seed.dev.js          # Script de carga inicial de datos
└── package.json         # Dependencias del proyecto
```

---

## Instalación y ejecución

### Requisitos previos

- Node.js v18 o superior
- npm
- Una instancia de MongoDB Atlas (o MongoDB local)

### Pasos de instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/adco23/appMinds_techRetail.git
cd appMinds_techRetail
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

Editar `.env` con los valores reales (ver sección [Variables de entorno](#variables-de-entorno)).

4. (Opcional) Cargar datos de prueba:

```bash
npm run seed:dev
```

5. Ejecutar en modo desarrollo:

```bash
npm run dev
```

6. El servidor se iniciará en:

```
http://localhost:3000
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://usuario:pass@cluster.mongodb.net/TechRetail` |
| `SESSION_SECRET` | Clave secreta para firmar las sesiones | `un_string_largo_y_aleatorio` |
| `PORT` | Puerto del servidor (opcional, por defecto 3000) | `3000` |

---

## Autenticación y autorización

El sistema implementa autenticación mediante **sesiones del lado del servidor** (`express-session`) con contraseñas hasheadas con **bcrypt**.

### Flujo de autenticación

1. El usuario envía sus credenciales al `POST /auth/login`
2. Se verifica la contraseña con `bcrypt.compare()`
3. Si es válida, se persiste el usuario en `req.session.user`
4. El middleware `loadAuthUser` carga el usuario en cada request y lo expone en `res.locals.currentUser`

### Roles disponibles

| Rol | Descripción |
|-----|-------------|
| `platform-admin` | Administrador de la plataforma. Gestiona comercios, usuarios, planes y suscripciones |
| `commerce-admin` | Administrador de un comercio. Gestiona sus tiendas, productos y órdenes |

### Protección de rutas

- `ensureAuthenticated` — redirige al login si no hay sesión activa
- `ensureGuest` — redirige al home si ya hay sesión (para login/register)
- `onlyPlatformAdmin` — restringe acceso solo a administradores de plataforma
- `commerceNeedsSubscription` — bloquea el acceso a tiendas y productos si el comercio no tiene suscripción activa

---

## Persistencia de datos

La persistencia se realiza íntegramente en MongoDB Atlas mediante Mongoose. La conexión se establece al iniciar el servidor:

```javascript
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB conectado');
};
```

### Colecciones en MongoDB

| Colección | Descripción |
|-----------|-------------|
| `commerces` | Datos de los comercios registrados en la plataforma |
| `stores` | Tiendas autogestionadas asociadas a cada comercio |
| `plans` | Planes de suscripción disponibles |
| `products` | Catálogo de productos de cada tienda |
| `users` | Perfiles de usuarios con rol de plataforma o comercio |
| `orders` | Órdenes de compra con estado y monto total |
| `subscriptions` | Suscripciones mensuales por tienda |
| `transactions` | Registro de pagos con comisión calculada automáticamente |
| `saledetails` | Detalle de productos por orden de venta |

---

## Endpoints API

### Autenticación (vistas)

- `GET /auth/login` — Formulario de login
- `POST /auth/login` — Iniciar sesión
- `GET /auth/register` — Formulario de registro
- `POST /auth/register` — Registrar usuario
- `POST /auth/logout` — Cerrar sesión

### Comercios

- `GET /api/commerces` — Listar comercios
- `POST /api/commerces` — Crear comercio
- `GET /api/commerces/:cuit` — Obtener comercio por CUIT
- `PUT /api/commerces/:cuit` — Actualizar comercio
- `DELETE /api/commerces/:cuit` — Eliminar comercio

### Tiendas

- `GET /api/stores` — Listar tiendas
- `POST /api/stores` — Crear tienda
- `GET /api/stores/:id` — Obtener tienda
- `PUT /api/stores/:id` — Actualizar tienda
- `DELETE /api/stores/:id` — Eliminar tienda

### Productos

- `GET /api/products` — Listar productos
- `POST /api/products` — Crear producto
- `GET /api/products/:id` — Obtener producto
- `PUT /api/products/:id` — Actualizar producto
- `DELETE /api/products/:id` — Eliminar producto

### Usuarios

- `GET /api/users` — Listar usuarios
- `POST /api/users` — Crear usuario
- `PUT /api/users/:email` — Actualizar usuario
- `PATCH /api/users/:email/activate` — Activar usuario
- `PATCH /api/users/:email/deactivate` — Desactivar usuario
- `DELETE /api/users/:email` — Eliminar usuario

### Órdenes

- `GET /api/orders` — Listar órdenes
- `POST /api/orders` — Crear orden
- `PUT /api/orders/:id` — Actualizar orden (confirmar / cancelar)

### Suscripciones

- `GET /api/subscriptions` — Listar suscripciones
- `POST /api/subscriptions` — Crear suscripción

### Transacciones

- `GET /api/transactions` — Listar transacciones
- `POST /api/transactions` — Crear transacción

### Detalles de venta

- `GET /api/sale-details` — Listar detalles
- `GET /api/sale-details/sale/:saleId` — Detalles por orden
- `POST /api/sale-details` — Crear detalle
- `DELETE /api/sale-details/:id` — Eliminar detalle

---

## Migración: de fileHandler a Mongoose

Los servicios reemplazaron todas las operaciones de lectura y escritura de archivos JSON por métodos de Mongoose:

| Método | Descripción |
|--------|-------------|
| `Model.find()` | Obtener todos los documentos |
| `Model.findById(id)` | Obtener un documento por su `_id` |
| `new Model(data).save()` | Crear un nuevo documento |
| `Model.findByIdAndUpdate(id, data, { new: true })` | Actualizar un documento |
| `Model.findByIdAndDelete(id)` | Eliminar un documento |
| `Model.find().populate('campo')` | Traer datos relacionados de otra colección |

---

## Arquitectura (capas)

```
Request → Routes → Middlewares → Controllers → Services → Models → MongoDB
                                                              ↓
Response ← Views (Pug) ←──────────────────────────────── Controllers
```

- **Routes** — Define los endpoints HTTP y aplica middlewares de auth/rol
- **Controllers** — Delega a servicios y responde con JSON o renderiza vistas
- **Services** — Contiene la lógica de negocio asíncrona
- **Models** — Esquemas Mongoose con validaciones y hooks (`pre('save')`)
- **Middlewares** — Procesa solicitudes/respuestas, maneja errores y autorización

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia con Nodemon (recarga automática) |
| `npm run seed:dev` | Carga datos de prueba en la base de datos |
| `npm run format` | Formatea el código con Prettier |

---

## Logros de la 2° entrega

- Migración completa de persistencia JSON a MongoDB Atlas ✔
- Implementación de esquemas Mongoose con validaciones ✔
- Refactorización de servicios a funciones async/await ✔
- Generación automática de transacciones al confirmar órdenes ✔
- Implementación de populate() para relaciones entre colecciones ✔
- Migración completa a ES Modules (import/export) ✔
- Mejoras en vistas con Pug ✔

## Logros de la 3° entrega

- Implementación de autenticación con sesiones (`express-session`) ✔
- Hasheo seguro de contraseñas con bcrypt ✔
- Sistema de roles (`platform-admin`, `commerce-admin`) con protección de rutas ✔
- Middleware `loadAuthUser` para inyectar el usuario en cada request ✔
- Middleware `commerceNeedsSubscription` para bloquear acceso sin suscripción activa ✔
- Validación de stock al crear y confirmar órdenes ✔
- Modelo `Plan` para gestión de planes de suscripción ✔
- Manejo centralizado de errores mejorado (`error.middleware.js`) ✔
- Resolución de conflictos de integración entre ramas del equipo ✔

---
