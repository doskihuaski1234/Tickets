// src/services/geocoding.ts
import { MAPBOX_TOKEN } from './mapboxConfig'; // Ruta relativa correcta

export const getCoordinates = async (query: string): Promise<[number, number] | null> => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=gt`;
    const response = await fetch(url);
    
    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].center as [number, number];
    }
    
    return null;
  } catch (err) {
    console.error('Error al geocodificar: - geocoding.ts:19', err);
    return null;
  }
};