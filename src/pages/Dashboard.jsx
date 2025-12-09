import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  FiClock,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const kpiData = {
    productosVencidos: 3,
    productosProximosVencer: 12, // 30-60 días (AMARILLO)
    stockCritico: 8,
    totalMedicamentos: 1385,
  };

  // Datos para el gráfico de semáforo de caducidad
  const semáforoData = [
    { name: 'Vencidos', value: 18, color: '#ef4444' },
    { name: 'Por Vencer', value: 12, color: '#eab308' },
    { name: 'Vigentes', value: 1355, color: '#22c55e' },
  ];

  // Mock data de productos próximos a vencer - ORDENADOS POR DÍAS RESTANTES (menor a mayor)
  const productosProximosAVencer = [
    { id: 1, nombre: 'Vitamina C 1000mg', lote: 'L-2025-004', diasRestantes: 5, estado: 'Rojo' },
    { id: 2, nombre: 'Ácido Acetilsalicílico 500mg', lote: 'L-2025-006', diasRestantes: 12, estado: 'Rojo' },
    { id: 3, nombre: 'Ibuprofeno 400mg', lote: 'L-2025-007', diasRestantes: 18, estado: 'Rojo' },
    { id: 4, nombre: 'Amoxicilina 250mg', lote: 'L-2025-002', diasRestantes: 38, estado: 'Amarillo' },
    { id: 5, nombre: 'Paracetamol 500mg', lote: 'L-2025-001', diasRestantes: 45, estado: 'Amarillo' },
  ].sort((a, b) => a.diasRestantes - b.diasRestantes);

  const getBadgeEstado = (diasRestantes) => {
    if (diasRestantes <= 30) return { text: 'VENCIDO', bg: '#fee2e2', color: '#dc2626' };
    if (diasRestantes <= 60) return { text: 'REVISAR', bg: '#fef3c7', color: '#d97706' };
    return { text: 'VIGENTE', bg: '#dcfce7', color: '#16a34a' };
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '0' }}>
        {/* HEADER */}
        <header style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e0e0e0',
          padding: '16px 24px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#333' }}>SIGFARMA</h1>
              <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '12px' }}>Sistema Integral de Gestión Farmacéutica</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '12px' }}>
                <FiMapPin style={{ color: '#1976d2' }} size={16} /> Puno, Perú
              </div>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '12px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span> Conectado
              </div>
            </div>
          </div>

          {/* Info Row */}
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock size={14} /> {hora.toLocaleTimeString('es-PE')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiUser size={14} /> {user?.nombre || 'Usuario'}
              <span style={{ 
                backgroundColor: user?.rol === 'admin' ? '#dcfce7' : '#e0f2fe',
                color: user?.rol === 'admin' ? '#16a34a' : '#0369a1',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {user?.rol || 'N/A'}
              </span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          minHeight: '0'
        }}>
          {/* KPIs Section - Sistema de Alertas con Semáforo */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '16px' }}>Sistema de Alertas - Semáforo de Caducidad</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* KPI: Productos Vencidos (ROJO) */}
              <div style={{
                background: 'white',
                borderLeft: '4px solid #ef4444',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>🔴 Productos Vencidos</p>
                <h3 style={{ color: '#ef4444', fontSize: '32px', fontWeight: '700', margin: 0 }}>{kpiData.productosVencidos}</h3>
                <p style={{ color: '#999', fontSize: '11px', margin: '4px 0 0 0' }}>Riesgo Alto - Acción Inmediata</p>
              </div>

              {/* KPI: Productos Por Vencer (AMARILLO) */}
              <div style={{
                background: 'white',
                borderLeft: '4px solid #eab308',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>🟡 Por Vencer (30-60 días)</p>
                <h3 style={{ color: '#eab308', fontSize: '32px', fontWeight: '700', margin: 0 }}>{kpiData.productosProximosVencer}</h3>
                <p style={{ color: '#999', fontSize: '11px', margin: '4px 0 0 0' }}>Riesgo Medio - Revisar Stock</p>
              </div>

              {/* KPI: Stock Crítico (NARANJA) */}
              <div style={{
                background: 'white',
                borderLeft: '4px solid #f97316',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>Stock Crítico</p>
                <h3 style={{ color: '#f97316', fontSize: '32px', fontWeight: '700', margin: 0 }}>{kpiData.stockCritico}</h3>
                <p style={{ color: '#999', fontSize: '11px', margin: '4px 0 0 0' }}>Requieren reabastecimiento</p>
              </div>

              {/* KPI: Total Medicamentos (AZUL) */}
              <div style={{
                background: 'white',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>🟢 Total Medicamentos</p>
                <h3 style={{ color: '#3b82f6', fontSize: '32px', fontWeight: '700', margin: 0 }}>{kpiData.totalMedicamentos}</h3>
                <p style={{ color: '#999', fontSize: '11px', margin: '4px 0 0 0' }}>En inventario</p>
              </div>
            </div>
          </section>

          {/* Semáforo Visual + Tabla de Productos */}
          <section style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Gráfico Dona - Semáforo de Caducidad */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#333', margin: '0 0 16px 0' }}>Distribución de Caducidad</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={semáforoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {semáforoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} unidades`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de Productos Próximos a Vencer */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              overflowX: 'auto'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#333', margin: '0 0 16px 0' }}>Productos Próximos a Vencer</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '10px 0', fontWeight: '600', color: '#666' }}>Producto</th>
                    <th style={{ textAlign: 'left', padding: '10px 0', fontWeight: '600', color: '#666' }}>Días</th>
                    <th style={{ textAlign: 'center', padding: '10px 0', fontWeight: '600', color: '#666' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productosProximosAVencer.map((prod) => {
                    const badge = getBadgeEstado(prod.diasRestantes);
                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 0', color: '#333' }}>
                          <div style={{ fontWeight: '500' }}>{prod.nombre}</div>
                          <div style={{ color: '#999', fontSize: '10px' }}>{prod.lote}</div>
                        </td>
                        <td style={{ padding: '10px 0', color: '#666', fontWeight: '500' }}>{prod.diasRestantes}</td>
                        <td style={{ padding: '10px 0', textAlign: 'center' }}>
                          <span style={{
                            background: badge.bg,
                            color: badge.color,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            {badge.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{
          background: '#1a1a1a',
          color: '#999',
          padding: '16px 24px',
          borderTop: '1px solid #333',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          textAlign: 'center',
          flexShrink: 0
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>SIGFARMA v1.0.0</p>
          <p style={{ margin: 0 }}>© 2025 Sistema Integral de Gestión Farmacéutica</p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
