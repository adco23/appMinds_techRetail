# App Minds - Tech Retail Solutions SRL

## Descripción

Sistema backend para una plataforma de e-commerce autogestionada, que permite a comercios crear sus propias tiendas online integrando servicios de pagos y logística mediante un modelo de suscripción mensual más comisión por transacción. Este proyecto implementa una arquitectura modular escalable con persistencia en archivos JSON, siguiendo patrones MVC (Model-View-Controller) con capas de servicios.

---

## Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Pug** - Template engine
- **Nodemon** - Desarrollo con recarga automática
- **JSON** - Persistencia de datos

---

## Estructura del proyecto

```
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
├── models/              # Definiciones y esquemas de datos
│   ├── commerce.model.js
│   ├── order.model.js
│   ├── product.model.js
│   ├── saleDetail.model.js
│   ├── store.model.js
│   ├── subscription.js
│   ├── transaction.js
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
│   ├── error.middleware.js
│   └── response.middleware.js
├── data/                # Persistencia (archivos JSON)
│   ├── commerces.json
│   ├── orders.json
│   ├── products.json
│   ├── saleDetail.json
│   ├── stores.json
│   ├── subscriptions.json
│   ├── transactions.json
│   └── users.json
├── utils/               # Utilidades
│   ├── fileHandler.js    # Manejo de archivos JSON
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
├── app.js               # Configuración de Express
├── server.js            # Punto de entrada
└── package.json         # Dependencias del proyecto
```

---

## Módulos implementados

### Comercios (Commerce)
Gestión de comercios registrados en la plataforma.

### Órdenes (Orders)
Gestión integral de órdenes de compra, incluyendo estado, detalles y seguimiento.

### Productos (Products)
Catálogo de productos disponibles con información de inventario.

### Detalles de Venta (Sale Details)
Información detallada de líneas de venta y transacciones.

### Tiendas (Stores)
Gestión de sucursales y puntos de venta.

### Suscripciones (Subscriptions)
Sistema de suscripciones y planes de usuarios.

### Transacciones (Transactions)
Registro y seguimiento de transacciones financieras.

### Usuarios (Users)
Gestión de usuarios y autenticación.

---

## Persistencia de datos

Los datos se almacenan en archivos JSON en el directorio `data/`:

```
data/
├── commerces.json       # Comercios registrados
├── orders.json          # Órdenes de compra
├── products.json        # Catálogo de productos
├── saleDetail.json      # Detalles de ventas
├── stores.json          # Sucursales y puntos de venta
├── subscriptions.json   # Suscripciones
├── transactions.json    # Transacciones
└── users.json           # Usuarios del sistema
```

---

## Instalación y ejecución

### Requisitos previos
- Node.js (v14 o superior)
- npm

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd appMinds_techRetail
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. El servidor se iniciará en:
```
http://localhost:3000
```

---

## Endpoints API disponibles

### Comercios
- `GET /api/commerces` - Listar comercios
- `POST /api/commerces` - Crear comercio
- `GET /api/commerces/:id` - Obtener comercio
- `PUT /api/commerces/:id` - Actualizar comercio
- `DELETE /api/commerces/:id` - Eliminar comercio

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener orden
- `PUT /api/orders/:id` - Actualizar orden
- `DELETE /api/orders/:id` - Eliminar orden

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Tiendas
- `GET /api/stores` - Listar tiendas
- `POST /api/stores` - Crear tienda
- `GET /api/stores/:id` - Obtener tienda
- `PUT /api/stores/:id` - Actualizar tienda
- `DELETE /api/stores/:id` - Eliminar tienda

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

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Detalles de Venta
- `GET /api/sale-details` - Listar detalles
- `POST /api/sale-details` - Crear detalle
- `GET /api/sale-details/:id` - Obtener detalle
- `PUT /api/sale-details/:id` - Actualizar detalle
- `DELETE /api/sale-details/:id` - Eliminar detalle

---

## Arquitectura

El proyecto sigue una arquitectura de capas:

- **Routes**: Define los endpoints HTTP
- **Controllers**: Maneja las solicitudes HTTP y valida parámetros
- **Services**: Contiene la lógica de negocio
- **Models**: Define la estructura y esquema de datos
- **Middlewares**: Procesa solicitudes/respuestas y maneja errores

---

## Próximas iteraciones

- [ ] Implementación de autenticación y autorización
- [ ] Validaciones avanzadas de datos
- [ ] Integración con base de datos (migración desde JSON)
- [ ] Sistema de logs
- [ ] Documentación de API (Swagger)
- [ ] Tests unitarios e integración
- [ ] Despliegue a producción

---

## Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

- Estructura base del backend ✔
- Implementación de módulos iniciales ✔
- Persistencia en archivos JSON ✔
- Separación por capas (routes, controllers, storage) ✔
- Sin lógica de negocio ✔

---

## Próximas etapas

- Implementación de lógica de negocio
- Validaciones de datos
- Integración con base de datos (MongoDB)
- Simulación de pagos y logística
- Generación de reportes y estadísticas

---

## Trabajo en equipo

Este proyecto está pensado para ser desarrollado de manera colaborativa, permitiendo la división de tareas por módulos y facilitando la escalabilidad del sistema.

---
