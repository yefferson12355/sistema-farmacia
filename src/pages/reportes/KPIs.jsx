import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
  FiBarChart2,
  FiShoppingCart,
  FiPackage,
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

/**
 * KPIs
 * Dashboard avanzado con indicadores clave de rendimiento
 */
function KPIs() {
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(true);

  // Mock KPIs Data
  const kpisData = {
    ventasHoy: 2450.00,
    ventasMes: 45780.50,
    transaccionesHoy: 28,
    transaccionesMes: 485,
    ticketPromedio: 94.39,
    clientesNuevos: 12,
    productosVendidos: 1250,
    margenPromedio: 32.5,
    crecimientoVentas: 15.3,
    rotacionInventario: 4.2,
  };

  // Datos para gráfico de ventas por día
  const ventasPorDia = [
    { dia: 'Lun', ventas: 1850, transacciones: 22 },
    { dia: 'Mar', ventas: 2100, transacciones: 25 },
    { dia: 'Mié', ventas: 1950, transacciones: 24 },
    { dia: 'Jue', ventas: 2300, transacciones: 28 },
    { dia: 'Vie', ventas: 2800, transacciones: 35 },
    { dia: 'Sáb', ventas: 3200, transacciones: 42 },
    { dia: 'Dom', ventas: 1500, transacciones: 18 },
  ];

  // Datos para gráfico de categorías
  const ventasPorCategoria = [
    { categoria: 'Analgésicos', valor: 12500, color: '#3b82f6' },
    { categoria: 'Antibióticos', valor: 9800, color: '#22c55e' },
    { categoria: 'Vitaminas', valor: 7500, color: '#f59e0b' },
    { categoria: 'Antihipertensivos', valor: 6200, color: '#ef4444' },
    { categoria: 'Otros', valor: 9780.50, color: '#8b5cf6' },
  ];

  // Datos para gráfico de tendencia mensual
  const tendenciaMensual = [
    { mes: 'Ago', ventas: 38500 },
    { mes: 'Sep', ventas: 41200 },
    { mes: 'Oct', ventas: 39800 },
    { mes: 'Nov', ventas: 43500 },
    { mes: 'Dic', ventas: 48200 },
    { mes: 'Ene', ventas: 45780 },
  ];

  // Datos del semáforo de inventario
  const semaforoData = [
    { name: 'Vencidos', value: 18, color: '#ef4444' },
    { name: 'Por Vencer', value: 45, color: '#eab308' },
    { name: 'Vigentes', value: 1322, color: '#22c55e' },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const formatCurrency = (value) => `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiBarChart2 style={{ color: '#8b5cf6' }} />
              Dashboard de KPIs
            </h1>
            <p style={{ margin: '4px 0 0', color: '#666' }}>
              Indicadores clave de rendimiento del negocio
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
              <option value="trimestre">Trimestre</option>
              <option value="año">Este Año</option>
            </select>
            <button
              onClick={() => setLoading(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <FiRefreshCw />
              Actualizar
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
            Cargando KPIs...
          </div>
        ) : (
          <>
            {/* KPIs Cards Row 1 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #22c55e'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Ventas Hoy</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
                      {formatCurrency(kpisData.ventasHoy)}
                    </p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                    <FiDollarSign style={{ color: '#22c55e', fontSize: '20px' }} />
                  </div>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiTrendingUp /> +12% vs ayer
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Ventas del Mes</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {formatCurrency(kpisData.ventasMes)}
                    </p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                    <FiBarChart2 style={{ color: '#3b82f6', fontSize: '20px' }} />
                  </div>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiTrendingUp /> +{kpisData.crecimientoVentas}% vs mes anterior
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Ticket Promedio</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
                      {formatCurrency(kpisData.ticketPromedio)}
                    </p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <FiShoppingCart style={{ color: '#f59e0b', fontSize: '20px' }} />
                  </div>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#666' }}>
                  {kpisData.transaccionesMes} transacciones
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #8b5cf6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Margen Promedio</p>
                    <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>
                      {kpisData.margenPromedio}%
                    </p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
                    <FiTrendingUp style={{ color: '#8b5cf6', fontSize: '20px' }} />
                  </div>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiTrendingUp /> +2.3% vs mes anterior
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px',
              marginBottom: '24px'
            }}>
              {/* Ventas por Día */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: '16px' }}>
                  Ventas por Día de la Semana
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ventasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `S/${v/1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Ventas']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tendencia Mensual */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: '16px' }}>
                  Tendencia de Ventas (Últimos 6 meses)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={tendenciaMensual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `S/${v/1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Ventas']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <Area type="monotone" dataKey="ventas" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px'
            }}>
              {/* Ventas por Categoría */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: '16px' }}>
                  Ventas por Categoría
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ventasPorCategoria}
                      dataKey="valor"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {ventasPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Ventas']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Semáforo de Inventario */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: '16px' }}>
                  Estado del Inventario (Semáforo)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={semaforoData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {semaforoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: '12px', color: '#666' }}>Vencidos: {semaforoData[0].value}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#eab308',
                      borderRadius: '50%',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: '12px', color: '#666' }}>Por Vencer: {semaforoData[1].value}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#22c55e',
                      borderRadius: '50%',
                      marginRight: '6px'
                    }}></span>
                    <span style={{ fontSize: '12px', color: '#666' }}>Vigentes: {semaforoData[2].value}</span>
                  </div>
                </div>
              </div>

              {/* KPIs Adicionales */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: '16px' }}>
                  Indicadores Adicionales
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FiUsers style={{ color: '#3b82f6', fontSize: '20px' }} />
                      <span style={{ color: '#666' }}>Clientes Nuevos (mes)</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{kpisData.clientesNuevos}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FiPackage style={{ color: '#22c55e', fontSize: '20px' }} />
                      <span style={{ color: '#666' }}>Productos Vendidos</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{kpisData.productosVendidos.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FiRefreshCw style={{ color: '#f59e0b', fontSize: '20px' }} />
                      <span style={{ color: '#666' }}>Rotación Inventario</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{kpisData.rotacionInventario}x</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FiShoppingCart style={{ color: '#8b5cf6', fontSize: '20px' }} />
                      <span style={{ color: '#666' }}>Transacciones Hoy</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{kpisData.transaccionesHoy}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default KPIs;
