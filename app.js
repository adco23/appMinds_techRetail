const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes/index.js');
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

app.use('/', routes);

app.use(errorHandler);

module.exports = app;
