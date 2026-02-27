import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ImageMetadata } from '../types';

interface MapDisplayProps {
  images: ImageMetadata[];
}

// Component to dynamically adjust map bounds to fit all markers
const MapBoundsFitter: React.FC<{ images: ImageMetadata[] }> = ({ images }) => {
  const map = useMap();

  useEffect(() => {
    const validImages = images.filter(img => img.status === 'success' && img.latitude !== undefined && img.longitude !== undefined);
    
    if (validImages.length > 0) {
      const bounds = L.latLngBounds(validImages.map(img => [img.latitude!, img.longitude!]));
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 1.5 });
    }
  }, [images, map]);

  return null;
};

export const MapDisplay: React.FC<MapDisplayProps> = ({ images }) => {
  const defaultCenter: [number, number] = [13.7563, 100.5018]; // Default to Bangkok

  // Helper to create custom HTML markers for each image
  const createCustomIcon = (imageUrl: string) => {
    return L.divIcon({
      className: 'custom-marker-wrapper',
      html: `
        <div class="custom-marker animate-fade-in animate-pulse-accent">
          <img src="${imageUrl}" alt="location pin" />
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 50],
    });
  };

  const markers = useMemo(() => {
    return images
      .filter(img => img.status === 'success' && img.latitude !== undefined && img.longitude !== undefined)
      .map(img => (
        <Marker 
          key={img.id} 
          position={[img.latitude!, img.longitude!]} 
          icon={createCustomIcon(img.objectUrl)}
        >
        </Marker>
      ));
  }, [images]);

  return (
    <div className="map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We can enable it via styling or use default, let's keep it clean
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {markers}
        <MapBoundsFitter images={images} />
      </MapContainer>
    </div>
  );
};
