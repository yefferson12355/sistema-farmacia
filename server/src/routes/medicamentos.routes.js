const express = require("express");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");

const ApiError = require("../utils/apiError");

const router = express.Router();

/**
 * GET /api/v1/medicamentos
 * Lista medicamentos con stock total y lotes
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
      SELECT
        m.id AS medicamento_id,
        m.nombre_comercial,
        m.principio_activo,
        m.ubicacion,
        m.stock_minimo,
        m.precio_venta,
        m.estado,
        l.id AS lote_id,
        l.numero_lote,
        l.fecha_vencimiento,
        l.stock_actual,
        l.precio_compra
      FROM medicamentos m
      LEFT JOIN lotes l ON l.medicamento_id = m.id
      WHERE m.estado = TRUE
      ORDER BY m.id, l.fecha_vencimiento ASC
    `);

    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.medicamento_id)) {
        map.set(r.medicamento_id, {
          id: Number(r.medicamento_id),
          nombre_comercial: r.nombre_comercial,
          principio_activo: r.principio_activo,
          ubicacion: r.ubicacion,
          stock_minimo: r.stock_minimo,
          precio_venta: Number(r.precio_venta),
          estado: r.estado,
          stock_total: 0,
          lotes: [],
        });
      }

      const med = map.get(r.medicamento_id);

      if (r.lote_id) {
        med.lotes.push({
          id: Number(r.lote_id),
          numero_lote: r.numero_lote,
          fecha_vencimiento: r.fecha_vencimiento,
          stock_actual: r.stock_actual,
          precio_compra: Number(r.precio_compra),
        });
        med.stock_total += r.stock_actual || 0;
      }
    }

    res.json([...map.values()]);
  })
);

/**
 * GET /api/v1/medicamentos/:id
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        m.id,
        m.nombre_comercial,
        m.principio_activo,
        m.ubicacion,
        m.stock_minimo,
        m.precio_venta,
        m.estado,
        COALESCE(SUM(l.stock_actual), 0) AS stock_total
      FROM medicamentos m
      LEFT JOIN lotes l ON l.medicamento_id = m.id
      WHERE m.id = $1
      GROUP BY m.id
    `,
      [id]
    );

    if (rows.length === 0) {
      throw new ApiError("NOT_FOUND", 404, "Medicamento no encontrado");
    }

    res.json(rows[0]);
  })
);

/**
 * POST /api/v1/medicamentos
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      nombre_comercial,
      principio_activo,
      ubicacion,
      stock_minimo,
      precio_venta,
      requiere_receta = false,
    } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO medicamentos
        (nombre_comercial, principio_activo, ubicacion, stock_minimo, precio_venta, requiere_receta)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `,
      [
        nombre_comercial,
        principio_activo,
        ubicacion,
        stock_minimo,
        precio_venta,
        requiere_receta,
      ]
    );

    res.status(201).json(rows[0]);
  })
);

module.exports = router;
