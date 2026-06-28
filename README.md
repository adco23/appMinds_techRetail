# App Minds - Tech Retail Solutions SRL

## Descripción

Sistema backend para una plataforma de e-commerce autogestionada, que permite a comercios crear sus propias tiendas online integrando servicios de pagos y logística mediante un modelo de suscripción mensual más comisión por transacción.

Esta segunda entrega corresponde a la migración y evolución del sistema desarrollado en la primera instancia. El proyecto avanza sobre la base ya construida incorporando una base de datos NoSQL (MongoDB) mediante el ODM Mongoose, reemplazando la persistencia en archivos JSON por una solución robusta y escalable.

Se mantiene la arquitectura modular basada en Node.js y Express, y se incorporan nuevas funcionalidades como la generación automática de transacciones al confirmar una orden, la visualización de relaciones entre colecciones mediante `populate()`, y mejoras en las interfaces de usuario con Pug.

El proyecto migró además a ES Modules (import/export) de forma completa, unificando la sintaxis moderna en todos los archivos del sistema.

---

## Tecnologías utilizadas

- **Node.js** — Entorno de ejecución del servidor
- **Express.js** — Framework para el manejo de rutas, middlewares y controladores
- **MongoDB Atlas** — Base de datos NoSQL en la nube
- **Mongoose** — ODM para modelado de datos, validaciones y consultas a MongoDB
- **Pug** — Motor de plantillas para generación de vistas dinámicas HTML
- **Nodemon** — Recarga automática del servidor en desarrollo
- **Thunder Client** — Pruebas de endpoints REST desde VS Code
- **ES Modules (import/export)** — Sintaxis moderna unificada en todo el proyecto

---

## Estructura del proyecto

```batch
├── config/              # Configuración general
├── controllers/         # Lógica de negocio por módulo
│   ├── commerce.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   ├── saleDetail.controller.js
│   ├── store.controller.js
│   ├── subscription.controller.js
│   ├── transaction.controller.js
│   └── user.controller.js
├── models/              # Esquemas Mongoose por colección
│   ├── commerce.model.js
│   ├── order.model.js
│   ├── product.model.js
│   ├── saleDetail.model.js
│   ├── store.model.js
│   ├── subscription.model.js
│   ├── transaction.model.js
│   └── user.model.js
├── services/            # Lógica de negocio reutilizable
│   ├── commerce.service.js
│   ├── order.service.js
│   ├── product.service.js
│   ├── saleDetail.service.js
│   ├── store.service.js
│   ├── subscription.service.js
│   ├── transaction.service.js
│   └── user.service.js
├── routes/              # Definición de endpoints
│   ├── index.js
│   ├── commerce.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   ├── saleDetail.routes.js
│   ├── store.routes.js
│   ├── subscription.routes.js
│   ├── transaction.routes.js
│   ├── user.routes.js
│   └── views.routes.js
├── middlewares/         # Middlewares personalizados
│   └── error.middleware.js
├── utils/               # Utilidades
│   ├── db.js             # Conexión a MongoDB
│   └── validations.js    # Validaciones de datos
├── views/               # Templates Pug
│   ├── layouts/
│   ├── commerces/
│   ├── orders/
│   ├── products/
│   ├── stores/
│   ├── subscriptions/
│   ├── transactions/
│   └── users/
├── .env                 # Variables de entorno (no incluido en el repositorio)
├── app.js               # Configuración de Express
├── server.js            # Punto de entrada
└── package.json         # Dependencias del proyecto
```

---

## Instalación y ejecución

### Requisitos previos
- Node.js (v14 o superior)
- npm

### Pasos de instalación

1. Clonar el repositorio:
```batch
git clone <repository-url>
cd appMinds_techRetail
```

2. Instalar dependencias:
```batch
npm install
```

3. Crear el archivo `.env` en la raíz del proyecto:

```batch
  .env
  MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/TechRetail?appName=appMinds
  PORT=3001
```

1. Ejecutar en modo desarrollo:
```batch
npm run dev
```

5. El servidor se iniciará en:
```batch
http://localhost:3001
```

---

## Persistencia de datos

En esta entrega se migró completamente la persistencia de archivos JSON a MongoDB, utilizando MongoDB Atlas como servicio en la nube. La conexión se establece mediante Mongoose al iniciar el servidor:

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
| `plans` | Datos de los plans para suscripción |
| `products` | Catálogo de productos de cada tienda |
| `users` | Perfiles de usuarios administradores de plataforma o comercios |
| `orders` | Órdenes de compra con estado y monto total |
| `subscriptions` | plans de suscripción mensual por tienda |
| `transactions` | Registro de pagos con comisión calculada automáticamente |
| `saledetails` | Detalle de productos por orden de venta |

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

