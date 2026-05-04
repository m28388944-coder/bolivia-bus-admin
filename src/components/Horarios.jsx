import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Bus, MapPin, RefreshCw, Users } from "lucide-react";
import api from "../api/client";

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [fecha, setFecha]       = useState(new Date().toISOString().split("T")[0]);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get("/schedules/?fecha=" + fecha);
      setHorarios(res.data);
    } catch {
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [fecha]);

  const fmt = (dt) => new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });

  const estadoColor = {
    programado: "bg-blue-100 text-blue-700",
    en_ruta:    "bg-green-100 text-green-700",
    completado: "bg-gray-100 text-gray-600",
    cancelado:  "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#1B2A6B]">Horarios</h2>
        <div className="flex items-center gap-3">
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1B2A6B]"/>
          <button onClick={cargar}
            className="flex items-center gap-1.5 bg-[#1B2A6B] text-white px-4 py-2 rounded-xl text-sm font-semibold">
            <RefreshCw size={14}/> Actualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B2A6B] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Salida</span>
            <span>Llegada</span>
            <span className="col-span-2">Ruta</span>
            <span>Empresa</span>
            <span>Bus</span>
            <span>Asientos</span>
          </div>
          {horarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No hay horarios para esta fecha</div>
          ) : (
            horarios.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#1B2A6B]"/>
                  <span className="font-bold text-gray-800">{fmt(h.hora_salida)}</span>
                </div>
                <div className="text-gray-600 text-sm">{fmt(h.hora_llegada_est)}</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <MapPin size={12} className="text-[#1B2A6B]"/>
                    {h.ruta.origen} → {h.ruta.destino}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{h.ruta.distancia_km} km · {h.ruta.duracion_min} min</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">{h.empresa.nombre}</div>
                  <div className="w-3 h-1 rounded-full mt-1" style={{ background: h.empresa.color }}/>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bus size={14} className="text-gray-400"/>
                  <div>
                    <div className="text-xs font-semibold text-gray-700">{h.bus.placa}</div>
                    <div className="text-xs text-gray-400 capitalize">{h.bus.tipo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-gray-400"/>
                  <span className="text-sm font-semibold text-gray-700">{h.asientos_disponibles}</span>
                  <span className="text-xs text-gray-400">/ {h.bus.total_asientos}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 text-right">
        {horarios.length} horarios encontrados
      </div>
    </div>
  );
}