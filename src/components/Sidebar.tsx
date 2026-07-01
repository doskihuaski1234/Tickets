import React from 'react';
import type { TabType } from '../types/navigation'; // Importa el tipo central

interface SidebarProps {
  currentTab: TabType; // Cambiado de 'string' a 'TabType'
  setCurrentTab: (tab: TabType) => void; // Cambiado de 'string' a 'TabType'
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems: { id: TabType; label: string }[] = [ // Tipamos el array también
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'nueva-orden', label: 'Nueva Órden' },
    { id: 'mapa', label: 'Mapa en Tiempo Real' },
    { id: 'hojas-servicio', label: '📄 Hojas de Servicio' }
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li 
            key={item.id}
            className={`sidebar-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};