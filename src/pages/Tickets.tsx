import React from 'react';
import type { Ticket, TicketStatus } from '../types/tickets';

interface TicketsProps {
  tickets: Ticket[];
  onUpdateStatus: (id: string, newStatus: TicketStatus) => void;
  onDelete: (id: string) => void;
}

export const Tickets: React.FC<TicketsProps> = ({
  tickets,
  onUpdateStatus,
  onDelete
}) => {

  const renderColumn = (status: TicketStatus, title: string, color: string) => {
    const filtered = tickets.filter(t => t.status === status);

    return (
      <div className="flex flex-col bg-slate-100 rounded-lg p-4 min-w-[300px]">
        
        <div className={`px-3 py-2 rounded ${color} text-white font-semibold mb-4`}>
          {title} ({filtered.length})
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {filtered.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-lg p-4 shadow border-l-4 border-slate-300">

              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">
                  {ticket.title}
                </h4>

                <button
                  onClick={() => window.confirm('¿Borrar?') && onDelete(ticket.id)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-3">
                {ticket.description.substring(0, 60)}...
              </p>

              <div className="flex gap-2">

                {/* ABIERTO → PROCESADO */}
                {status === 'abierto' && (
                  <button
                    onClick={() => onUpdateStatus(ticket.id, 'procesado')}
                    className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Atender
                  </button>
                )}

                {/* PROCESADO → CERRADO */}
                {status === 'procesado' && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'cerrado')}
                      className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded"
                    >
                      Cerrar
                    </button>

                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'abierto')}
                      className="flex-1 px-2 py-1 bg-slate-400 text-white text-xs rounded"
                    >
                      Reabrir
                    </button>
                  </>
                )}

              </div>

            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {renderColumn('abierto', 'Abiertos', 'bg-red-500')}
      {renderColumn('procesado', 'En Proceso', 'bg-blue-500')}
      {renderColumn('cerrado', 'Cerrados', 'bg-green-500')}
    </div>
  );
};

export default Tickets;