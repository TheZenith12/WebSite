import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, MapPin } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

function Header({ totalResorts = 0 }) {
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const countVisitor = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/visit`);
        setTotalVisitors(res.data.total);
      } catch (err) {
        console.error(err);
      }
    };

    countVisitor();
  }, []);

  return (
    <header className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-2xl sticky top-0 z-50 w-full">
      <div className="w-full px-6 py-5 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AmraltinGazar</h1>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full">
              <Users className="w-5 h-5" />
              <div>
                <div className="font-bold text-lg">
                  {totalVisitors.toLocaleString()}
                </div>
                <div className="text-xs opacity-90">Нийт зочид</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full">
              <MapPin className="w-5 h-5" />
              <div>
                <div className="font-bold text-lg">{totalResorts}</div>
                <div className="text-xs opacity-90">Амралтын газар</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;