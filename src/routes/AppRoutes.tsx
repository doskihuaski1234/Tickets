import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useState } from 'react';

import Dashboard from '../pages/Dashboard';
import Tickets from '../pages/Tickets';
import NuevaOrden from '../pages/NuevaOrden';
import MapaPage from '../pages/MapaPage';

import type { Ticket, TicketStatus } from '../types/tickets';

export default function AppRoutes() {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  // ➜ Crear ticket
  const addTicket = (
    title: string,
    description: string,
    location: string
  ) => {

    const newTicket: Ticket = {
      id: Date.now().toString(),
      title,
      description,
      status: 'abierto',
      createdAt: new Date().toISOString(),
      empresa: '',
      sucursal: '',
      departamento: '',
      municipio: '',
      direccion: location,
    };

    setTickets((prev) => [...prev, newTicket]);
  };

  // ➜ Cambiar estado
  const updateStatus = (
    id: string,
    status: TicketStatus
  ) => {

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status }
          : t
      )
    );
  };

  // ➜ Eliminar
  const deleteTicket = (id: string) => {

    setTickets((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard tickets={tickets} />}
        />

        <Route
          path="/tickets"
          element={
            <Tickets
              tickets={tickets}
              onUpdateStatus={updateStatus}
              onDelete={deleteTicket}
            />
          }
        />

        <Route
          path="/nueva"
          element={
            <NuevaOrden
              onAddTicket={addTicket}
            />
          }
        />

        <Route
          path="/mapa"
          element={
            <MapaPage tickets={tickets} />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}