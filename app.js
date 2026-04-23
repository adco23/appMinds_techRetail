const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const routes = require('./routes/index.js');
const storeRoutes = require('./routes/store.routes.js');
const productRoutes = require('./routes/product.routes.js');
const { errorHandler } = require('./middlewares/error.middleware.js');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true })); // Para que Express pueda leer los datos del formulario

app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Rutas generales del proyecto
app.use('/', routes);

// API y vistas del módulo Store
app.use('/stores', storeRoutes);

// API y vistas del módulo Product
app.use('/products', productRoutes);

app.use(errorHandler);

module.exports = app;