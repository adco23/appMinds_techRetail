const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const indexRoutes = require("./routes/index");
const storeRoutes = require("./routes/store.routes");
const productRoutes = require("./routes/product.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/", indexRoutes);
app.use("/stores", storeRoutes);
app.use("/products", productRoutes);

app.use(errorHandler);

module.exports = app;