const { ApiError } = require("../utils/apiError");

function errorMiddleware(err, req, res, next) {
  const isApiError = err instanceof ApiError;

  const status = isApiError ? err.status : 500;
  const code = isApiError ? err.code : "INTERNAL_ERROR";
  const message =
    isApiError ? err.message : "Ocurrió un error inesperado en el servidor.";
  const details = isApiError ? err.details : null;

  // Log útil en dev
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", {
      method: req.method,
      url: req.originalUrl,
      status,
      code,
      message,
      details,
      stack: err.stack,
    });
  }

  res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
}

module.exports = { errorMiddleware };
