import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Ticket, Bus, Users, RefreshCw, DollarSign, Clock, MapPin, CheckCircle } from "lucide-react";
import api from "../api/client";

export default function Reportes() {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading]   = useState(true);

  const hoy = new Date().toISOString().split("T")[0];

  const cargar = async () => {
    setLoading(true);
    try {
      const [bRes, hRes, eRes] = await Promise.all([
        api.get("/bookings/all"),
        api.get("/schedules/?fecha=" + hoy),
        api.get("/companies/"),
      ]);

      const bs = bRes.data;
      const hs = hRes.data;
      const es = eRes.data;

      setBookings(bs);
      setHorarios(hs);
      setEmpresas(es);

      const totalIngresos   = bs.reduce((s, b) => s + b.precio_total, 0);
      const pagadas         = bs.filter(b => b.estado === "pagada").length;
      const pendientes      = bs.filter(b => b.estado !== "pagada").length;
      const horariosHoy     = hs.length;
      const asientosDisp    = hs.reduce((s, h) => s + h.asientos_disponibles, 0);
      const asientosTotales = hs.reduce((s, h) => s + h.bus.total_asientos, 0);
      const ocupacion       = asientosTotales > 0
        ? Math.round(((asientosTotales - asientosDisp) / asientosTotales) * 100)
        : 0;

      setStats({
        total_reservas: bs.length,
        reservas_pagadas: pagadas,
        reservas_pendientes: pendientes,
        ingresos_total: totalIngresos.toFixed(2),
        horarios_hoy: horariosHoy,
        asientos_disponibles: asientosDisp,
        asientos_totales: asientosTotales,
        ocupacion,
        total_empresas: es.length,
        empresas_activas: es.filter(e => e.activa).length,
      });
    } catch (e) {
      console.error(e);
      setStats({ total_reservas:0, reservas_pagadas:0, reservas_pendientes:0,
        ingresos_total:"0.00", horarios_hoy:0, asientos_disponibles:0,
        asientos_totales:0, ocupacion:0, total_empresas:0, empresas_activas:0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const fmt = (dt) => new Date(dt).toLocaleString("es-BO", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });
  const fmtHora = (dt) => new Date(dt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });

  const CARDS = stats ? [
    { label: "Total Reservas",      value: stats.total_reservas,      icon: Ticket,      color: "bg-blue-50 border-blue-100",   text: "text-blue-700",   sub: stats.reservas_pagadas + " pagadas" },
    { label: "Ingresos Totales",    value: "Bs. " + stats.ingresos_total, icon: DollarSign, color: "bg-green-50 border-green-100", text: "text-green-700", sub: stats.reservas_pendientes + " pendientes" },
    { label: "Horarios Hoy",        value: stats.horarios_hoy,        icon: Clock,       color: "bg-purple-50 border-purple-100", text: "text-purple-700", sub: "fecha de hoy" },
    { label: "Ocupacion",           value: stats.ocupacion + "%",     icon: Users,       color: "bg-amber-50 border-amber-100",  text: "text-amber-700",  sub: (stats.asientos_totales - stats.asientos_disponibles) + " / " + stats.asientos_totales + " asientos" },
    { label: "Empresas Activas",    value: stats.empresas_activas,    icon: Bus,         color: "bg-teal-50 border-teal-100",    text: "text-teal-700",   sub: "de " + stats.total_empresas + " registradas" },
    { label: "Asientos Disponibles",value: stats.asientos_disponibles,icon: CheckCircle, color: "bg-rose-50 border-rose-100",    text: "text-rose-700",   sub: "en horarios de hoy" },
  ] : [];

  // Rutas mas populares desde horarios de hoy
  const rutasMap = {};
  horarios.forEach(h => {
    const k = h.ruta.nombre;
    if (!rutasMap[k]) rutasMap[k] = { nombre: k, count: 0, asientos: 0 };
    rutasMap[k].count++;
    rutasMap[k].asientos += h.asientos_disponibles;
  });
  const rutasTop = Object.values(rutasMap).sort((a,b) => b.count - a.count).slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1B2A6B]">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">Resumen operacional — {new Date().toLocaleDateString("es-BO", { weekday:"long", day:"numeric", month:"long" })}</p>
        </div>
        <button onClick={cargar}
          className="flex items-center gap-1.5 bg-[#1B2A6B] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors">
          <RefreshCw size={14}/> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B2A6B] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {CARDS.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.08 }}
                className={"rounded-2xl p-5 border " + c.color}>
                <div className="flex items-start justify-between mb-3">
                  <c.icon size={20} className={c.text + " opacity-70"}/>
                  <span className={"text-xs font-medium px-2 py-0.5 rounded-full " + c.color + " " + c.text}>{c.sub}</span>
                </div>
                <div className={"text-3xl font-black mb-1 " + c.text}>{c.value}</div>
                <div className="text-sm font-medium text-gray-500">{c.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Ultimas reservas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Ultimas Reservas</h3>
                <span className="text-xs text-gray-400">{bookings.length} total</span>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">Sin reservas aun</div>
              ) : (
                bookings.slice(0, 8).map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.03 }}
                    className="flex items-center justify-between px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#1B2A6B]">{b.codigo_reserva}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={10}/> {b.ruta}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">Bs. {b.precio_total}</div>
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " +
                        (b.estado === "pagada" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                        {b.estado}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Rutas top hoy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Rutas Activas Hoy</h3>
                <span className="text-xs text-gray-400">{horarios.length} horarios</span>
              </div>
              {rutasTop.map((r, i) => (
                <motion.div key={r.nombre} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.05 }}
                  className="flex items-center justify-between px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#1B2A6B]/10 flex items-center justify-center text-xs font-black text-[#1B2A6B]">
                      {i+1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{r.nombre}</div>
                      <div className="text-xs text-gray-400">{r.asientos} asientos disponibles</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#1B2A6B]">{r.count}</div>
                    <div className="text-xs text-gray-400">horarios</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Proximos horarios */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Proximos Horarios de Hoy</h3>
            </div>
            <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Salida</span><span>Llegada</span><span className="col-span-2">Ruta</span><span>Empresa</span><span>Asientos</span>
            </div>
            {horarios.slice(0, 8).map((h, i) => (
              <motion.div key={h.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.02 }}
                className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center text-sm">
                <span className="font-bold text-[#1B2A6B]">{fmtHora(h.hora_salida)}</span>
                <span className="text-gray-500">{fmtHora(h.hora_llegada_est)}</span>
                <span className="col-span-2 font-medium text-gray-700">{h.ruta.origen} → {h.ruta.destino}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: h.empresa.color }}/>
                  <span className="text-gray-600 text-xs">{h.empresa.nombre}</span>
                </div>
                <span className="font-semibold text-gray-800">{h.asientos_disponibles} <span className="text-gray-400 font-normal">/ {h.bus.total_asientos}</span></span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
