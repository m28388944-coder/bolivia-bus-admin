import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bus, MapPin, RefreshCw, Building2 } from "lucide-react";
import api from "../api/client";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading]   = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get("/companies/");
      setEmpresas(res.data);
    } catch {
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#1B2A6B]">Empresas</h2>
        <button onClick={cargar}
          className="flex items-center gap-1.5 bg-[#1B2A6B] text-white px-4 py-2 rounded-xl text-sm font-semibold">
          <RefreshCw size={14}/> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B2A6B] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-2" style={{ background: e.color_flota }}/>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: e.color_flota + "20" }}>
                    <Building2 size={20} style={{ color: e.color_flota }}/>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{e.nombre}</h3>
                    {e.email && <p className="text-xs text-gray-500 mt-0.5">{e.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Bus size={14}/>
                    <span>{e.total_buses || 0} buses</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin size={14}/>
                    <span>{e.total_rutas || 0} rutas</span>
                  </div>
                </div>
                {e.telefono && (
                  <p className="text-xs text-gray-400 mt-3">{e.telefono}</p>
                )}
                <div className={"inline-flex items-center gap-1 mt-3 text-xs px-2 py-1 rounded-full font-medium " +
                  (e.activa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  <div className={"w-1.5 h-1.5 rounded-full " + (e.activa ? "bg-green-500" : "bg-red-500")}/>
                  {e.activa ? "Activa" : "Inactiva"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}