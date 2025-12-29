const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const { pool } = require("../db/pool");
const { ApiError } = require("../utils/apiError");

const router = express.Router();

router.get(
  "/db/health",
  asyncHandler(async (req, res) => {
    try {
      const r = await pool.query("SELECT 1 as ok");
      res.json({ status: "ok", db: r.rows[0] });
    } catch (e) {
      throw new ApiError({
        code: "DB_DOWN",
        status: 503,
        message: "No se pudo conectar a PostgreSQL",
        details: { hint: "Revisa credenciales/servicio/pg_hba.conf" },
      });
    }
  })
);

module.exports = router;
