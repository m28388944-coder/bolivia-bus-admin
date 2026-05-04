import { useState, useEffect } from 'react';
import { Users, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../api';

export default function Manifiesto() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    API.get('/schedules/').then(r => {
      const list = r.data?.value || r.data || [];
      const filtered = list.filter(s => s.hora_salida?.startsWith(fecha));
      setSchedules(filtered);
    }).catch(() => {});
  }, [fecha]);

  useEffect(() => {
    API.get('/bookings/all').then(r => {
      const list = r.data?.value || r.data || [];
      setAllBookings(list);
    }).catch(() => {});
  }, []);

  const loadBookings = (scheduleId) => {
    setSelected(scheduleId);
    setLoading(true);
    const filtrados = allBookings.filter(b => b.schedule_id === scheduleId);
    setBookings(filtrados);
    setLoading(false);
  };

  const STATUS_ICON = {
    confirmed: <CheckCircle size={16} className="text-green-500" />,
    pending: <Clock size={16} className="text-amber-500" />,
    cancelled: <XCircle size={16} className="text-red-500" />,
    used: <CheckCircle size={16} className="text-blue-500" />,
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1B2A6B] mb-6">Manifiesto de Pasajeros</h2>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={e => { setFecha(e.target.value); setSelected(null); setBookings([]); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
        />
        <span className="text-xs text-gray-400">{schedules.length} horarios</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Search size={16} /> Horarios del dia
            </h3>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {schedules.length === 0 && (
                <p className="text-gray-400 text-sm">No hay horarios para esta fecha</p>
              )}
              {schedules.map(s => (
                <button
                  key={s.id}
                  onClick={() => loadBookings(s.id)}
                  className={"text-left p-3 rounded-lg border-2 transition-all text-sm " +
                    (selected === s.id ? 'border-[#1B2A6B] bg-[#f0f4ff]' : 'border-gray-200 hover:border-gray-300')}
                >
                  <p className="font-semibold text-[#1B2A6B]">
                    {s.ruta?.origen} - {s.ruta?.destino}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {s.empresa?.nombre} - {new Date(s.hora_salida).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/La_Paz' })}
                  </p>
                  <p className="text-xs text-gray-400">{s.asientos_disponibles} asientos libres - {s.bus?.placa}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Users size={16} /> Lista de Pasajeros
                {bookings.length > 0 && (
                  <span className="badge-active">({bookings.length})</span>
                )}
              </h3>
            </div>
            {!selected && <p className="text-gray-400 text-center py-8">Selecciona un horario para ver el manifiesto</p>}
            {loading && <p className="text-gray-400 text-center py-8">Cargando...</p>}
            {!loading && selected && bookings.length === 0 && (
              <p className="text-gray-400 text-center py-8">No hay pasajeros registrados en este horario</p>
            )}
            {bookings.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-3 py-2 text-left">Asiento</th>
                    <th className="px-3 py-2 text-left">Pasajero</th>
                    <th className="px-3 py-2 text-left">CI</th>
                    <th className="px-3 py-2 text-left">Total</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-[#1B2A6B]">{b.seat_number ?? b.asiento ?? '-'}</td>
                      <td className="px-3 py-2">{b.passenger_name ?? b.pasajero_nombre ?? '-'}</td>
                      <td className="px-3 py-2 text-gray-500">{b.passenger_ci ?? b.pasajero_ci ?? '-'}</td>
                      <td className="px-3 py-2 font-semibold">Bs. {b.total_price ?? b.precio_total ?? '-'}</td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1">
                          {STATUS_ICON[b.status ?? b.estado]} {b.status ?? b.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
