import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WS_URL, getLatestLocations } from '../api';

const BUS_STYLES = {
  'B-1234': { bg: '#E63946', label: 'B-1234', company: 'Flota Bolivar' },
  'B-5678': { bg: '#1D3557', label: 'B-5678', company: 'Trans Copacabana' },
  'B-7890': { bg: '#6A0572', label: 'B-7890', company: 'Bolivia Bus Express' },
  'B-9012': { bg: '#2A9D8F', label: 'B-9012', company: 'Flota Cosmos' },
  'B-2468': { bg: '#E63946', label: 'B-2468', company: 'Flota Bolivar' },
  'B-3456': { bg: '#E9C46A', label: 'B-3456', company: 'Concordia' },
  'B-1357': { bg: '#1D3557', label: 'B-1357', company: 'Trans Copacabana' },
};

function createBusIcon(bus, isMoving) {
  const s = BUS_STYLES[bus.bus_id] || { bg: '#1B2A6B', label: bus.bus_id };
  const pulse = isMoving ? `
    <circle cx="24" cy="24" r="22" fill="none" stroke="${s.bg}" stroke-width="2" opacity="0.5">
      <animate attributeName="r" from="22" to="36" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
    ${pulse}
    <rect x="4" y="4" width="40" height="40" rx="10" fill="${s.bg}"/>
    <text x="24" y="22" text-anchor="middle" font-size="8" font-weight="bold" font-family="Arial" fill="white">🚌</text>
    <text x="24" y="34" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="white">${bus.bus_id}</text>
    <polygon points="16,44 32,44 24,54" fill="${s.bg}"/>
  </svg>`;
  return L.divIcon({ html: svg, iconSize: [48, 56], iconAnchor: [24, 54], className: '' });
}

export default function TrackingMap() {
  const [buses, setBuses]       = useState({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    getLatestLocations().then(r => {
      const map = {};
      (r.data.buses || []).forEach(b => { map[b.bus_id] = b; });
      setBuses(map);
    }).catch(() => {});

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen    = () => setConnected(true);
      ws.onclose   = () => setConnected(false);
      ws.onerror   = () => setConnected(false);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'location_update') {
            setBuses(prev => ({ ...prev, [data.bus_id]: data }));
          }
        } catch {}
      };
    } catch {}

    return () => { try { wsRef.current?.close(); } catch {} };
  }, []);

  const busList = Object.values(buses);
  const center  = busList.length > 0 ? [busList[0].latitude, busList[0].longitude] : [-16.9, -67.5];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1B2A6B]">Rastreo de Flotas en Tiempo Real</h2>
        <div className="flex items-center gap-3">
          <span className={"flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full " +
            (connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            <span className={"w-2 h-2 rounded-full " + (connected ? "bg-green-500 animate-pulse" : "bg-red-500")}/>
            {connected ? "EN VIVO" : "Desconectado"}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {busList.length} buses activos
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {busList.map(b => {
          const s = BUS_STYLES[b.bus_id] || { bg: '#1B2A6B', company: 'Bolivia Bus' };
          return (
            <div key={b.bus_id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg }}
                className="flex items-center justify-center text-white font-bold text-xs">
                🚌
              </div>
              <div>
                <p className="font-bold text-[#1B2A6B] text-xs">{b.bus_id}</p>
                <p className="text-gray-400 text-xs">{s.company} · {b.speed_kmh} km/h</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700 ml-1">
                {b.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        {Object.entries(BUS_STYLES).slice(0,4).map(([plate, s]) => (
          <div key={plate} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: s.bg }}/>
            {plate}
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse inline-block"/>
          Pulso = en movimiento
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ minHeight: 500 }}>
        <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%', minHeight: 500 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {busList.map(b => (
            <Marker key={b.bus_id} position={[b.latitude, b.longitude]} icon={createBusIcon(b, b.speed_kmh > 0)}>
              <Popup>
                <div style={{ minWidth: 180, fontFamily: 'Arial' }}>
                  <div style={{ background: BUS_STYLES[b.bus_id]?.bg || '#1B2A6B', color: 'white', padding: '8px 12px', borderRadius: '8px 8px 0 0' }}>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{b.bus_id}</p>
                    <p style={{ fontSize: 11, margin: '2px 0 0', opacity: 0.8 }}>{BUS_STYLES[b.bus_id]?.company}</p>
                  </div>
                  <div style={{ padding: '8px 12px' }}>
                    <p style={{ margin: '2px 0', fontSize: 12 }}>🚀 {b.speed_kmh} km/h</p>
                    <p style={{ margin: '2px 0', fontSize: 12 }}>📍 {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}</p>
                    <p style={{ margin: '2px 0', fontSize: 11, color: '#888' }}>{new Date(b.timestamp).toLocaleTimeString('es-BO')}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}