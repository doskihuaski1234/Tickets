import React, { useState } from 'react';
import { generarHojaServicioPDF } from '../services/pdfGenerator';
import type { Ticket } from '../types/tickets';

interface Props {
  tickets: Ticket[];
}

export const SeccionHojasServicio: React.FC<Props> = ({ tickets }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({ 
    tecnico: '', 
    diagnostico: '', 
    resultado: '', 
    telefono: '', 
    emailCliente: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleAction = async (tipo: 'whatsapp' | 'email') => {
    // Verificación de seguridad
    if (!ticket) return alert("Selecciona un ticket primero");
    setLoading(true);

    try {
      const doc = generarHojaServicioPDF(ticket, formData);
      
      if (tipo === 'whatsapp') {
        const msg = `*Reporte Técnico ${ticket.id}*\nTécnico: ${formData.tecnico}\nDiagnóstico: ${formData.diagnostico}\nResultado: ${formData.resultado}`;
        // Limpiamos el número para asegurar formato internacional
        const cleanPhone = formData.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Servicio_${ticket.id}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        
        // El mailto funciona mejor con un delay mínimo
        setTimeout(() => {
          window.location.href = `mailto:${formData.emailCliente}?subject=Reporte Técnico ${ticket.id}&body=Adjunto reporte de servicio.`;
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Generación de Reportes</h2>
      
      <select 
        onChange={(e) => setTicket(tickets.find(t => t.id === e.target.value) || null)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      >
        <option value="">Seleccione una orden...</option>
        {tickets.filter(t => t.status !== 'abierto').map(t => (
          <option key={t.id} value={t.id}>{t.title} - {t.empresa}</option>
        ))}
      </select>

      {ticket && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input value={formData.tecnico} placeholder="Técnico" onChange={e => setFormData({...formData, tecnico: e.target.value})} style={{ padding: '10px' }} />
          <input value={formData.telefono} placeholder="WhatsApp" onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ padding: '10px' }} />
          <input value={formData.emailCliente} placeholder="Email" onChange={e => setFormData({...formData, emailCliente: e.target.value})} style={{ padding: '10px' }} />
          <textarea value={formData.diagnostico} placeholder="Diagnóstico" onChange={e => setFormData({...formData, diagnostico: e.target.value})} style={{ padding: '10px' }} />
          <input value={formData.resultado} placeholder="Resultado" onChange={e => setFormData({...formData, resultado: e.target.value})} style={{ padding: '10px' }} />

          <button disabled={loading} onClick={() => handleAction('whatsapp')} style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none' }}>
            {loading ? '...' : 'WhatsApp'}
          </button>
          <button disabled={loading} onClick={() => handleAction('email')} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
            {loading ? '...' : 'Descargar y Email'}
          </button>
        </div>
      )}
    </div>
  );
};