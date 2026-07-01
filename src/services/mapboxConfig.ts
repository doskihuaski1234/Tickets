import mapboxgl from 'mapbox-gl';

// Leer el token desde las variables de entorno
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const initMap = (
  container: HTMLElement,
  style: string,
  center: [number, number],
  zoom: number
) => {
  return new mapboxgl.Map({
    accessToken: MAPBOX_TOKEN,
    container,
    style,
    center,
    zoom,
  });
};