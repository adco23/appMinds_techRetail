import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";

import routes from './routes/index.js';
import storeRoutes from './routes/store.routes.js';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  if (
    (req.path.startsWith('/stores') || req.path.startsWith('/products')) &&
    role === 'commerce-admin' &&
    !subscribed
  ) {
    return res.redirect('/commerce-admin/subscription?role=commerce-admin');
  }

  next();
});

// Rutas generales del proyecto
app.use('/', routes);

app.use(errorHandler);

export default app;
