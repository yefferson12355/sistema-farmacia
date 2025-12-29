const { ApiError } = require("../utils/apiError");

function notFoundMiddleware(req, res, next) {
  next(
    new ApiError({
      code: "NOT_FOUND",
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      status: 404,
    })
  );
}

module.exports = { notFoundMiddleware };
