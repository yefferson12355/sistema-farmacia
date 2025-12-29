BEGIN;

DROP VIEW IF EXISTS vista_alertas_vencimiento CASCADE;
DROP VIEW IF EXISTS vista_stock_por_medicamento CASCADE;

DROP TABLE IF EXISTS venta_detalle CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS alertas CASCADE;
DROP TABLE IF EXISTS auditoria CASCADE;

DROP TABLE IF EXISTS lotes CASCADE;
DROP TABLE IF EXISTS medicamentos CASCADE;

DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- CLIENTES
CREATE TABLE clientes (
  dni         TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  email       TEXT,
  telefono    TEXT,
  ciudad      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USUARIOS
CREATE TABLE usuarios (
  id            BIGSERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol           TEXT NOT NULL CHECK (rol IN ('ADMIN','FARMACEUTICO','VENDEDOR')),
  estado        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MEDICAMENTOS
CREATE TABLE medicamentos (
  id               BIGSERIAL PRIMARY KEY,
  nombre_comercial TEXT NOT NULL,
  principio_activo TEXT NOT NULL,
  ubicacion        TEXT,
  stock_minimo     INT NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
  precio_venta     NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (precio_venta >= 0),
  estado           BOOLEAN NOT NULL DEFAULT TRUE,
  requiere_receta  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LOTES
CREATE TABLE lotes (
  id               BIGSERIAL PRIMARY KEY,
  medicamento_id   BIGINT NOT NULL REFERENCES medicamentos(id) ON DELETE RESTRICT,
  numero_lote      TEXT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  stock_actual     INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_inicial    INT NOT NULL DEFAULT 0 CHECK (stock_inicial >= 0),
  precio_compra    NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (precio_compra >= 0),
  estado           TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (medicamento_id, numero_lote)
);

-- VENTAS
CREATE TABLE ventas (
  id           BIGSERIAL PRIMARY KEY,
  usuario_id   BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  cliente_dni  TEXT REFERENCES clientes(dni) ON DELETE SET NULL,
  total        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  metodo_pago  TEXT NOT NULL CHECK (metodo_pago IN ('Efectivo','Tarjeta','Otro')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DETALLE VENTAS
CREATE TABLE venta_detalle (
  id          BIGSERIAL PRIMARY KEY,
  venta_id    BIGINT NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  lote_id     BIGINT NOT NULL REFERENCES lotes(id) ON DELETE RESTRICT,
  cantidad    INT NOT NULL CHECK (cantidad > 0),
  precio_unit NUMERIC(10,2) NOT NULL CHECK (precio_unit >= 0),
  subtotal    NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0)
);

-- AUDITORIA
CREATE TABLE auditoria (
  id          BIGSERIAL PRIMARY KEY,
  usuario_id  BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion      TEXT NOT NULL,
  entidad     TEXT NOT NULL,
  entidad_id  BIGINT,
  detalle     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ALERTAS (persistente)
CREATE TABLE alertas (
  id            BIGSERIAL PRIMARY KEY,
  tipo          TEXT NOT NULL CHECK (tipo IN ('stock','vencimiento')),
  medicamento_id BIGINT REFERENCES medicamentos(id) ON DELETE CASCADE,
  lote_id       BIGINT REFERENCES lotes(id) ON DELETE CASCADE,
  mensaje       TEXT NOT NULL,
  estado        TEXT NOT NULL CHECK (estado IN ('vencido','por_vencer','stock_bajo')),
  fecha_alerta  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDICES
CREATE INDEX idx_lotes_vencimiento ON lotes(fecha_vencimiento);
CREATE INDEX idx_lotes_numero ON lotes(numero_lote);
CREATE INDEX idx_lotes_medicamento ON lotes(medicamento_id);

-- VISTAS
CREATE OR REPLACE VIEW vista_stock_por_medicamento AS
SELECT
  m.id,
  m.nombre_comercial,
  m.principio_activo,
  m.ubicacion,
  m.stock_minimo,
  m.precio_venta,
  m.estado,
  COALESCE(SUM(l.stock_actual), 0) AS stock_total
FROM medicamentos m
LEFT JOIN lotes l ON l.medicamento_id = m.id
GROUP BY m.id;

CREATE OR REPLACE VIEW vista_alertas_vencimiento AS
SELECT
  m.id AS medicamento_id,
  m.nombre_comercial,
  l.id AS lote_id,
  l.numero_lote,
  l.fecha_vencimiento,
  l.stock_actual,
  CASE
    WHEN l.fecha_vencimiento < CURRENT_DATE THEN 'vencido'
    WHEN l.fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 day' THEN 'por_vencer'
    ELSE 'ok'
  END AS estado_vencimiento
FROM medicamentos m
JOIN lotes l ON l.medicamento_id = m.id;

COMMIT;
