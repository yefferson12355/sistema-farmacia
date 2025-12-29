import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  getMedicamentos, 
  getAlertasVencimientoAPI, 
  getAlertasStockAPI 
} from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiActivity, 
  FiBox,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';

const KPIs = () => {
  const [loading, setLoading] = useState(true);
  
  // Estado para los indicadores
  const [indicadores, setIndicadores] = useState({
    valorInventario: 0,
    totalProductos: 0,
    productosVencidos: 0,
    productosPorVencer: 0,
    productosVigentes: 0,
    stockBajo: 0
  });

  // Datos para los gráficos
  const [datosSemaforo, setDatosSemaforo] = useState([]);
  
  // Datos estáticos para ventas (hasta que el backend tenga el endpoint de historial)
  const datosVentasSemana = [
    { name: 'Lun', ventas: 1200 }, { name: 'Mar', ventas: 2100 },
    { name: 'Mié', ventas: 800 }, { name: 'Jue', ventas: 1600 },
    { name: 'Vie', ventas: 2300 }, { name: 'Sáb', ventas: 3400 },
    { name: 'Dom', ventas: 1500 },
  ];

  useEffect(() => {
    cargarDatosReales();
  }, []);

  const cargarDatosReales = async () => {
    try {
      // 1. Peticiones en paralelo al servidor real
      const [medicamentos, alertasVenc, alertasStock] = await Promise.all([
        getMedicamentos(),
        getAlertasVencimientoAPI(),
        getAlertasStockAPI()
      ]);

      // 2. Cálculos Reales
      const totalItems = medicamentos.length;
      
      // Calcular valor monetario del inventario (Stock * Precio Venta)
      const valorTotal = medicamentos.reduce((acc, item) => {
        const stock = Number(item.stock_total || item.stock_actual || 0);
        const precio = Number(item.precio_venta || 0);
        return acc + (stock * precio);
      }, 0);

      const numVencidos = alertasVenc.filter(a => a.estado === 'vencido').length;
      const numPorVencer = alertasVenc.filter(a => a.estado === 'por_vencer').length;
      // Los vigentes son el total menos los que tienen problemas
      const numVigentes = Math.max(0, totalItems - (numVencidos + numPorVencer));

      // 3. Actualizar estado
      setIndicadores({
        valorInventario: valorTotal,
        totalProductos: totalItems,
        productosVencidos: numVencidos,
        productosPorVencer: numPorVencer,
        productosVigentes: numVigentes,
        stockBajo: alertasStock.length
      });

      setDatosSemaforo([
        { name: 'Vencidos', value: numVencidos, color: '#ef4444' },     // Rojo
        { name: 'Por Vencer', value: numPorVencer, color: '#eab308' },  // Amarillo
        { name: 'Vigentes', value: numVigentes, color: '#22c55e' },     // Verde
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error cargando KPIs:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Cargando indicadores en tiempo real...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {/* Encabezado */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
              Dashboard Financiero y Operativo
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Vista general del rendimiento de la farmacia basado en datos actuales.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '8px 16px', background: 'white', borderRadius: '20px', fontSize: '13px', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCalendar /> {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {/* Fila 1: Tarjetas Principales (Diseño Mejorado) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '30px' }}>
          
          {/* Card: Valor Inventario */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '12px', color: '#10b981' }}>
                  <FiDollarSign size={24} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', background: '#ecfdf5', padding: '4px 10px', borderRadius: '20px', height: 'fit-content' }}>
                  +Activo
                </span>
              </div>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
                {formatCurrency(indicadores.valorInventario)}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Valor Total del Inventario</p>
            </div>
          </div>

          {/* Card: Total Productos */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px', color: '#3b82f6' }}>
                <FiBox size={24} />
              </div>
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
              {indicadores.totalProductos}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Productos Registrados</p>
          </div>

          {/* Card: Stock Crítico */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: '#fff7ed', borderRadius: '12px', color: '#f97316' }}>
                <FiActivity size={24} />
              </div>
              {indicadores.stockBajo > 0 && (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#f97316', background: '#fff7ed', padding: '4px 10px', borderRadius: '20px', height: 'fit-content' }}>
                  Requiere Atención
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
              {indicadores.stockBajo}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Productos con Stock Bajo</p>
          </div>
        </div>

        {/* Fila 2: Gráficos y Detalles */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          
          {/* Gráfico de Ventas (Simulado por ahora) */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Proyección de Ventas (Semana)</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={datosVentasSemana}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`S/ ${value}`, 'Venta']}
                  />
                  <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Estado del Inventario (Real) */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Salud del Inventario</h3>
            <div style={{ height: '220px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosSemaforo}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosSemaforo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Texto Central */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{indicadores.totalProductos}</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Lotes</p>
              </div>
            </div>

            {/* Leyenda Personalizada */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>Vigentes</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{indicadores.productosVigentes}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }}></div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>Por Vencer</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{indicadores.productosPorVencer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <span style={{ fontSize: '13px', color: '#475569' }}>Vencidos</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{indicadores.productosVencidos}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default KPIs;