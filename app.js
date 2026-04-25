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

app.use(cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  const role = req.query.role || '';
  const subscribed = req.query.subscribed === '1';
  const query = role ? `?role=${role}${subscribed ? '&subscribed=1' : ''}` : '';

  res.locals.sim = {
    role,
    subscribed,
    isPlatformAdmin: role === 'platform-admin',
    isCommerceAdmin: role === 'commerce-admin',
    query,
  };

  if ((req.path.startsWith('/stores') || req.path.startsWith('/products')) && role === 'commerce-admin' && !subscribed) {
    return res.redirect('/commerce-admin/subscription?role=commerce-admin');
  }

  next();
});

// Rutas generales del proyecto
app.use('/', routes);

// API y vistas del módulo Store
app.use('/stores', storeRoutes);

// API y vistas del módulo Product
app.use('/products', productRoutes);

app.use(errorHandler);

module.exports = app;
