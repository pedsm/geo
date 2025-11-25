"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Custom icons for markers
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const blueIcon = createIcon("blue");
const redIcon = createIcon("red");

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  actualLocation?: { lat: number; lng: number } | null;
}

function MapEvents({ onLocationSelect, disabled }: { onLocationSelect: (lat: number, lng: number) => void; disabled: boolean }) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function GameMap({ onLocationSelect, selectedLocation, actualLocation }: MapProps) {
  // Calculate bounds if we have both points
  const bounds =
    selectedLocation && actualLocation
      ? L.latLngBounds(
          [selectedLocation.lat, selectedLocation.lng],
          [actualLocation.lat, actualLocation.lng]
        ).pad(0.1)
      : undefined;

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg"
      style={{ height: "100%", width: "100%" }}
      bounds={bounds}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapEvents onLocationSelect={onLocationSelect} disabled={!!actualLocation} />
      
      {selectedLocation && (
        <Marker 
          position={[selectedLocation.lat, selectedLocation.lng]} 
          icon={blueIcon}
        />
      )}
      
      {actualLocation && (
        <Marker 
          position={[actualLocation.lat, actualLocation.lng]} 
          icon={redIcon}
        />
      )}

      {selectedLocation && actualLocation && (
        <Polyline
          positions={[
            [selectedLocation.lat, selectedLocation.lng],
            [actualLocation.lat, actualLocation.lng],
          ]}
          color="red"
          dashArray="10, 10"
        />
      )}
    </MapContainer>
  );
}
