import { Bus, LayoutDashboard, Map, Users, BarChart3, Calendar } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'mapa', label: 'Mapa en Vivo', icon: Map },
  { id: 'empresas', label: 'Empresas', icon: Bus },
  { id: 'horarios', label: 'Horarios', icon: Calendar },
  { id: 'manifiesto', label: 'Manifiesto', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
];

export default function Navbar({ active, onNav }) {
  return (
    <div className="bg-[#1B2A6B] text-white h-screen w-64 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <Bus size={32} className="text-[#D4AF37]"/>
          <div>
            <p className="font-bold text-lg">Bolivia Bus</p>
            <p className="text-xs text-blue-300">Panel Administrativo</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all text-left " +
              (active === item.id ? 'bg-white text-[#1B2A6B] font-semibold' : 'text-blue-200 hover:bg-blue-800')}>
            <item.icon size={18}/>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-800 text-xs text-blue-400">
        <p>Terminal de Bolivia</p>
        <p className="text-[#D4AF37]">Sistema v1.0.0</p>
      </div>
    </div>
  );
}
