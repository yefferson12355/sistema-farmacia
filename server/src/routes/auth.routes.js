const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { pool } = require("../db/pool");

const router = express.Router();

router.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      throw new ApiError({
        code: "VALIDATION_ERROR",
        status: 400,
        message: "username y password son requeridos",
      });
    }

    const { rows } = await pool.query(
      "SELECT id, username, password_hash, rol, estado FROM usuarios WHERE username = $1 LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      throw new ApiError({
        code: "INVALID_CREDENTIALS",
        status: 401,
        message: "Credenciales inválidas",
      });
    }

    const user = rows[0];
    if (!user.estado) {
      throw new ApiError({
        code: "USER_DISABLED",
        status: 403,
        message: "Usuario deshabilitado",
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new ApiError({
        code: "INVALID_CREDENTIALS",
        status: 401,
        message: "Credenciales inválidas",
      });
    }

    const secret = process.env.JWT_SECRET || "dev_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "8h";

    const token = jwt.sign(
      { sub: String(user.id), username: user.username, rol: user.rol },
      secret,
      { expiresIn }
    );

    res.json({
      token,
      user: { id: Number(user.id), username: user.username, rol: user.rol },
    });
  })
);

module.exports = router;
