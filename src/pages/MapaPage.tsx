import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../services/mapboxConfig';
import type { Ticket } from '../types/tickets';

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface MapaPageProps {
  tickets: Ticket[];
}

export const MapaPage: React.FC<MapaPageProps> = ({ tickets }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState<MapboxFeature[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-90.3833, 14.0833],
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );

    map.current.on('load', () => {
      map.current?.resize();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Efecto para actualizar marcadores SINCRONIZADO
  useEffect(() => {
    if (!map.current) return;

    // 1. Limpiar marcadores antiguos
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // 2. Dibujar nuevos marcadores con la información real de la empresa
    tickets.forEach((t) => {
      if (typeof t.lat === 'number' && typeof t.lng === 'number' && map.current) {
        const popupContent = `
          <div style="color: black; padding: 5px;">
            <strong style="display:block; margin-bottom:4px; font-size: 14px;">${t.empresa}</strong>
            <span style="font-size: 12px; display:block;">Sucursal: ${t.sucursal}</span>
            <span style="font-size: 11px; color: #666;">Dirección: ${t.direccion || 'N/A'}</span>
          </div>
        `;

        const m = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([t.lng, t.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current);
          
        markers.current.push(m);
      }
    });
  }, [tickets]);

  const handleBusqueda = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBusqueda(val);
    if (val.length < 3) { setSugerencias([]); return; }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${MAPBOX_TOKEN}&country=gt&limit=5`
      );
      const data = await res.json();
      setSugerencias(data.features as MapboxFeature[]);
    } catch (err) { console.error('Error al buscar:', err); }
  };

  const irALugar = (feature: MapboxFeature) => {
    const [lng, lat] = feature.center;
    map.current?.flyTo({ center: [lng, lat], zoom: 16, essential: true });
    setSugerencias([]);
    setBusqueda(feature.place_name);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '580px' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, width: '320px' }}>
        <input
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          placeholder="Buscar ubicación en Guatemala..."
          value={busqueda}
          onChange={handleBusqueda}
        />
        {sugerencias.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto' }}>
            {sugerencias.map((s) => (
              <li key={s.id} onClick={() => irALugar(s)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333' }}>
                {s.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapaPage;