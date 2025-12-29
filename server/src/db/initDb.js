const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function runSQL(file) {
  const sql = fs.readFileSync(file, "utf8");
  await pool.query(sql);
}

async function initDb() {
  const res = await pool.query(`
    SELECT to_regclass('public.medicamentos') AS exists;
  `);

  if (res.rows[0].exists) {
    console.log("📦 Base de datos ya inicializada");
    return;
  }

  console.log("🛠 Inicializando base de datos...");

  await runSQL(path.join(__dirname, "../../migraciones/schema.sql"));
  console.log("✅ Schema creado");

  await runSQL(path.join(__dirname, "../../migraciones/seed.sql"));
  console.log("🌱 Seed insertado");
}

module.exports = initDb;
