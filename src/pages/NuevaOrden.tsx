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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    empresa: '',
    sucursal: '',
    calleAvenida: '',
    zona: ''
  });

  const getCoordinates = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );

      const data = await res.json();

      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
    } catch (err) {
      console.error(err);
    }

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
    setFormData({
      title: '',
      description: '',
      empresa: '',
      sucursal: '',
      calleAvenida: '',
      zona: ''
    });
  };

  return (
    <div>
      <h2>Nueva Orden</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Título"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};

export default NuevaOrden;