BEGIN;

-- USUARIOS
INSERT INTO usuarios (id, username, password_hash, rol, estado)
VALUES
(1, 'admin', '$2b$10$g6.5HatuT20M1KslNBIhpuUEKziTcHuZEWFEm4gVhVp7EB/NN6vKi', 'ADMIN', TRUE),
(2, 'juanp', '$2b$10$g6.5HatuT20M1KslNBIhpuUEKziTcHuZEWFEm4gVhVp7EB/NN6vKi', 'VENDEDOR', TRUE),
(3, 'anam',  '$2b$10$g6.5HatuT20M1KslNBIhpuUEKziTcHuZEWFEm4gVhVp7EB/NN6vKi', 'VENDEDOR', TRUE)
ON CONFLICT (username) DO NOTHING;

-- CLIENTES (del mock)
INSERT INTO clientes (dni, nombre, email, telefono, ciudad) VALUES
('12345678', 'María García', 'maria@email.com', '999111222', 'Lima'),
('87654321', 'Carlos López', 'carlos@email.com', '998222333', 'Lima'),
('11223344', 'Rosa Sánchez', 'rosa@email.com', '997333444', 'Arequipa'),
('44332211', 'Pedro Ramírez', 'pedro@email.com', '996444555', 'Lima'),
('99887766', 'Lucía Fernández', 'lucia@email.com', '995555666', 'Cusco'),
('55443322', 'Juan Torres', 'juan@email.com', '994666777', 'Lima'),
('66554433', 'Ana Gómez', 'ana@email.com', '993777888', 'Trujillo'),
('33221100', 'Miguel Rodríguez', 'miguel@email.com', '992888999', 'Lima'),
('77665544', 'Elena Morales', 'elena@email.com', '991999000', 'Piura'),
('88776655', 'Fernando Ortiz', 'fernando@email.com', '990000111', 'Lima'),
('99008877', 'Susana Vera', 'susana@email.com', '989111222', 'Tacna'),
('11009988', 'Ricardo Flores', 'ricardo@email.com', '988222333', 'Ayacucho'),
('22110099', 'Gabriela Quispe', 'gabriela@email.com', '987333444', 'Puno'),
('33221199', 'Andrés Vargas', 'andres@email.com', '986444555', 'Lima'),
('44332299', 'Patricia Ruiz', 'patricia@email.com', '985555666', 'Junín')
ON CONFLICT (dni) DO NOTHING;

