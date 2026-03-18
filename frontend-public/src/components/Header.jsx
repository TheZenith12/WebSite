import React from "react";
import { Link } from "react-router-dom";
import { Users, MapPin } from "lucide-react";

function Header({ stats }) {
  const { visitors = 0, count = 0 } = stats;

  return (
<header className="bg-gradient-to-r from-teal-600 via-blue-700 to-blue-500 text-white shadow-2xl sticky top-0 z-50 w-full">
      <div className="w-full px-6 py-3 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Амралтын газрууд</h1>
          </div>

          {/* Stats - Desktop */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <Users className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-bold text-lg">{totalVisitors.toLocaleString()}</div>
                <div className="text-xs opacity-90">Нийт зочид</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <MapPin className="w-5 h-5" />
              <div className="text-sm">
                  {totalResorts}
                <div className="text-xs opacity-90">Амралтын газар</div>
              </div>
            </div>
          </div>

          {/* Stats - Mobile */}
          <div className="flex md:hidden gap-3 text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
              <span className="font-bold">{totalResorts}</span> газар
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;