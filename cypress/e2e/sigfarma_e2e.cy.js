/// <reference types="cypress" />

describe('SIGFARMA End-to-End System Tests', () => {
  // CP-SYS-01: Ciclo Completo de Venta y Actualización de Inventario
  it('CP-SYS-01: Venta y actualización de inventario', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('vendedor');
    cy.get('input[name="password"]').type('venta123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Nueva Venta').click();
    cy.url().should('include', '/ventas/nueva');
    cy.contains('Paracetamol 500mg').click();
    cy.get('input[name="cantidad"]').clear().type('5');
    cy.contains('Agregar al carrito').click();
    cy.contains('Procesar Venta').click();
    cy.contains('Venta procesada con éxito').should('exist');
    cy.contains('Inventario').click();
    cy.url().should('include', '/medicamentos');
    cy.contains('Paracetamol 500mg').parent().contains('95');
    cy.contains('Historial').click();
    cy.url().should('include', '/ventas/historial');
    cy.contains('Paracetamol 500mg').should('exist');
  });

  // CP-SYS-02: Validación de Regla de Negocio (Bloqueo por Vencimiento)
  it('CP-SYS-02: Bloqueo por vencimiento', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('vendedor');
    cy.get('input[name="password"]').type('venta123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Riesgo Vencimiento').should('have.class', 'alerta-roja');
    cy.contains('Nueva Venta').click();
    cy.url().should('include', '/ventas/nueva');
    cy.contains('Producto Crítico').click(); // Ajusta el nombre según tu producto crítico
    cy.get('input[name="cantidad"]').clear().type('1');
    cy.contains('Agregar al carrito').click();
    cy.contains('Procesar Venta').should('be.disabled');
    cy.contains('Producto vencido o próximo a vencer').should('exist');
  });

  // CP-SYS-03: Seguridad y Control de Acceso (Roles)
  it('CP-SYS-03: Seguridad y control de acceso', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('vendedor');
    cy.get('input[name="password"]').type('venta123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('nav').should('not.contain', 'Reportes');
    cy.visit('http://localhost:3000/reportes/kpis');
    cy.url().should('not.include', '/reportes/kpis');
    cy.contains('Acceso Denegado').should('exist');
    cy.contains('Cerrar sesión').click();
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('nav').should('contain', 'Reportes');
  });
  // CP-SYS-04: Login fallido y validación de mensajes de error
  it('CP-SYS-04: Login fallido muestra mensaje de error', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('usuario_incorrecto');
    cy.get('input[name="password"]').type('clave_incorrecta');
    cy.get('button[type="submit"]').click();
    cy.contains('Credenciales incorrectas').should('exist');
  });

  // CP-SYS-05: Validación de receta médica requerida
  it('CP-SYS-05: No permite venta sin receta si es requerida', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('vendedor');
    cy.get('input[name="password"]').type('venta123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Nueva Venta').click();
    cy.url().should('include', '/ventas/nueva');
    cy.contains('Amoxicilina 500mg').click(); // Ajusta el nombre según tu producto con receta
    cy.get('input[name="cantidad"]').clear().type('1');
    cy.contains('Agregar al carrito').click();
    cy.contains('Procesar Venta').click();
    cy.contains('Receta médica requerida').should('exist');
  });

  // CP-SYS-06: Exportación de reportes (PDF/Excel)
  it('CP-SYS-06: Exporta reporte de inventario a PDF y Excel', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Reportes').click();
    cy.url().should('include', '/reportes/exportar');
    cy.contains('Inventario General').click();
    cy.contains('Exportar PDF').click();
    cy.contains('Reporte PDF generado').should('exist');
    cy.contains('Exportar Excel').click();
    cy.contains('Reporte Excel generado').should('exist');
  });

  // CP-SYS-07: Persistencia de sesión tras recarga
  it('CP-SYS-07: Mantiene sesión tras recargar página', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.reload();
    cy.url().should('include', '/dashboard');
    cy.get('nav').should('contain', 'Reportes');
  });
});
