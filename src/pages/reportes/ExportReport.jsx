/**
 * ExportReport.jsx
 * Módulo: CENTRO DE REPORTES PROFESIONAL
 * Exportación a PDF y Excel con 7 tipos de reportes
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
import 'jspdf-autotable';
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
        case 'inventario':
          datos = await getReporteInventario();
          break;
        case 'caducidad':
          datos = await getAlertasVencimientoAPI();
          break;
        case 'ventas':
          datos = await getVentasHistorial();
          break;
        case 'productos_vendidos':
          datos = await getReporteProductosMasVendidos();
          break;
        case 'alertas':
          datos = await getReporteAlertas();
          break;
        case 'principio_activo':
          datos = await getReportePrincipioActivo();
          break;
        case 'clientes':
          datos = await getReporteClientes();
          break;
        default:
          datos = [];
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

      // Fecha formateada simple (compatible con jsPDF)
      const fechaHoy = new Date().toLocaleDateString('es-PE');

      // Header
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

      // Contenido según tipo de reporte
      let startY = 45;

      if (reporteSeleccionado.id === 'inventario' && Array.isArray(datosReporte)) {
        const totalValor = datosReporte.reduce((sum, p) => sum + (p.valor_total || 0), 0);
        
        doc.setFontSize(11);
        doc.setTextColor(25, 118, 210);
        doc.text(`Valor Total del Inventario: S/ ${totalValor.toFixed(2)}`, margin, startY);
        startY += 10;

        const tableData = datosReporte.map(p => [
          p.nombre_comercial || 'N/A',
          String(p.stock_total || 0),
          `S/ ${(p.precio_venta || 0).toFixed(2)}`,
          `S/ ${(p.valor_total || 0).toFixed(2)}`
        ]);

        doc.autoTable({
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

        doc.autoTable({
          head: [['Medicamento', 'Lote', 'Vencimiento', 'Días', 'Estado']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [239, 68, 68], textColor: 255 },
          alternateRowStyles: { fillColor: [254, 242, 242] }
        });
      } else if (reporteSeleccionado.id === 'ventas' && Array.isArray(datosReporte)) {
        const totalVentas = datosReporte.reduce((sum, v) => sum + (v.total || 0), 0);
        
        doc.setFontSize(11);
        doc.setTextColor(34, 197, 94);
        doc.text(`Total de Ventas: S/ ${totalVentas.toFixed(2)}`, margin, startY);
        startY += 10;

        const tableData = datosReporte.map(v => [
          v.fecha || 'N/A',
          v.cliente_nombre || v.cliente_dni || 'N/A',
          String((Array.isArray(v.productos) ? v.productos.length : 0) || 0),
          `S/ ${(v.total || 0).toFixed(2)}`
        ]);

        doc.autoTable({
          head: [['Fecha', 'Cliente', 'Productos', 'Total']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [34, 197, 94], textColor: 255 },
          alternateRowStyles: { fillColor: [240, 253, 244] }
        });
      } else if (reporteSeleccionado.id === 'productos_vendidos' && Array.isArray(datosReporte)) {
        const tableData = datosReporte.map(p => [
          p.nombre || 'N/A',
          String(p.cantidadVendida || 0),
          `S/ ${(p.ingresos || 0).toFixed(2)}`
        ]);

        doc.autoTable({
          head: [['Producto', 'Cantidad', 'Ingresos']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [245, 158, 11], textColor: 255 },
          alternateRowStyles: { fillColor: [255, 251, 235] }
        });
      } else if (reporteSeleccionado.id === 'alertas' && datosReporte.vencimiento) {
        doc.text('PRODUCTOS POR VENCER:', margin, startY);
        const tableData1 = (Array.isArray(datosReporte.vencimiento) ? datosReporte.vencimiento : []).map(a => [
          a.medicamento || 'N/A',
          a.lote || 'N/A',
          String(a.dias_restantes || 0)
        ]);

        doc.autoTable({
          head: [['Medicamento', 'Lote', 'Días']],
          body: tableData1,
          startY: startY + 5,
          margin: margin,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [239, 68, 68] },
        });

        startY += 50;
        doc.text('PRODUCTOS CON STOCK BAJO:', margin, startY);
        const tableData2 = (Array.isArray(datosReporte.stock) ? datosReporte.stock : []).map(s => [
          s.medicamento || 'N/A',
          String(s.stock_actual || 0),
          String(s.stock_minimo || 0)
        ]);

        doc.autoTable({
          head: [['Medicamento', 'Stock Actual', 'Stock Mínimo']],
          body: tableData2,
          startY: startY + 5,
          margin: margin,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [249, 115, 22] },
        });
      } else if (reporteSeleccionado.id === 'principio_activo' && Array.isArray(datosReporte)) {
        const tableData = datosReporte.map(p => [
          p.principio_activo || 'N/A',
          p.nombre_comercial || 'N/A',
          String(p.stock || 0),
          `S/ ${(p.precio || 0).toFixed(2)}`,
          `S/ ${(p.valor_total || 0).toFixed(2)}`
        ]);

        doc.autoTable({
          head: [['Principio Activo', 'Nombre Comercial', 'Stock', 'Precio', 'Valor']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [139, 92, 246], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 243, 255] }
        });
      } else if (reporteSeleccionado.id === 'clientes' && Array.isArray(datosReporte)) {
        const tableData = datosReporte.map(c => [
          c.nombre || 'N/A',
          c.dni || 'N/A',
          String(c.cantidadTransacciones || 0),
          `S/ ${(c.totalCompras || 0).toFixed(2)}`,
          c.ultimaCompra || 'N/A'
        ]);

        doc.autoTable({
          head: [['Nombre', 'DNI', 'Transacciones', 'Total Compras', 'Última Compra']],
          body: tableData,
          startY: startY,
          margin: margin,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [6, 182, 212], textColor: 255 },
          alternateRowStyles: { fillColor: [236, 240, 241] }
        });
      }

      const nombreArchivo = `reporte_${reporteSeleccionado.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error en exportarPDF:', error);
      alert('Error al exportar PDF: ' + error.message);
    }
  };

  const exportarExcel = () => {
    if (!datosReporte || !reporteSeleccionado) return;

    try {
      let datos = [];
      let nombreHoja = reporteSeleccionado.id;

      if (reporteSeleccionado.id === 'inventario' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(p => ({
          'Producto': p.nombre_comercial || 'N/A',
          'Principio Activo': p.principio_activo || 'N/A',
          'Stock': Number(p.stock_total) || 0,
          'Precio': Number(p.precio_venta) || 0,
          'Valor Total': Number(p.valor_total) || 0
        }));
      } else if (reporteSeleccionado.id === 'caducidad' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(p => ({
          'Medicamento': p.medicamento || 'N/A',
          'Lote': p.lote || 'N/A',
          'Fecha Vencimiento': p.fecha_vencimiento || 'N/A',
          'Días Restantes': Number(p.dias_restantes) || 0,
          'Estado': p.dias_restantes <= 30 ? 'VENCIDO' : 'POR VENCER'
        }));
      } else if (reporteSeleccionado.id === 'ventas' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(v => ({
          'Fecha': v.fecha || 'N/A',
          'Cliente': v.cliente_nombre || v.cliente_dni || 'N/A',
          'Cantidad Productos': Number(Array.isArray(v.productos) ? v.productos.length : 0),
          'Total': Number(v.total) || 0,
          'Vendedor': v.vendedor || 'N/A',
          'Método Pago': v.metodoPago || 'N/A'
        }));
      } else if (reporteSeleccionado.id === 'productos_vendidos' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(p => ({
          'Producto': p.nombre || 'N/A',
          'Cantidad Vendida': Number(p.cantidadVendida) || 0,
          'Ingresos': Number(p.ingresos) || 0
        }));
      } else if (reporteSeleccionado.id === 'alertas') {
        if (Array.isArray(datosReporte.vencimiento) && datosReporte.vencimiento.length > 0) {
          datos.push({ 'ALERTAS DE VENCIMIENTO': '---' });
          datos = datos.concat(datosReporte.vencimiento.map(a => ({
            'Medicamento': a.medicamento || 'N/A',
            'Lote': a.lote || 'N/A',
            'Días Restantes': Number(a.dias_restantes) || 0
          })));
        }
        if (Array.isArray(datosReporte.stock) && datosReporte.stock.length > 0) {
          datos.push({ 'ALERTAS DE STOCK BAJO': '---' });
          datos = datos.concat(datosReporte.stock.map(s => ({
            'Medicamento': s.medicamento || 'N/A',
            'Stock Actual': Number(s.stock_actual) || 0,
            'Stock Mínimo': Number(s.stock_minimo) || 0
          })));
        }
      } else if (reporteSeleccionado.id === 'principio_activo' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(p => ({
          'Principio Activo': p.principio_activo || 'N/A',
          'Nombre Comercial': p.nombre_comercial || 'N/A',
          'Stock': Number(p.stock) || 0,
          'Precio': Number(p.precio) || 0,
          'Valor Total': Number(p.valor_total) || 0
        }));
      } else if (reporteSeleccionado.id === 'clientes' && Array.isArray(datosReporte)) {
        datos = datosReporte.map(c => ({
          'Nombre': c.nombre || 'N/A',
          'DNI': c.dni || 'N/A',
          'Transacciones': Number(c.cantidadTransacciones) || 0,
          'Total Compras': Number(c.totalCompras) || 0,
          'Última Compra': c.ultimaCompra || 'N/A'
        }));
      }

      if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(datos);
      
      // Ajustar ancho de columnas
      const colWidths = Object.keys(datos[0] || {}).map(() => ({ wch: 15 }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, nombreHoja.substring(0, 31)); // Excel limita nombres a 31 caracteres
      
      const nombreArchivo = `reporte_${reporteSeleccionado.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } catch (error) {
      console.error('Error en exportarExcel:', error);
      alert('Error al exportar Excel: ' + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <FiFileText color="#8b5cf6" /> Centro de Reportes
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
            Genera reportes profesionales y exporta a Excel o PDF
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Panel izquierdo - Grid de reportes */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>Seleccione un Reporte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {reportes.map(reporte => (
                <div
                  key={reporte.id}
                  onMouseEnter={() => setHoveredRow(reporte.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setReporteSeleccionado(reporte)}
                  style={{
                    backgroundColor: reporteSeleccionado?.id === reporte.id ? reporte.bg : 'white',
                    border: `2px solid ${reporteSeleccionado?.id === reporte.id ? reporte.borderColor : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: hoveredRow === reporte.id ? 'translateY(-2px)' : 'none',
                    boxShadow: hoveredRow === reporte.id ? `0 4px 12px ${reporte.color}30` : 'none'
                  }}
                >
                  <div style={{ color: reporte.color, marginBottom: '12px', fontSize: '24px' }}>
                    {reporte.icon}
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                    {reporte.titulo}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                    {reporte.subtitulo}
                  </p>
                </div>
              ))}
            </div>

            {/* Filtros de fecha para reportes específicos */}
            {['ventas'].includes(reporteSeleccionado?.id) && (
              <div style={{ marginTop: '24px', backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCalendar /> Período del Reporte
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Fecha Inicio</label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Fecha Fin</label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botón generar */}
            <button
              onClick={generarReporte}
              disabled={!reporteSeleccionado || loading}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '14px',
                backgroundColor: reporteSeleccionado ? '#1976d2' : '#e5e7eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: reporteSeleccionado ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Generando...' : '📊 Generar Reporte'}
            </button>
          </div>

          {/* Panel derecho - Vista previa y exportación */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Vista Previa</h2>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>
                {reporteSeleccionado?.subtitulo || 'Selecciona un reporte'}
              </p>
            </div>

            {!datosReporte ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <FiFileText size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ fontSize: '14px' }}>Genera un reporte para verlo aquí</p>
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {/* Tabla genérica para todos los reportes */}
                {Array.isArray(datosReporte) && datosReporte.length > 0 && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                        {Object.keys(datosReporte[0]).map((key, i) => (
                          <th 
                            key={i}
                            style={{ 
                              padding: '10px 8px', 
                              textAlign: 'left', 
                              fontWeight: '600',
                              color: '#6b7280'
                            }}
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datosReporte.slice(0, 10).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          {Object.values(row).map((val, j) => (
                            <td 
                              key={j}
                              style={{ 
                                padding: '8px 8px',
                                color: '#475569'
                              }}
                            >
                              {typeof val === 'number' ? val.toFixed(2) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {datosReporte.vencimiento && (
                  <div>
                    <h4 style={{ color: '#1e293b', marginTop: '16px' }}>Productos por Vencer</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#fef2f2' }}>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Medicamento</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Días</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datosReporte.vencimiento.slice(0, 5).map((v, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '6px 8px' }}>{v.medicamento}</td>
                            <td style={{ padding: '6px 8px', color: '#ef4444', fontWeight: '600' }}>{v.dias_restantes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Botones de exportación */}
            {datosReporte && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={exportarPDF}
                  style={{ 
                    flex: 1,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '6px', 
                    padding: '10px', 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  <FiDownload /> PDF
                </button>
                <button
                  onClick={exportarExcel}
                  style={{ 
                    flex: 1,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '6px', 
                    padding: '10px', 
                    backgroundColor: '#22c55e', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
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
