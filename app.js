import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";

import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { loadAuthUser } from './middlewares/auth.mittleware.js';
import { loadSimulation } from './middlewares/simulation.middleware.js';

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
app.use(loadAuthUser);
app.use(loadSimulation);

// Rutas generales del proyecto
app.use('/', routes);

app.use(errorHandler);

export default app;
