'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface TacticalMapProps {
  anomalies: any[];
  center?: [number, number];
  zoom?: number;
}

export default function TacticalMap({ anomalies, center = [120.9842, 14.5995], zoom = 2 }: TacticalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    
    // Simple update: Add markers for anomalies
    // In a real app, we'd manage layers and sources properly
    anomalies.forEach((anom) => {
      new maplibregl.Marker({ color: '#ff3d3d' })
        .setLngLat([anom.lng, anom.lat])
        .setPopup(new maplibregl.Popup().setHTML(`<b>${anom.callsign}</b><br/>${anom.reason}`))
        .addTo(map.current!);
    });
  }, [anomalies]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg border border-[#d4af37]/20" />;
}
