import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TrackingMap from "./components/TrackingMap";
import Empresas from "./components/Empresas";
import Manifiesto from "./components/Manifiesto";
import Reportes from "./components/Reportes";
import Horarios from "./components/Horarios";
import Login from "./components/Login";

export default function App() {
  const [page, setPage]   = useState("reportes");
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("bb_token");
    const savedUser  = localStorage.getItem("bb_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    localStorage.setItem("bb_token", userToken);
    localStorage.setItem("bb_user", JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    setUser(null);
    setToken(null);
  };

  if (!user) return <Login onLogin={handleLogin}/>;

  const PAGES = {
    mapa:       <TrackingMap/>,
    empresas:   <Empresas/>,
    horarios:   <Horarios/>,
    manifiesto: <Manifiesto/>,
    reportes:   <Reportes/>,
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar active={page} onNav={setPage}/>
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            Bienvenido, <span className="font-semibold text-[#1B2A6B]">{user.nombre || user.email}</span>
          </div>
          <button onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium">
            Cerrar sesión
          </button>
        </div>
        {PAGES[page]}
      </main>
    </div>
  );
}

