import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Sistema de Control de Tickets</h2>
      </div>
      <div className="navbar-user">
        <span>Panel de Soporte Técnico</span>
      </div>
    </nav>
  );
};