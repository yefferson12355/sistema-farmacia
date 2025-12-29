// db.js (Simulación avanzada de conexión a PostgreSQL con datos reales de dbSchema.js)

// Este archivo simula la conexión y consultas a una base de datos PostgreSQL usando los datos de dbSchema.js
const dbSchema = require('./dbSchema');

// Utilidad para clonar objetos y evitar mutaciones accidentales
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const fakePool = {
  query: async (sql, params) => {
    // Simulación básica de SELECT e INSERT para tablas principales
    sql = sql.trim();
    // SELECT * FROM Tabla
    if (/^SELECT \* FROM (\w+)/i.test(sql)) {
      const match = sql.match(/^SELECT \* FROM (\w+)/i);
      const table = match[1];
      if (dbSchema[table]) {
        return { rows: deepClone(dbSchema[table]), rowCount: dbSchema[table].length };
      }
    }
    // SELECT campos específicos
    if (/^SELECT (.+) FROM (\w+)/i.test(sql)) {
      const match = sql.match(/^SELECT (.+) FROM (\w+)/i);
      const fields = match[1].split(',').map(f => f.trim());
      const table = match[2];
      if (dbSchema[table]) {
        const rows = dbSchema[table].map(row => {
          const obj = {};
          fields.forEach(f => {
            // Permitir alias: campo AS alias
            const [campo, alias] = f.split(/\s+AS\s+/i);
            obj[alias ? alias.trim() : campo] = row[campo.trim()];
          });
          return obj;
        });
        return { rows: deepClone(rows), rowCount: rows.length };
      }
    }
    // INSERT INTO Tabla ... RETURNING *
    if (/^INSERT INTO (\w+) \((.+)\) VALUES \((.+)\) RETURNING \*/i.test(sql)) {
      const match = sql.match(/^INSERT INTO (\w+) \((.+)\) VALUES \((.+)\) RETURNING \*/i);
      const table = match[1];
      const fields = match[2].split(',').map(f => f.trim());
      const values = params;
      if (dbSchema[table]) {
        const newRow = {};
        fields.forEach((f, i) => {
          newRow[f] = values[i];
        });
        // Simular autoincremento para id
        const idField = Object.keys(dbSchema[table][0] || {}).find(k => k.startsWith('id_'));
        if (idField) {
          newRow[idField] = dbSchema[table].length ? Math.max(...dbSchema[table].map(r => r[idField])) + 1 : 1;
        }
        dbSchema[table].push(newRow);
        return { rows: [deepClone(newRow)], rowCount: 1 };
      }
    }
    // Simulación por defecto
    return { rows: [], rowCount: 0 };
  },
  connect: () => Promise.resolve(),
  end: () => Promise.resolve(),
};

module.exports = fakePool;