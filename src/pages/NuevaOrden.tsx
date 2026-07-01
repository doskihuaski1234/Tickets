import React, { useState } from 'react';
import type { Ticket } from '../types/tickets';
import { GUATEMALA_DATA, EMPRESAS } from '../data/ubicaciones';

interface NuevaOrdenProps {
  onAddTicket: (ticket: Ticket) => void;
}

export const NuevaOrden: React.FC<NuevaOrdenProps> = ({ onAddTicket }) => {
  const [loading, setLoading] = useState(false);
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    empresa: '',
    sucursal: '',
    calleAvenida: '',
    zona: ''
  });

  // 🌍 Geocoding directo (SIN importar MAPBOX_TOKEN)
  const getCoordinates = async (query: string) => {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${token}&limit=1`
      );

      const data = await res.json();

      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
    } catch (err) {
      console.error('Error geocoding:', err);
    }

    // fallback Guatemala centro
    return { lat: 14.6349, lng: -90.5069 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const query = `${formData.calleAvenida}, ${formData.zona}, ${municipio}, ${departamento}, Guatemala`;

    const { lat, lng } = await getCoordinates(query);

    const nuevo: Ticket = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      status: 'abierto',
      createdAt: new Date().toISOString(),

      empresa: formData.empresa,
      sucursal: formData.sucursal,
      departamento,
      municipio,
      direccion: query,

      lat,
      lng
    };

    onAddTicket(nuevo);

    setLoading(false);

    // reset form
    setFormData({
      title: '',
      description: '',
      empresa: '',
      sucursal: '',
      calleAvenida: '',
      zona: ''
    });

    setDepartamento('');
    setMunicipio('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Nueva Orden</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          className="w-full p-2 border rounded"
          placeholder="Título"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Descripción"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <select
          className="w-full p-2 border rounded"
          value={formData.empresa}
          onChange={e => setFormData({ ...formData, empresa: e.target.value })}
          required
        >
          <option value="">Empresa</option>
          {EMPRESAS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          value={departamento}
          onChange={e => {
            setDepartamento(e.target.value);
            setMunicipio('');
          }}
          required
        >
          <option value="">Departamento</option>
          {Object.keys(GUATEMALA_DATA).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          value={municipio}
          onChange={e => setMunicipio(e.target.value)}
          required
          disabled={!departamento}
        >
          <option value="">Municipio</option>
          {departamento &&
            GUATEMALA_DATA[departamento].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
        </select>

        <input
          className="w-full p-2 border rounded"
          placeholder="Calle / Avenida"
          value={formData.calleAvenida}
          onChange={e => setFormData({ ...formData, calleAvenida: e.target.value })}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Zona"
          value={formData.zona}
          onChange={e => setFormData({ ...formData, zona: e.target.value })}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Sucursal"
          value={formData.sucursal}
          onChange={e => setFormData({ ...formData, sucursal: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Procesando ubicación...' : 'Crear Ticket'}
        </button>

      </form>
    </div>
  );
};

export default NuevaOrden;