import { useState } from "react";
import { motion } from "framer-motion";
import { Bus, Lock, Mail } from "lucide-react";
import api from "../api/client";

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState("admin@boliviabus.bo");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      onLogin(res.data.user, res.data.access_token);
    } catch (e) {
      setError(e.response?.data?.detail || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2A6B] to-[#2d45a8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1B2A6B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus size={32} className="text-[#1B2A6B]"/>
          </div>
          <h1 className="text-2xl font-black text-[#1B2A6B]">Bolivia Bus</h1>
          <p className="text-gray-500 text-sm mt-1">Panel Administrativo</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]"/>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button onClick={handleLogin} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#1B2A6B] to-[#2d45a8] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              : "Ingresar al Panel"}
          </motion.button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          admin@boliviabus.bo / admin1234
        </p>
      </motion.div>
    </div>
  );
}