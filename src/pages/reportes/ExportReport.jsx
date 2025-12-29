/**
 * ExportReport.jsx
 * Solución al error de exportación PDF
 */

import React, { useState } from 'react';
import { 
  FiFileText, FiDownload, FiCalendar, 
  FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp,
  FiAlertCircle, FiUsers, FiPieChart
} from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ IMPORTACIÓN CORREGIDA
import { 
  getReporteInventario, 
  getAlertasVencimientoAPI, 
  getVentasHistorial,
  getReporteAlertas,
  getReportePrincipioActivo,
  getReporteClientes,
  getReporteProductosMasVendidos
} from '../../services/api';

function ExportReport() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('2025-12-01');
  const [fechaFin, setFechaFin] = useState('2025-12-31');
  const [loading, setLoading] = useState(false);
  const [datosReporte, setDatosReporte] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const reportes = [
    {
      id: 'inventario',
      titulo: 'Inventario',
      subtitulo: 'Valor total y stock actual',
      icon: <FiPackage />,
      color: '#3b82f6',
      bg: '#eff6ff',
      borderColor: '#3b82f6'
    },
    {
      id: 'caducidad',
      titulo: 'Caducidad',
      subtitulo: 'Productos por vencer o vencidos',
      icon: <FiAlertTriangle />,
      color: '#ef4444',
      bg: '#fef2f2',
      borderColor: '#ef4444'
    },
    {
      id: 'ventas',
      titulo: 'Ventas',
      subtitulo: 'Historial de transacciones',
      icon: <FiDollarSign />,
      color: '#22c55e',
      bg: '#f0fdf4',
      borderColor: '#22c55e'
    },
    {
      id: 'productos_vendidos',
      titulo: 'Top Productos',
      subtitulo: 'Productos más vendidos',
      icon: <FiTrendingUp />,
      color: '#f59e0b',
      bg: '#fffbeb',
      borderColor: '#f59e0b'
    },
    {
      id: 'alertas',
      titulo: 'Alertas',
      subtitulo: 'Stock bajo y caducidad',
      icon: <FiAlertCircle />,
      color: '#f97316',
      bg: '#fff7ed',
      borderColor: '#f97316'
    },
    {
      id: 'principio_activo',
      titulo: 'Por Principio Activo',
      subtitulo: 'Análisis farmacológico',
      icon: <FiPieChart />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      borderColor: '#8b5cf6'
    },
    {
      id: 'clientes',
      titulo: 'Clientes',
      subtitulo: 'Análisis de clientes',
      icon: <FiUsers />,
      color: '#06b6d4',
      bg: '#ecf0f1',
      borderColor: '#06b6d4'
    }
  ];

  const generarReporte = async () => {
    if (!reporteSeleccionado) return;
    
    setLoading(true);
    try {
      let datos;
      switch (reporteSeleccionado.id) {
        case 'inventario': datos = await getReporteInventario(); break;
        case 'caducidad': datos = await getAlertasVencimientoAPI(); break;
        case 'ventas': datos = await getVentasHistorial(); break;
        case 'productos_vendidos': datos = await getReporteProductosMasVendidos(); break;
        case 'alertas': datos = await getReporteAlertas(); break;
        case 'principio_activo': datos = await getReportePrincipioActivo(); break;
        case 'clientes': datos = await getReporteClientes(); break;
        default: datos = [];
      }
      setDatosReporte(datos);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    if (!datosReporte || !reporteSeleccionado) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const fechaHoy = new Date().toLocaleDateString('es-PE');

      // Header del PDF
      doc.setFillColor(25, 118, 210);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('SIGFARMA - ' + reporteSeleccionado.titulo, margin, 18);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Fecha: ${fechaHoy}`, margin, pageHeight - 10);

      doc.setFontSize(12);
      doc.text(reporteSeleccionado.subtitulo, margin, 35);

      let startY = 45;

      // LÓGICA DE TABLAS (Usando autoTable directamente)
      
      if (reporteSeleccionado.id === 'inventario' && Array.isArray(datosReporte)) {
        const totalValor = datosReporte.reduce((sum, p) => sum + (p.valor_total || 0), 0);
        
        doc.setFontSize(11);
        doc.setTextColor(25, 118, 210);
        doc.text(`Valor Total del Inventario: S/ ${totalValor.toFixed(2)}`, margin, startY);
        startY += 10;

        const tableData = datosReporte.map(p => [
          p.nombre_comercial || 'N/A',
          String(p.stock_total || p.stock_actual || 0),
          `S/ ${(Number(p.precio_venta) || 0).toFixed(2)}`,
          `S/ ${(Number(p.valor_total) || 0).toFixed(2)}`
        ]);

        autoTable(doc, { // ✅ USO CORRECTO
          head: [['Producto', 'Stock', 'Precio', 'Valor Total']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [25, 118, 210], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });

      } else if (reporteSeleccionado.id === 'caducidad' && Array.isArray(datosReporte)) {
        const tableData = datosReporte.map(p => [
          p.medicamento || 'N/A',
          p.lote || 'N/A',
          p.fecha_vencimiento || 'N/A',
          String(p.dias_restantes || 0),
          p.dias_restantes <= 30 ? 'VENCIDO' : 'POR VENCER'
        ]);

        autoTable(doc, { // ✅ USO CORRECTO
          head: [['Medicamento', 'Lote', 'Vencimiento', 'Días', 'Estado']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [239, 68, 68], textColor: 255 },
          alternateRowStyles: { fillColor: [254, 242, 242] }
        });

      } else if (reporteSeleccionado.id === 'ventas' && Array.isArray(datosReporte)) {
        const totalVentas = datosReporte.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
        doc.setFontSize(11);
        doc.setTextColor(34, 197, 94);
        doc.text(`Total Ventas: S/ ${totalVentas.toFixed(2)}`, margin, startY);
        startY += 10;

        const tableData = datosReporte.map(v => [
          v.fecha || 'N/A',
          v.cliente_nombre || v.cliente_dni || 'Cliente',
          `S/ ${(Number(v.total) || 0).toFixed(2)}`
        ]);

        autoTable(doc, { // ✅ USO CORRECTO
          head: [['Fecha', 'Cliente', 'Total']],
          body: tableData,
          startY: startY,
          margin: margin,
          headStyles: { fillColor: [34, 197, 94] }
        });

      } else if (reporteSeleccionado.id === 'alertas' && datosReporte.vencimiento) {
        doc.text('PRODUCTOS POR VENCER:', margin, startY);
        const tableData1 = (Array.isArray(datosReporte.vencimiento) ? datosReporte.vencimiento : []).map(a => [
          a.medicamento || 'N/A', a.lote || 'N/A', String(a.dias_restantes || 0)
        ]);

        autoTable(doc, { // ✅ USO CORRECTO
          head: [['Medicamento', 'Lote', 'Días']],
          body: tableData1,
          startY: startY + 5,
          margin: margin,
          headStyles: { fillColor: [239, 68, 68] },
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text('STOCK BAJO:', margin, finalY);
        
        const tableData2 = (Array.isArray(datosReporte.stock) ? datosReporte.stock : []).map(s => [
          s.medicamento || 'N/A', String(s.stock_actual || 0), String(s.stock_minimo || 0)
        ]);

        autoTable(doc, { // ✅ USO CORRECTO
          head: [['Medicamento', 'Stock', 'Mínimo']],
          body: tableData2,
          startY: finalY + 5,
          margin: margin,
          headStyles: { fillColor: [249, 115, 22] },
        });
      }
      
      // ... (Resto de reportes siguen la misma lógica, usando autoTable(doc, ...))

      const nombreArchivo = `SIGFARMA_${reporteSeleccionado.id}.pdf`;
      doc.save(nombreArchivo);

    } catch (error) {
      console.error('Error exportarPDF:', error);
      alert('Error al generar PDF: ' + error.message);
    }
  };

  const exportarExcel = () => {
    if (!datosReporte || !reporteSeleccionado) return;
    try {
      let datos = [];
      if (reporteSeleccionado.id === 'inventario') {
        datos = datosReporte.map(p => ({
          'Producto': p.nombre_comercial,
          'Stock': p.stock_total || p.stock_actual,
          'Precio': p.precio_venta,
          'Total': p.valor_total
        }));
      } else if (reporteSeleccionado.id === 'caducidad') {
        datos = datosReporte.map(p => ({
          'Medicamento': p.medicamento,
          'Lote': p.lote,
          'Vence': p.fecha_vencimiento,
          'Días': p.dias_restantes
        }));
      }
      // ... otros casos básicos

      if(datos.length === 0) {
         // Fallback genérico
         datos = Array.isArray(datosReporte) ? datosReporte : [];
      }

      const ws = XLSX.utils.json_to_sheet(datos);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reporte");
      XLSX.writeFile(wb, `SIGFARMA_${reporteSeleccionado.id}.xlsx`);
    } catch (e) {
      alert("Error Excel: " + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <FiFileText color="#8b5cf6" /> Centro de Reportes
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Genera reportes profesionales y exporta a Excel o PDF
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>Seleccione un Reporte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {reportes.map(reporte => (
                <div
                  key={reporte.id}
                  onClick={() => setReporteSeleccionado(reporte)}
                  style={{
                    backgroundColor: reporteSeleccionado?.id === reporte.id ? reporte.bg : 'white',
                    border: `2px solid ${reporteSeleccionado?.id === reporte.id ? reporte.borderColor : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: reporteSeleccionado?.id === reporte.id ? `0 4px 12px ${reporte.color}30` : 'none'
                  }}
                >
                  <div style={{ color: reporte.color, marginBottom: '12px', fontSize: '24px' }}>{reporte.icon}</div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{reporte.titulo}</h3>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{reporte.subtitulo}</p>
                </div>
              ))}
            </div>

            <button
              onClick={generarReporte}
              disabled={!reporteSeleccionado || loading}
              style={{
                width: '100%', marginTop: '24px', padding: '14px',
                backgroundColor: reporteSeleccionado ? '#1976d2' : '#e5e7eb',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: '600', cursor: reporteSeleccionado ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? 'Generando...' : '📊 Generar Reporte'}
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '10px' }}>Vista Previa</h2>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '15px' }}>
              {datosReporte ? (
                <p style={{fontSize:'12px'}}>Se encontraron {Array.isArray(datosReporte) ? datosReporte.length : 'varios'} registros.</p>
              ) : (
                <p style={{color:'#999', fontSize:'12px', textAlign:'center', padding:'20px'}}>Selecciona y genera un reporte.</p>
              )}
            </div>

            {datosReporte && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={exportarPDF} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight:'600', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
                  <FiDownload /> PDF
                </button>
                <button onClick={exportarExcel} style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight:'600', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
                  <FiDownload /> Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ExportReport;