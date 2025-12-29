const express = require("express");

const authRoutes = require("./auth.routes");
const medicamentosRoutes = require("./medicamentos.routes");
const dbRoutes = require("./db.routes");
const healthRoutes = require("./health.routes");

const router = express.Router();
const ventasRoutes = require("./ventas.routes"); // <--- Importar
// ...
router.use("/ventas", ventasRoutes); // <--- Usar
/**
 * Rutas públicas
 */
router.use("/alertas", require("./alertas.routes"));
router.use("/health", healthRoutes);
router.use("/db", dbRoutes);

/**
 * Autenticación
 */
router.use("/auth", authRoutes);

/**
 * API principal
 */
router.use("/medicamentos", medicamentosRoutes);

module.exports = router;
