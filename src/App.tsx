import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { NuevaOrden } from './pages/NuevaOrden';
import MapaPage from './pages/MapaPage';
import { SeccionHojasServicio } from './pages/SeccionHojasServicio';
import './App.css';

import type { Ticket, TicketStatus } from './types/tickets';
import type { TabType } from './types/navigation';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Fallo en Servidor Principal',
      description: 'Revisar logs del contenedor de Docker.',
      status: 'abierto',
      createdAt: '10:15 AM',
      departamento: 'Santa Rosa',
      municipio: 'Chiquimulilla',
      direccion: 'Barrio Santiago',
      empresa: 'Unicomer S.A.',
      sucursal: 'Sucursal Central',
      lat: 14.0833,
      lng: -90.3833,
    },
  ]);

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-body">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <main className="app-content">
          {currentTab === 'dashboard' && (
            <Dashboard tickets={tickets} />
          )}

          {currentTab === 'tickets' && (
            <Tickets
              tickets={tickets}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTicket}
            />
          )}

          {currentTab === 'nueva-orden' && (
            <NuevaOrden
              onAddTicket={handleAddTicket}
            />
          )}

          {currentTab === 'mapa' && (
            <MapaPage tickets={tickets} />
          )}

          {currentTab === 'hojas-servicio' && (
            <SeccionHojasServicio
              tickets={tickets}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;