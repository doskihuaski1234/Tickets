import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Ticket } from '../types/tickets';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TicketMapProps {
  tickets: Ticket[];
}

// Leer el token desde las variables de entorno
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN;

export const TicketMap: React.FC<TicketMapProps> = ({ tickets }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-90.3801, 14.0431],
      zoom: 12,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Eliminar marcadores anteriores
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Agregar nuevos marcadores
    tickets.forEach((ticket) => {
      if (ticket.lat && ticket.lng) {
        const marker = new mapboxgl.Marker({
          color: '#3b82f6',
        })
          .setLngLat([ticket.lng, ticket.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${ticket.title}</strong>`
            )
          )
          .addTo(map.current!);

        markers.current.push(marker);
      }
    });
  }, [tickets]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[580px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl"
    />
  );
};