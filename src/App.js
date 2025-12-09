/**
 * App.js
 * Componente raíz que configura el routing entre Login y Dashboard.
 * Con autenticación y rutas protegidas
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Pages: Medicamentos
import MedicamentosList from './pages/medicamentos/MedicamentosList';
import MedicamentoDetail from './pages/medicamentos/MedicamentoDetail';
import MedicamentoForm from './pages/medicamentos/MedicamentoForm';

// Pages: Alertas
import AlertasVencimiento from './pages/alertas/AlertasVencimiento';
import AlertasStock from './pages/alertas/AlertasStock';

// Pages: Ventas
import ValidarLote from './pages/ventas/ValidarLote';
import VentaForm from './pages/ventas/VentaForm';
import VentasHistorial from './pages/ventas/VentasHistorial';

// Pages: Reportes
import KPIs from './pages/reportes/KPIs';
import ExportReport from './pages/reportes/ExportReport';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Medicamentos */}
            <Route path="/medicamentos" element={
              <ProtectedRoute>
                <MedicamentosList />
              </ProtectedRoute>
            } />
            <Route path="/medicamentos/new" element={
              <ProtectedRoute>
                <MedicamentoForm />
              </ProtectedRoute>
            } />
            <Route path="/medicamentos/edit/:id" element={
              <ProtectedRoute>
                <MedicamentoForm />
              </ProtectedRoute>
            } />
            <Route path="/medicamentos/:id" element={
              <ProtectedRoute>
                <MedicamentoDetail />
              </ProtectedRoute>
            } />

            {/* Alertas */}
            <Route path="/alertas/vencimiento" element={
              <ProtectedRoute>
                <AlertasVencimiento />
              </ProtectedRoute>
            } />
            <Route path="/alertas/stock" element={
              <ProtectedRoute>
                <AlertasStock />
              </ProtectedRoute>
            } />

            {/* Ventas */}
            <Route path="/ventas/validar-lote" element={
              <ProtectedRoute>
                <ValidarLote />
              </ProtectedRoute>
            } />
            <Route path="/ventas/nueva" element={
              <ProtectedRoute>
                <VentaForm />
              </ProtectedRoute>
            } />
            <Route path="/ventas/historial" element={
              <ProtectedRoute>
                <VentasHistorial />
              </ProtectedRoute>
            } />

            {/* Reportes */}
            <Route path="/reportes/kpis" element={
              <ProtectedRoute>
                <KPIs />
              </ProtectedRoute>
            } />
            <Route path="/reportes/exportar" element={
              <ProtectedRoute>
                <ExportReport />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;