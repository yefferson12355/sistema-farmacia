const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const routes = require("./routes");
const { notFoundMiddleware } = require("./middlewares/notFound.middleware");
const { errorMiddleware } = require("./middlewares/error.middleware");

function createApp() {
  const app = express();

  // Middlewares base
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  // API versionada
  app.use(env.apiPrefix, routes);

  // 404 + error handler
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
