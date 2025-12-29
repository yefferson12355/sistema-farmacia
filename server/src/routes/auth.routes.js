const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
// Usamos require directo sin llaves porque pool.js exporta la instancia directa
const pool = require("../db/pool");

const router = express.Router();

// ✅ CORRECCIÓN: La ruta es solo "/" o "/login"
// Como index.js ya define "/auth", aquí solo ponemos "/login"
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};

    // 1. Validación básica
    if (!username || !password) {
      throw new ApiError({
        code: "VALIDATION_ERROR",
        status: 400,
        message: "El usuario y la contraseña son requeridos",
      });
    }

    // 2. Buscar usuario
    const { rows } = await pool.query(
      "SELECT id, username, password_hash, rol, estado FROM usuarios WHERE username = $1 LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      throw new ApiError({ code: "INVALID_CREDENTIALS", status: 401, message: "Credenciales inválidas" });
    }

    const user = rows[0];

    if (!user.estado) {
      throw new ApiError({ code: "USER_DISABLED", status: 403, message: "Usuario deshabilitado" });
    }

    // 3. Verificar password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new ApiError({ code: "INVALID_CREDENTIALS", status: 401, message: "Credenciales inválidas" });
    }

    // 4. Generar Token
    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign(
      { sub: String(user.id), username: user.username, rol: user.rol },
      secret,
      { expiresIn: "8h" }
    );

    // 5. Responder
    res.json({
      token,
      user: { id: Number(user.id), username: user.username, rol: user.rol },
    });
  })
);

module.exports = router;