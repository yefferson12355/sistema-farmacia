// server.js (Simulación de backend Express + PostgreSQL para SIGFARMA)

// Simula la estructura y endpoints principales de un backend real
const express = require('express');
const cors = require('cors');
const fakePool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// MEDICAMENTOS
// ==============================

// Listar medicamentos
app.get('/api/medicamentos', async (req, res) => {
  // Simulación de consulta a PostgreSQL
  const result = await fakePool.query(
    'SELECT id_medicamento, nombre_comercial, stock_minimo, precio_venta FROM Medicamento'
  );
  res.json({
    ok: true,
    data: result.rows,
  });
});

// Registrar medicamento
app.post('/api/medicamentos', async (req, res) => {
  const { nombre_comercial, stock_minimo, precio_venta } = req.body;
  if (!nombre_comercial || stock_minimo === undefined || !precio_venta) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos incompletos',
    });
  }
  // Simulación de inserción en PostgreSQL
  const result = await fakePool.query(
    `INSERT INTO Medicamento (nombre_comercial, stock_minimo, precio_venta) VALUES ($1, $2, $3) RETURNING *`,
    [nombre_comercial, stock_minimo, precio_venta]
  );
  res.status(201).json({
    ok: true,
    mensaje: 'Medicamento registrado',
    data: result.rows[0],
  });
});

// ==============================
// VENTAS
// ==============================

// Registrar venta
app.post('/api/ventas', async (req, res) => {
  const { id_usuario, total_venta } = req.body;
  if (!id_usuario || !total_venta) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos incompletos de la venta',
    });
  }
  // Simulación de inserción en PostgreSQL
  const result = await fakePool.query(
    `INSERT INTO Venta (id_usuario, total_venta) VALUES ($1, $2) RETURNING *`,
    [id_usuario, total_venta]
  );
  res.status(201).json({
    ok: true,
    mensaje: 'Venta registrada correctamente',
    data: result.rows[0],
  });
});

// Listar ventas
app.get('/api/ventas', async (req, res) => {
  // Simulación de consulta a PostgreSQL
  const result = await fakePool.query(
    'SELECT id_venta, fecha_venta, total_venta FROM Venta ORDER BY fecha_venta DESC'
  );
  res.json({
    ok: true,
    data: result.rows,
  });
});

// ==============================
// SERVIDOR
// ==============================
app.listen(3000, () => {
  console.log('Backend SIGFARMA simulado ejecutándose en http://localhost:3000');
});

// Nota: Este archivo es solo una simulación, no ejecuta lógica real ni conecta a una base de datos real.