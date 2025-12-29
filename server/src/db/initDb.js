const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function runSQL(file) {
  const sql = fs.readFileSync(file, "utf8");
  await pool.query(sql);
}

async function initDb() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🔌 Conectado a DB:", res.rows[0].now);

    // 1. REINICIO DE TABLAS (Schema)
    console.log("🛠  REINICIANDO ESTRUCTURA (Schema)...");
    await runSQL(path.join(__dirname, "../../migraciones/schema.sql"));
    console.log("✅ Tablas creadas correctamente.");

    // 2. CARGA DE DATOS (Seed)
    console.log("🌱 INSERTANDO DATOS DE PRUEBA (Seed)...");
    await runSQL(path.join(__dirname, "../../migraciones/seed.sql"));
    console.log("✅ Datos insertados.");

    // 3. 🚨 FIX CRÍTICO DE SECUENCIAS 🚨
    // Esto repara el error de "llave duplicada" obligando al contador a saltar al último ID
    console.log("🔄 SINCRONIZANDO CONTADORES DE ID...");
    await pool.query(`
      SELECT setval(pg_get_serial_sequence('usuarios', 'id'), COALESCE(MAX(id), 1)) FROM usuarios;
      SELECT setval(pg_get_serial_sequence('medicamentos', 'id'), COALESCE(MAX(id), 1)) FROM medicamentos;
      SELECT setval(pg_get_serial_sequence('lotes', 'id'), COALESCE(MAX(id), 1)) FROM lotes;
      SELECT setval(pg_get_serial_sequence('ventas', 'id'), COALESCE(MAX(id), 1)) FROM ventas;
      SELECT setval(pg_get_serial_sequence('venta_detalle', 'id'), COALESCE(MAX(id), 1)) FROM venta_detalle;
      SELECT setval(pg_get_serial_sequence('alertas', 'id'), COALESCE(MAX(id), 1)) FROM alertas;
    `);
    console.log("✅ Contadores arreglados. Listo para vender.");

  } catch (error) {
    console.error("❌ Error fatal en initDb:", error);
  }
}

module.exports = initDb;