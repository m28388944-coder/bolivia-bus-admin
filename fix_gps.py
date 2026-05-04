# ── TrackingMap con SVG real del bus ────────────────────────────────────────
tracking = r"""import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WS_URL, getLatestLocations } from '../api';

const COMPANY_STYLES = {
  "Bolivia Bus Express": { bg: "#1B2A6B", accent: "#D4AF37", label: "BBE", shadow: "#D4AF37" },
  "Trans Copacabana":    { bg: "#C8102E", accent: "#FFFFFF", label: "TC",  shadow: "#C8102E" },
  "Flota Boliviana":     { bg: "#007A33", accent: "#F4D03F", label: "FB",  shadow: "#007A33" },
};

const TYPE_LABELS = { normal: "NORM", semicama: "SEMI", cama: "CAMA" };

function createBusIcon(bus) {
  const s = COMPANY_STYLES[bus.company] || { bg: "#555", accent: "#fff", label: "BUS", shadow: "#555" };
  const isMoving = bus.speed_kmh > 0;
  const typeLabel = TYPE_LABELS[bus.bus_type] || "BUS";

  // Pulso animado si esta en movimiento
  const pulse = isMoving ? `
    <circle cx="36" cy="36" r="34" fill="none" stroke="${s.bg}" stroke-width="3" opacity="0.5">
      <animate attributeName="r" from="34" to="52" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle>` : "";

  // SVG del bus real coloreado por flota
  const busSvg = `
    <g transform="translate(0, 4) scale(0.88)">
      <path fill="${s.bg}" d="M17.925 53.975L11.3 52.958s-1.063 0-1.063-1.25s-.062-3.562-.062-3.562s.683-9.48 2.625-10.625c1.625-.959 46.544-.704 53.136-.578a.98.98 0 0 1 .95.813c.237 1.335.68 4.097.726 6.327c.063 3.063-.125 8-.125 8l-4.764 1.795"/>
      <path fill="#3f3f3f" d="M13.133 38.083s-2.312 3.167-2.125 9.042c0 0 3.917 1.458 9.98-4.312l42.937 1.312s2.229-1.23 2.333-6.292c0 0-45.875-2.166-53.125.25"/>
      <circle cx="56.48" cy="53.292" r="3" fill="#d0cfce"/>
      <circle cx="23.98" cy="53.292" r="3" fill="#d0cfce"/>
      <path fill="#3f3f3f" d="M40.487 40.318h5.063v12.667h-5.063z"/>
      <path fill="${s.accent}" d="M11.16 50.656h2.577l1.073-2.312h-2.88c-.426 0-.77.399-.77.891z"/>
      <g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2">
        <path d="m17.925 52.975l-6.625-.017s-1.063 0-1.063-1.25s-.062-3.562-.062-3.562s.683-9.48 2.625-10.625c1.625-.959 46.544-.704 53.136-.578a.98.98 0 0 1 .95.813c.237 1.335.68 4.097.726 6.327c.063 3.063-.125 8-.125 8l-4.764.795m-12.382.183l-20.166-.054"/>
        <path d="m11.3 40.5l-4.563.313L5.3 44.125"/>
        <circle cx="56.48" cy="53.292" r="3"/>
        <circle cx="23.98" cy="53.292" r="3"/>
        <path d="m45.55 43.028l18.125.16l.04-.007M13.278 46.31s4.024-.949 7.71-3.498l19.5.172"/>
        <path d="M40.487 40.318h5.063v12.667h-5.063zM11.159 50.656h2.578l1.073-1.361"/>
      </g>
    </g>`;

  // Badge empresa + tipo arriba
  const badge = `
    <rect x="12" y="2" width="48" height="18" rx="9" fill="${s.bg}"/>
    <text x="36" y="14" text-anchor="middle" font-size="9" font-weight="bold" font-family="Arial" fill="${s.accent}">${s.label} · ${typeLabel}</text>`;

  // Flecha indicadora abajo
  const arrow = `<polygon points="28,68 44,68 36,78" fill="${s.bg}" opacity="0.9"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="80" viewBox="0 0 72 80">
    ${pulse}
    ${badge}
    ${busSvg}
    ${arrow}
  </svg>`;

  return L.divIcon({
    html: svg,
    iconSize: [72, 80],
    iconAnchor: [36, 78],
    className: "",
  });
}

function BusMarker({ bus }) {
  const icon = createBusIcon(bus);
  const s = COMPANY_STYLES[bus.company] || { bg: "#555", accent: "#fff" };
  return (
    <Marker position={[bus.latitude, bus.longitude]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 220, fontFamily: "Arial", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: s.bg, color: s.accent, padding: "10px 14px", marginBottom: 8 }}>
            <p style={{ fontWeight: "bold", fontSize: 15, margin: 0 }}>{bus.company}</p>
            <p style={{ fontSize: 11, margin: "2px 0 0", opacity: 0.8 }}>Placa: {bus.plate} · {bus.bus_type?.toUpperCase()}</p>
          </div>
          <div style={{ padding: "0 8px 8px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              <div style={{ background:"#f8faff", borderRadius:8, padding:"6px 8px" }}>
                <p style={{ fontSize:10, color:"#888", margin:0 }}>Velocidad</p>
                <p style={{ fontSize:14, fontWeight:"bold", color:s.bg, margin:0 }}>{bus.speed_kmh} km/h</p>
              </div>
              <div style={{ background:"#f8faff", borderRadius:8, padding:"6px 8px" }}>
                <p style={{ fontSize:10, color:"#888", margin:0 }}>Estado</p>
                <p style={{ fontSize:12, fontWeight:"bold", color: bus.status==="en_ruta"?"#16a34a":"#888", margin:0 }}>{bus.status}</p>
              </div>
            </div>
            <p style={{ fontSize:10, color:"#aaa", marginTop:8, textAlign:"right" }}>
              {new Date(bus.timestamp).toLocaleTimeString("es-BO")}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function TrackingMap() {
  const [buses, setBuses] = useState({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    getLatestLocations().then(r => {
      const map = {};
      r.data.buses.forEach(b => { map[b.bus_id] = b; });
      setBuses(map);
    }).catch(() => {});
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "location_update") {
        setBuses(prev => ({ ...prev, [data.bus_id]: data }));
      }
    };
    return () => ws.close();
  }, []);

  const busList = Object.values(buses);
  const center  = busList.length > 0 ? [busList[0].latitude, busList[0].longitude] : [-16.5, -68.15];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1B2A6B]">Rastreo de Flotas en Tiempo Real</h2>
        <div className="flex items-center gap-3">
          <span className={"flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full " +
            (connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            <span className={"w-2 h-2 rounded-full " + (connected ? "bg-green-500 animate-pulse" : "bg-red-500")}/>
            {connected ? "EN VIVO" : "Desconectado"}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{busList.length} buses activos</span>
        </div>
      </div>

      {/* Tarjetas buses */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {busList.map(b => {
          const s = COMPANY_STYLES[b.company] || { bg:"#555", accent:"#fff", label:"BUS" };
          return (
            <div key={b.bus_id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
              <div style={{ width:36, height:36, borderRadius:8, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.accent, fontWeight:"bold", fontSize:10 }}>
                {s.label}
              </div>
              <div>
                <p className="font-bold text-[#1B2A6B] text-xs">{b.company}</p>
                <p className="text-gray-400 text-xs">{b.plate} · {b.speed_kmh} km/h</p>
              </div>
              <span className={"text-xs px-2 py-0.5 rounded-full font-semibold ml-1 " +
                (b.status === "en_ruta" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                {b.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {Object.entries(COMPANY_STYLES).map(([name, s]) => (
          <div key={name} className="flex items-center gap-2 text-xs text-gray-500">
            <div style={{ width:14, height:14, borderRadius:3, background:s.bg, border:"2px solid "+s.accent }}/>
            {name}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-gray-400 ml-auto">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse inline-block"/>
          Pulso = bus en movimiento
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ minHeight: 500 }}>
        <MapContainer center={center} zoom={7} style={{ height:"100%", width:"100%", minHeight:500 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {busList.map(b => <BusMarker key={b.bus_id} bus={b}/>)}
        </MapContainer>
      </div>
    </div>
  );
}
"""

open(r"src\components\TrackingMap.jsx", "w", encoding="utf-8").write(tracking)
print("OK: TrackingMap con SVG real")