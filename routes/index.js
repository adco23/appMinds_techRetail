import { Router } from "express";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/", (req, res) => res.status(200).json({ message: "Bienvenido a la API"}))

router.use("/users", userRoutes);

export default router;