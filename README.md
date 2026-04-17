# App Minds - Tech Retails Solucionts SRL

## Descripción

Este proyecto corresponde al desarrollo de un sistema backend para una plataforma de e-commerce autogestionada.

El objetivo de esta instancia es implementar la estructura base del sistema, incluyendo módulos funcionales iniciales con persistencia en archivos JSON, respetando una arquitectura modular que permita su futura escalabilidad.

---

## Tecnologías utilizadas

- Node.js
- Express
- Nodemon (entorno de desarrollo)
- Persistencia en archivos JSON

---

## Estructura del proyecto

```
src/
├── config/           # Configuración general (variables de entorno)
├── modules/          # Módulos funcionales
│   ├── stores/       # Gestión de tiendas
│   └── transactions/ # Gestión de transacciones
├── data/             # Archivos JSON (persistencia)
├── routes/           # Rutas principales
├── middlewares/      # Manejo de errores
├── utils/            # Utilidades (lectura/escritura JSON)
├── app.js            # Configuración de Express
└── server.js         # Punto de entrada
```

---

## Módulos implementados

### Stores

Permite gestionar las tiendas dentro de la plataforma.

### Transactions

Permite gestionar las transacciones asociadas a las ventas.

> Nota: En esta etapa solo se define la estructura. La lógica de negocio será implementada en entregas posteriores.

---

## Persistencia

Los datos se almacenan en archivos JSON ubicados en:

```
src/data/
├── stores.json
└── transactions.json
```

---

## Cómo ejecutar el proyecto

1. Instalar dependencias:

```
npm install
```

2. Ejecutar en modo desarrollo:

```
npm run dev
```

3. El servidor se iniciará en:

```
http://localhost:3000
```

---

## Endpoints disponibles

### Stores

- GET `/api/stores`
- POST `/api/stores`

### Transactions

- GET `/api/transactions`
- POST `/api/transactions`

---

## Alcance de esta entrega

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
