const express = require("express");
const pool = require("../db/pool");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");

const router = express.Router();

// POST /api/v1/ventas - Crear una venta
router.post("/", asyncHandler(async (req, res) => {
    // Nota: Eliminamos 'precio_unit' de lo que esperamos del frontend por seguridad
    const { usuario_id, cliente_dni, metodo_pago, items, cliente_nombre } = req.body; 

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Validar Cliente (Crearlo si no existe)
        if (cliente_dni) {
            await client.query(`
                INSERT INTO clientes (dni, nombre, created_at)
                VALUES ($1, $2, NOW())
                ON CONFLICT (dni) DO NOTHING
            `, [cliente_dni, cliente_nombre || 'Cliente General']);
        }

        // 2. Calcular total y Validaciones
        let totalVenta = 0;
        const itemsProcesados = [];

        for (const item of items) {
            const { rows: loteRows } = await client.query(
                `SELECT l.stock_actual, l.fecha_vencimiento, l.medicamento_id, m.precio_venta 
                 FROM lotes l
                 JOIN medicamentos m ON l.medicamento_id = m.id
                 WHERE l.id = $1 FOR UPDATE`,
                [item.lote_id]
            );

            if (loteRows.length === 0) {
                throw new ApiError({ status: 404, message: `Lote ${item.lote_id} no encontrado` });
            }
            
            const datosDB = loteRows[0];
            const precioReal = Number(datosDB.precio_venta);

            // Validar vencimiento
            const hoy = new Date();
            const vencimiento = new Date(datosDB.fecha_vencimiento);
            const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

            if (diasRestantes <= 30) {
                 throw new ApiError({ status: 400, message: `El lote ${item.lote_id} está vencido o próximo a vencer.` });
            }

            if (datosDB.stock_actual < item.cantidad) {
                throw new ApiError({ status: 400, message: `Stock insuficiente en lote ${item.lote_id}` });
            }

            itemsProcesados.push({ ...item, precio_unit: precioReal });
            totalVenta += item.cantidad * precioReal;
        }

        // 3. Insertar Venta (Cabecera)
        const { rows: ventaRows } = await client.query(
            `INSERT INTO ventas (usuario_id, cliente_dni, total, metodo_pago) VALUES ($1, $2, $3, $4) RETURNING id`,
            [usuario_id || 1, cliente_dni, totalVenta, metodo_pago]
        );
        const ventaId = ventaRows[0].id;

        // 4. Insertar Detalle y Descontar Stock
        for (const item of itemsProcesados) {
            const subtotal = item.cantidad * item.precio_unit;
            
            await client.query(
                `INSERT INTO venta_detalle (venta_id, lote_id, cantidad, precio_unit, subtotal) VALUES ($1, $2, $3, $4, $5)`,
                [ventaId, item.lote_id, item.cantidad, item.precio_unit, subtotal]
            );

            await client.query(
                `UPDATE lotes SET stock_actual = stock_actual - $1 WHERE id = $2`,
                [item.cantidad, item.lote_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Venta registrada con éxito", venta_id: ventaId });

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}));

// GET /api/v1/ventas - Obtener historial
router.get("/", asyncHandler(async (req, res) => {
    // Hacemos JOIN para traer el nombre del cliente y del vendedor
    const { rows } = await pool.query(`
        SELECT 
            v.id,
            v.total,
            v.metodo_pago,
            v.created_at,
            v.cliente_dni,
            COALESCE(c.nombre, 'Cliente General') as cliente_nombre,
            COALESCE(u.username, 'Admin') as vendedor_nombre
        FROM ventas v
        LEFT JOIN clientes c ON v.cliente_dni = c.dni
        LEFT JOIN usuarios u ON v.usuario_id = u.id
        ORDER BY v.created_at DESC
    `);
    
    res.json(rows);
}));

module.exports = router; // ✅ IMPORTANTE: ESTO DEBE IR AL FINAL