-- MEDICAMENTOS (del mock)
INSERT INTO medicamentos (id, nombre_comercial, principio_activo, ubicacion, stock_minimo, precio_venta, estado, requiere_receta)
VALUES
(1, 'Paracetamol 500mg', 'Paracetamol', 'Estante A-1', 20, 2.50, TRUE, FALSE),
(2, 'Amoxicilina 500mg', 'Amoxicilina', 'Estante B-2', 30, 8.00, TRUE, TRUE),
(3, 'Ibuprofeno 400mg', 'Ibuprofeno', 'Estante A-3', 50, 3.50, TRUE, FALSE),
(4, 'Omeprazol 20mg', 'Omeprazol', 'Estante C-1', 25, 12.00, TRUE, TRUE),
(5, 'Losartán 50mg', 'Losartán Potásico', 'Estante D-2', 20, 15.00, TRUE, TRUE),
(6, 'Metformina 850mg', 'Metformina HCL', 'Estante D-3', 40, 6.50, TRUE, TRUE),
(7, 'Vitamina C 1000mg', 'Ácido Ascórbico', 'Estante E-1', 15, 18.00, TRUE, FALSE),
(8, 'Diclofenaco 75mg', 'Diclofenaco Sódico', 'Estante A-4', 30, 4.00, TRUE, FALSE),
(9, 'Cetirizina 10mg', 'Cetirizina HCL', 'Estante B-1', 20, 5.50, TRUE, FALSE),
(10,'Azitromicina 500mg', 'Azitromicina', 'Estante B-3', 15, 25.00, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- LOTES (adaptado: stock_actual / stock_inicial)
INSERT INTO lotes (id, medicamento_id, numero_lote, fecha_vencimiento, stock_actual, stock_inicial, precio_compra, estado)
VALUES
(1,  1, 'L-2025-001', CURRENT_DATE + INTERVAL '5 day',   50,  50,  1.00, 'vencido'),
(2,  1, 'L-2025-002', CURRENT_DATE + INTERVAL '120 day', 100, 100, 1.10, 'vigente'),
(3,  2, 'L-2025-003', CURRENT_DATE + INTERVAL '45 day',  25,  25,  6.00, 'por_vencer'),
(4,  2, 'L-2025-004', CURRENT_DATE + INTERVAL '90 day',  20,  20,  6.50, 'vigente'),
(5,  3, 'L-2025-005', CURRENT_DATE + INTERVAL '180 day', 200, 200, 2.00, 'vigente'),
(6,  4, 'L-2025-006', CURRENT_DATE - INTERVAL '5 day',   15,  15,  10.00,'vencido'),
(7,  5, 'L-2025-007', CURRENT_DATE + INTERVAL '25 day',  30,  30,  12.00,'por_vencer'),
(8,  5, 'L-2025-008', CURRENT_DATE + INTERVAL '200 day', 50,  50,  13.00,'vigente'),
(9,  6, 'L-2025-009', CURRENT_DATE + INTERVAL '150 day', 120, 120, 4.00, 'vigente'),
(10, 7, 'L-2025-010', CURRENT_DATE + INTERVAL '10 day',  20,  20,  15.00,'vencido'),
(11, 7, 'L-2025-011', CURRENT_DATE + INTERVAL '55 day',  40,  40,  15.50,'por_vencer'),
(12, 8, 'L-2025-012', CURRENT_DATE + INTERVAL '95 day',  90,  90,  3.00, 'vigente'),
(13, 9, 'L-2025-013', CURRENT_DATE + INTERVAL '40 day',  8,   8,   4.00, 'por_vencer'),
(14,10, 'L-2025-014', CURRENT_DATE + INTERVAL '220 day', 35,  35,  20.00,'vigente')
ON CONFLICT (id) DO NOTHING;

-- ALERTAS (persistentes)
INSERT INTO alertas (tipo, medicamento_id, lote_id, mensaje, estado, fecha_alerta)
VALUES
('vencimiento', 1, 1, '¡ALERTA! Producto próximo a vencer o vencido. Venta Bloqueada.', 'vencido', CURRENT_DATE + INTERVAL '5 day'),
('vencimiento', 4, 6, '¡ALERTA! Producto próximo a vencer o vencido. Venta Bloqueada.', 'vencido', CURRENT_DATE - INTERVAL '5 day'),
('vencimiento', 7, 10,'¡ALERTA! Producto próximo a vencer o vencido. Venta Bloqueada.', 'vencido', CURRENT_DATE + INTERVAL '10 day'),
('stock', 9, NULL, 'Stock bajo: Cetirizina 10mg', 'stock_bajo', CURRENT_DATE),
('stock', 4, NULL, 'Stock bajo: Omeprazol 20mg', 'stock_bajo', CURRENT_DATE);

-- VENTAS (cabecera) - como tu ejemplo
INSERT INTO ventas (id, usuario_id, cliente_dni, total, metodo_pago, created_at) VALUES
(1, 1, '12345678', 23.00, 'Efectivo', '2025-12-09'),
(2, 2, '87654321', 8.00,  'Tarjeta',  '2025-12-09'),
(3, 1, '11223344', 54.50, 'Efectivo', '2025-12-08'),
(4, 2, '44332211', 10.50, 'Efectivo', '2025-12-08'),
(5, 1, '99887766', 36.00, 'Tarjeta',  '2025-12-07'),
(6, 2, '55443322', 12.50, 'Efectivo', '2025-12-07'),
(7, 1, '66554433', 59.00, 'Tarjeta',  '2025-12-06'),
(8, 2, '12345678', 7.00,  'Tarjeta',  '2025-12-06'),
(9, 1, '33221100', 28.00, 'Efectivo', '2025-12-05'),
(10,2, '77665544', 41.00, 'Tarjeta',  '2025-12-05')
ON CONFLICT (id) DO NOTHING;

-- DETALLE VENTAS (ojo: lote_id debe existir)
INSERT INTO venta_detalle (venta_id, lote_id, cantidad, precio_unit, subtotal)
VALUES
(1, 1, 2, 2.50, 5.00),
(1, 10, 1, 18.00, 18.00),
(2, 3, 1, 8.00, 8.00),
(3, 5, 3, 3.50, 10.50),
(3, 6, 2, 12.00, 24.00),
(3, 7, 1, 15.00, 15.00),
(4, 8, 1, 6.50, 6.50),
(4, 12, 1, 4.00, 4.00),
(5, 9, 2, 5.50, 11.00),
(5, 10, 1, 25.00, 25.00),
(6, 1, 5, 2.50, 12.50),
(7, 10, 3, 18.00, 54.00),
(7, 1, 2, 2.50, 5.00),
(8, 3, 2, 3.50, 7.00),
(9, 7, 1, 15.00, 15.00),
(9, 8, 2, 6.50, 13.00),
(10,3, 2, 8.00, 16.00),
(10,10,1, 25.00, 25.00);

COMMIT;

-- 🛠️ ARREGLAR SECUENCIAS (IMPORTANTE PARA EVITAR ERROR DE ID DUPLICADO)
-- Esto le dice a la BD que el próximo ID debe ser el máximo existente + 1
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('medicamentos_id_seq', (SELECT MAX(id) FROM medicamentos));
SELECT setval('lotes_id_seq', (SELECT MAX(id) FROM lotes));
SELECT setval('ventas_id_seq', (SELECT MAX(id) FROM ventas));
SELECT setval('venta_detalle_id_seq', (SELECT MAX(id) FROM venta_detalle));
SELECT setval('alertas_id_seq', (SELECT MAX(id) FROM alertas));
-- Fin de arreglo de secuencias