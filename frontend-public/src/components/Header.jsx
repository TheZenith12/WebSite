import React from "react";
import { Users, MapPin } from "lucide-react";

function Header({ totalVisitors = 0, totalResorts = 0 }) {
  return (
    <header className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl sticky top-0 z-40 w-full">
      <div className="w-full px-6 py-4 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌿</span>
            <h1 className="text-3xl font-bold tracking-tight">AmraltinGazar</h1>
          </div>
          
          
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-semibold">{totalVisitors.toLocaleString()}</div>
                <div className="text-xs opacity-90">Нийт зочид</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-semibold">{totalResorts}</div>
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