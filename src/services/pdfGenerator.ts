import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Ticket } from '../types/tickets';
import type { UserOptions } from 'jspdf-autotable';

export interface FormData {
  tecnico: string;
  diagnostico: string;
  resultado: string;
  telefono: string;
  emailCliente: string;
}

interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

export const generarHojaServicioPDF = (ticket: Ticket, formData: FormData) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  
  doc.setFontSize(22);
  doc.text('Hoja de Servicio Técnico', 14, 20);
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, 14, 28);

  doc.autoTable({
    startY: 35,
    head: [['Campo', 'Detalle']],
    body: [
      ['Ticket ID', ticket.id],
      ['Cliente/Empresa', ticket.empresa],
      ['Sucursal', ticket.sucursal],
      ['Técnico', formData.tecnico],
      ['Diagnóstico', formData.diagnostico],
      ['Resultado', formData.resultado],
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  });

  return doc;
};