Los métodos que tenían las clases (`activate`, `deactivate`, `cancel`, `complete`, etc.) pasaron a ser funciones `async` en el service. Como todos los servicios pasaron a ser asíncronos, los controllers se actualizaron incorporando `async/await`.

---

## Nuevas funcionalidades

### Transacciones automáticas

Se implementó la generación automática de transacciones al confirmar una orden. Cuando el estado de una orden cambia a `1` (Pagada), el sistema crea automáticamente una transacción con el cálculo de comisión del 2%. El modelo de `Transaction` usa un middleware `pre('save')` que calcula automáticamente `feeAmount` (2%) y `netAmount`.

### Populate — Relaciones entre colecciones

Se implementó `populate()` para mostrar datos relacionados en lugar de IDs:
```javascript
// Usuarios con nombre de comercio
const getUsers = async () => {
  return await User.find().populate('commerceId');
};
```
```javascript
// Suscripciones con nombre de tienda
const getAll = async () => {
  return await Subscription.find().populate('storeId');
};
```

---

## Módulos implementados

| Módulo | Funcionalidades | Colección MongoDB |
|--------|----------------|-------------------|
| Comercios | CRUD, activar/desactivar | `commerces` |
| Tiendas | CRUD, validación de subdominio único | `stores` |
| Productos | CRUD, control de stock, activar/desactivar | `products` |
| Usuarios | CRUD, activar/desactivar, populate comercio | `users` |
| Órdenes | Crear, confirmar, cancelar, generación de IDs automáticos | `orders` |
| Suscripciones | Alta, renovación, cancelación, populate tienda | `subscriptions` |
| Transacciones | Registro automático al confirmar orden, cálculo comisión 2% | `transactions` |
| Detalles de Venta | Subtotal automático via `pre('save')` | `saledetails` |

---

## Endpoints API disponibles

### Comercios
- `GET /api/commerces` - Listar comercios
- `POST /api/commerces` - Crear comercio
- `GET /api/commerces/:id` - Obtener comercio
- `PUT /api/commerces/:id` - Actualizar comercio
- `DELETE /api/commerces/:id` - Eliminar comercio

### Tiendas
- `GET /api/stores` - Listar tiendas
- `POST /api/stores` - Crear tienda
- `GET /api/stores/:id` - Obtener tienda
- `PUT /api/stores/:id` - Actualizar tienda
- `DELETE /api/stores/:id` - Eliminar tienda

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener orden
- `PUT /api/orders/:id` - Actualizar orden
- `DELETE /api/orders/:id` - Eliminar orden

### Suscripciones
- `GET /api/subscriptions` - Listar suscripciones
- `POST /api/subscriptions` - Crear suscripción
- `GET /api/subscriptions/:id` - Obtener suscripción
- `PUT /api/subscriptions/:id` - Actualizar suscripción
- `DELETE /api/subscriptions/:id` - Eliminar suscripción

### Transacciones
- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción
- `GET /api/transactions/:id` - Obtener transacción
- `PUT /api/transactions/:id` - Actualizar transacción
- `DELETE /api/transactions/:id` - Eliminar transacción

### Detalles de Venta
- `GET /api/sale-details` - Listar detalles
- `POST /api/sale-details` - Crear detalle
- `GET /api/sale-details/:id` - Obtener detalle
- `PUT /api/sale-details/:id` - Actualizar detalle
- `DELETE /api/sale-details/:id` - Eliminar detalle

---

## Arquitectura

El proyecto sigue una arquitectura de capas:

- **Routes** — Define los endpoints HTTP
- **Controllers** — Maneja las solicitudes HTTP y valida parámetros
- **Services** — Contiene la lógica de negocio asíncrona
- **Models** — Define los esquemas Mongoose y middlewares de datos
- **Middlewares** — Procesa solicitudes/respuestas y maneja errores

---

## Logros de esta entrega

- Migración completa de persistencia JSON a MongoDB Atlas ✔
- Implementación de esquemas Mongoose con validaciones ✔
- Refactorización de servicios a funciones async/await ✔
- Generación automática de transacciones al confirmar órdenes ✔
- Implementación de populate() para relaciones entre colecciones ✔
- Migración completa a ES Modules (import/export) ✔
- Mejoras en vistas con Pug ✔

---
