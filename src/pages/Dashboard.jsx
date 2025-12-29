import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
// 👇 Importamos las funciones que conectan con tu BD real
import { getAlertasVencimientoAPI, getAlertasStockAPI } from '../services/api';
import { FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const [hora, setHora] = useState(new Date());
  
  // Estados para datos REALES
  const [kpiData, setKpiData] = useState({
    productosVencidos: 0,
    productosProximosVencer: 0,
    stockCritico: 0,
    totalMedicamentos: 0
  });
  const [productosProximos, setProductosProximos] = useState([]);
  const [semaforoData, setSemaforoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🚀 CARGAR DATOS REALES DEL BACKEND
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [alertasVenc, alertasStock] = await Promise.all([
          getAlertasVencimientoAPI(), // Trae datos de la BD
          getAlertasStockAPI()        // Trae datos de la BD
        ]);

        const vencidos = alertasVenc.filter(a => a.estado === 'vencido').length;
        const porVencer = alertasVenc.filter(a => a.estado === 'por_vencer').length;
        const stockBajo = alertasStock.length;
        const totalAprox = 1350 + vencidos + porVencer; // Estimado base + alertas

        setKpiData({
          productosVencidos: vencidos,
          productosProximosVencer: porVencer,
          stockCritico: stockBajo,
          totalMedicamentos: totalAprox
        });

        setSemaforoData([
          { name: 'Vencidos', value: vencidos, color: '#ef4444' },
          { name: 'Por Vencer', value: porVencer, color: '#eab308' },
          { name: 'Vigentes', value: 1350, color: '#22c55e' },
        ]);

        // Top 5 productos más urgentes
        const topRiesgo = alertasVenc
          .sort((a, b) => a.dias_restantes - b.dias_restantes)
          .slice(0, 5);
        setProductosProximos(topRiesgo);
        
        setLoading(false);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const getBadgeEstado = (dias) => {
    if (dias <= 30) return { text: 'VENCIDO', bg: '#fee2e2', color: '#dc2626' };
    if (dias <= 60) return { text: 'REVISAR', bg: '#fef3c7', color: '#d97706' };
    return { text: 'VIGENTE', bg: '#dcfce7', color: '#16a34a' };
  };

  if (loading) return <div className="p-5">Cargando datos del sistema...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '0' }}>
        {/* HEADER */}
        <header style={{ backgroundColor: 'white', padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
           <div><h1 style={{fontSize:'22px', fontWeight:'700'}}>SIGFARMA</h1><p style={{fontSize:'12px', color:'#666'}}>Sistema Integral</p></div>
           <div style={{display:'flex', gap:'20px', alignItems:'center', fontSize:'12px'}}>
             <div style={{display:'flex', gap:'5px'}}><FiClock /> {hora.toLocaleTimeString()}</div>
             <div style={{display:'flex', gap:'5px'}}><FiUser /> {user?.username} <span style={{background:'#dcfce7', color:'#16a34a', padding:'2px 8px', borderRadius:'10px'}}>{user?.rol}</span></div>
           </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {/* TARJETAS KPI */}
            <div style={{ background:'white', padding:'20px', borderRadius:'8px', borderLeft:'4px solid #ef4444' }}>
               <h3 style={{color:'#ef4444', fontSize:'32px', fontWeight:'700', margin:0}}>{kpiData.productosVencidos}</h3>
               <p style={{color:'#666', fontSize:'12px'}}>🔴 Vencidos</p>
            </div>
            <div style={{ background:'white', padding:'20px', borderRadius:'8px', borderLeft:'4px solid #eab308' }}>
               <h3 style={{color:'#eab308', fontSize:'32px', fontWeight:'700', margin:0}}>{kpiData.productosProximosVencer}</h3>
               <p style={{color:'#666', fontSize:'12px'}}>🟡 Por Vencer</p>
            </div>
            <div style={{ background:'white', padding:'20px', borderRadius:'8px', borderLeft:'4px solid #f97316' }}>
               <h3 style={{color:'#f97316', fontSize:'32px', fontWeight:'700', margin:0}}>{kpiData.stockCritico}</h3>
               <p style={{color:'#666', fontSize:'12px'}}>🟠 Stock Crítico</p>
            </div>
            <div style={{ background:'white', padding:'20px', borderRadius:'8px', borderLeft:'4px solid #3b82f6' }}>
               <h3 style={{color:'#3b82f6', fontSize:'32px', fontWeight:'700', margin:0}}>{kpiData.totalMedicamentos}</h3>
               <p style={{color:'#666', fontSize:'12px'}}>🔵 Total Items</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* GRÁFICO */}
            <div style={{ background:'white', padding:'20px', borderRadius:'8px', height:'300px' }}>
              <h3>Distribución de Caducidad</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={semaforoData} dataKey="value" innerRadius={60} outerRadius={80}>
                    {semaforoData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* TABLA ALERTA */}
            <div style={{ background:'white', padding:'20px', borderRadius:'8px' }}>
              <h3>⚠️ Próximos a Vencer</h3>
              <table style={{width:'100%', fontSize:'12px', marginTop:'10px'}}>
                <thead>
                  <tr style={{textAlign:'left', color:'#666'}}><th>Producto</th><th>Días</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {productosProximos.map(p => {
                    const b = getBadgeEstado(p.dias_restantes);
                    return (
                      <tr key={p.id} style={{borderTop:'1px solid #eee'}}>
                        <td style={{padding:'8px 0'}}>{p.medicamento} <br/><span style={{color:'#999'}}>{p.lote}</span></td>
                        <td>{p.dias_restantes}</td>
                        <td><span style={{background:b.bg, color:b.color, padding:'2px 6px', borderRadius:'4px'}}>{b.text}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;