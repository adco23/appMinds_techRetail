const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("home/index", {
    title: "Inicio",
  });
});

router.get("/transactions", (req, res) => {
  res.render("transactions/index", {
    title: "Transacciones",
  });
});

router.get("/users", (req, res) => {
  res.render("users/index", {
    title: "Usuarios",
  });
});

module.exports = router;