const env = require("./config/env");
const { createApp } = require("./app");
const initDb = require("./db/initDb");

const app = createApp();

(async () => {
  try {
    // 1️⃣ Inicializa BD (schema + seed si hace falta)
    await initDb();

    // 2️⃣ Recién levanta el servidor
    app.listen(env.port, "0.0.0.0", () => {
      console.log(` SIGFARMA Backend: http://localhost:${env.port}${env.apiPrefix}`);
      console.log(` Healthcheck:      http://localhost:${env.port}${env.apiPrefix}/health`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar SIGFARMA:", err);
    process.exit(1);
  }
})();
