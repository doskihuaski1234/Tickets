import React, { useState } from 'react';
import type { Ticket } from '../types/tickets';
import { GUATEMALA_DATA, EMPRESAS } from '../data/ubicaciones';
import { MAPBOX_TOKEN } from '../services/mapboxConfig';

interface NuevaOrdenProps {
  onAddTicket: (ticket: Ticket) => void;
}

export const NuevaOrden: React.FC<NuevaOrdenProps> = ({ onAddTicket }) => {
  const [loading, setLoading] = useState(false);
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  
  // Estado inicial unificado incluyendo calles y zonas
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    empresa: '', 
    sucursal: '', 
    calleAvenida: '', 
    zona: '' 
  });

  // Función de geocodificación interna robusta
  const getCoordinates = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=gt&limit=1`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
    } catch (err) {
      console.error("Error geocodificando:", err);
    }
    return { lat: 14.6349, lng: -90.5069 }; // Fallback central (Ciudad de Guatemala)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Query optimizado para alta precisión (incluye calle, zona, municipio, etc.)
    const query = `${formData.calleAvenida}, ${formData.zona}, ${municipio}, ${departamento}, Guatemala`;
    const { lat, lng } = await getCoordinates(query);

    const nuevoTicket: Ticket = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      status: 'abierto',
      createdAt: new Date().toISOString(),
      empresa: formData.empresa,
      sucursal: formData.sucursal,
      departamento,
      municipio,
      direccion: `${formData.calleAvenida}, ${formData.zona}, ${municipio}, ${departamento}`,
      lat,
      lng
    };

    onAddTicket(nuevoTicket);

    setLoading(false);
    // Limpieza de campos
    setFormData({ title: '', description: '', empresa: '', sucursal: '', calleAvenida: '', zona: '' });
    setDepartamento('');
    setMunicipio('');
  };

  return (
    <div className="orden-form">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Nueva Orden de Trabajo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input className="w-full p-3 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        </div>
        
        <div className="form-group">
          <label>Empresa</label>
          <select className="w-full p-3 border rounded-lg" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} required>
            <option value="">Seleccione...</option>
            {EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>Departamento</label>
            <select className="w-full p-3 border rounded-lg" value={departamento} onChange={(e) => { setDepartamento(e.target.value); setMunicipio(''); }} required>
              <option value="">Seleccione...</option>
              {Object.keys(GUATEMALA_DATA).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Municipio</label>
            <select className="w-full p-3 border rounded-lg" value={municipio} onChange={(e) => setMunicipio(e.target.value)} disabled={!departamento} required>
              <option value="">{departamento ? 'Seleccione...' : 'Elegir Depto primero'}</option>
              {departamento && GUATEMALA_DATA[departamento].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>Calle / Avenida</label>
            <input className="w-full p-3 border rounded-lg" value={formData.calleAvenida} onChange={e => setFormData({...formData, calleAvenida: e.target.value})} placeholder="Ej: 15 Calle" required />
          </div>
          <div className="form-group">
            <label>Zona</label>
            <input className="w-full p-3 border rounded-lg" value={formData.zona} onChange={e => setFormData({...formData, zona: e.target.value})} placeholder="Ej: Zona 1" required />
          </div>
        </div>

        <div className="form-group">
          <label>Sucursal</label>
          <input className="w-full p-3 border rounded-lg" value={formData.sucursal} onChange={e => setFormData({...formData, sucursal: e.target.value})} required />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Procesando ubicación...' : 'Registrar Orden'}
        </button>
      </form>
    </div>
  );
};