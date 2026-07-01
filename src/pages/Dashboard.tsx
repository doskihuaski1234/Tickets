import React from 'react';
import type { Ticket } from '../types/tickets';

interface DashboardProps {
  tickets: Ticket[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {

  const abiertos = tickets.filter(t => t.status === 'abierto').length;
  const enProceso = tickets.filter(t => t.status === 'procesado').length;
  const cerrados = tickets.filter(t => t.status === 'cerrado').length;

  const stats = [
    { label: 'Abiertos', value: abiertos, color: 'bg-red-100 text-red-700', icon: '📌' },
    { label: 'En Proceso', value: enProceso, color: 'bg-blue-100 text-blue-700', icon: '⏳' },
    { label: 'Cerrados', value: cerrados, color: 'bg-green-100 text-green-700', icon: '✓' },
    { label: 'Total', value: tickets.length, color: 'bg-slate-100 text-slate-700', icon: '📊' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title mb-8">Panel de Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-6 shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-75">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Tickets Recientes
        </h2>

        {tickets.length === 0 ? (
          <p className="text-slate-500">No hay tickets aún</p>
        ) : (
          <div className="space-y-3">

            {tickets.slice(0, 5).map(ticket => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded hover:bg-slate-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{ticket.title}</p>
                  <p className="text-sm text-slate-500">{ticket.direccion}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      ticket.status === 'abierto'
                        ? 'bg-red-100 text-red-700'
                        : ticket.status === 'procesado'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.status === 'abierto'
                      ? 'Abierto'
                      : ticket.status === 'procesado'
                        ? 'En Proceso'
                        : 'Cerrado'}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;