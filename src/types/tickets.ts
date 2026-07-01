export type TicketStatus = 'abierto' | 'procesado' | 'cerrado';

export interface Ticket {
  // Datos de Identificación
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;

  // Datos de Ubicación y Empresa (Obligatorios para el mapa)
  empresa: string;
  sucursal: string;
  departamento: string;
  municipio: string;
  direccion: string;
  
  // Coordenadas obligatorias (sin ellas, el mapa no puede pintar el marcador)
  lat: number;
  lng: number;
}