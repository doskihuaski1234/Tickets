export type TicketStatus = 'abierto' | 'procesado' | 'cerrado';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;

  empresa: string;
  sucursal: string;
  departamento: string;
  municipio: string;
  direccion: string;

  lat: number;
  lng: number;
}