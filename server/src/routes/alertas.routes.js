const express = require("express");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// GET /api/v1/alertas/vencimiento
// Retorna lo que pide el Dashboard: productos vencidos o por vencer
router.get("/vencimiento", asyncHandler(async (req, res) => {
    // Consultamos directamente la vista SQL que ya creaste
    const { rows } = await pool.query(`
        SELECT * FROM vista_alertas_vencimiento 
        WHERE estado_vencimiento IN ('vencido', 'por_vencer')
        ORDER BY fecha_vencimiento ASC
    `);
    res.json(rows);
}));

// GET /api/v1/alertas/stock
// Retorna productos con stock bajo
router.get("/stock", asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT m.id, m.nombre_comercial, m.stock_minimo, 
               COALESCE(SUM(l.stock_actual), 0) as stock_total
        FROM medicamentos m
        LEFT JOIN lotes l ON l.medicamento_id = m.id
        GROUP BY m.id
        HAVING COALESCE(SUM(l.stock_actual), 0) <= m.stock_minimo
    `);
    res.json(rows);
}));

module.exports = router;