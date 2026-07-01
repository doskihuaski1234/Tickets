import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useState } from 'react'

import Dashboard from '../pages/Dashboard'
import Tickets from '../pages/Tickets'
import NuevaOrden from '../pages/NuevaOrden'
import MapaPage from '../pages/MapaPage'

export default function AppRoutes() {

  const [tickets, setTickets] = useState<any[]>([])

  const addTicket = (
    title: string,
    description: string,
    location: string
  ) => {

    const newTicket = {
      id: Date.now(),
      title,
      description,
      location,
      status: 'Pendiente'
    }

    setTickets([...tickets, newTicket])
  }

  const updateStatus = (
    id: number,
    status: string
  ) => {

    setTickets(
      tickets.map((t) =>
        t.id === id
          ? { ...t, status }
          : t
      )
    )
  }

  const deleteTicket = (id: number) => {

    setTickets(
      tickets.filter((t) => t.id !== id)
    )
  }

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
              updateStatus={updateStatus}
              deleteTicket={deleteTicket}
            />
          }
        />

        <Route
          path="/nueva"
          element={
            <NuevaOrden
              addTicket={addTicket}
            />
          }
        />

        <Route
          path="/mapa"
          element={<MapaPage />}
        />

      </Routes>

    </BrowserRouter>
  )
}