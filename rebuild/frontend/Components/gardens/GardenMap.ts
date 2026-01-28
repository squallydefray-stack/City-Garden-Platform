import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function GardenMap({ gardens, center = [40.7128, -74.006], zoom = 11 }) {
  const validGardens = gardens.filter(g => g.latitude && g.longitude);
  
  const mapCenter = validGardens.length > 0 
    ? [validGardens[0].latitude, validGardens[0].longitude]
    : center;

  return (
    <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validGardens.map((garden) => (
          <Marker 
            key={garden.id} 
            position={[garden.latitude, garden.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-slate-800 mb-1">{garden.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{garden.address}</p>
                <Link 
                  to={createPageUrl(`GardenProfile?id=${garden.id}`)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View Garden →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}