import React, { useEffect, useState } from "react";

const CATEGORIES = [
  {
    key: "suvilal",
    label: "Амралтын газар",
    icon: "🏥",
    bg: "bg-gradient-to-br from-teal-500 to-emerald-600",
  },
  {
    key: "juulchnii_baaz",
    label: "Жуулчны бааз",
    icon: "⛺",
    bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    key: "uzseglent_gazar",
    label: "Байгалийн үзэсгэлэнт",
    icon: "🏔️",
    bg: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
];

function Hero({
  searchTerm,
  setSearchTerm,
  list = [],
  activeCategory,
  setActiveCategory,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const heroImage = "13.png";

  const counts = {
    suvilal: list.filter((r) => r.category === "suvilal" || !r.category).length,
    juulchnii_baaz: list.filter((r) => r.category === "juulchnii_baaz").length,
    uzseglent_gazar: list.filter((r) => r.category === "uzseglent_gazar")
      .length,
  };

  function scrollToResorts() {
    setTimeout(() => {
      const el = document.getElementById("resorts-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleCategoryClick(key) {
    setActiveCategory(key);
    scrollToResorts();
  }

  function handleAllClick() {
    setActiveCategory(null);
    scrollToResorts();
  }

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 md:bg-black/40"></div>

      {/* Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative w-full px-4 md:px-6 pt-12 pb-36 md:pb-24 max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-bold mb-3 md:mb-6 leading-tight animate-float text-white drop-shadow-lg">
            Тавтай морилно уу!
          </h2>
          <p className="text-base md:text-2xl text-teal-100 mb-8 md:mb-12 drop-shadow">
            Байгаль, тайван амралт, тохилог байр таныг хүлээж байна
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10 md:mb-14">
            <div className="relative group">
              <div
                className={`absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl md:rounded-3xl blur-xl transition-all duration-500 ${isFocused ? "opacity-60" : "opacity-25 group-hover:opacity-45"}`}
              ></div>
              <div
                className={`relative bg-white rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-300 ${isFocused ? "ring-2 ring-teal-300" : ""}`}
              >
                <div className="flex items-center gap-2 p-1.5 md:p-2">
                  <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl md:rounded-2xl ml-1 shadow-lg flex-shrink-0">
                    <svg
                      className={`w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-500 ${isFocused ? "scale-110" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Хаана амрах вэ?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 px-2 md:px-4 py-3 md:py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm md:text-lg font-medium min-w-0"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-3 md:px-8 py-3 md:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl md:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:scale-105 mr-0.5 flex-shrink-0">
                    <span className="hidden md:inline text-sm">Хайх</span>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
                {isFocused && !searchTerm && (
                  <div className="px-4 md:px-6 pb-3 md:pb-4 flex flex-wrap gap-2 animate-fadeIn">
                    {["Төв аймаг", "Архангай", "Өвөрхангай", "Хэнтий"].map(
                      (s, i) => (
                        <button
                          key={i}
                          onMouseDown={() => setSearchTerm(s)}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 shadow-sm"
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-teal-200 text-xs md:text-sm">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Байршил, нэр, эсвэл үнээр хайж болно</span>
              </div>
            </div>
          </div>

          {/* ===== Category Cards ===== */}
          <p className="text-teal-200 text-xs md:text-sm font-medium tracking-widest uppercase mb-4">
            Төрлөөр үзэх
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`
                    relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-7
                    flex flex-col items-center justify-center gap-1.5 md:gap-3
                    transition-all duration-300 cursor-pointer group
                    ${
                      isActive
                        ? `${cat.bg} scale-105 shadow-2xl ring-2 ring-white/50`
                        : "bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-[1.03] shadow-lg border border-white/10"
                    }
                  `}
                >
                  <span className="text-3xl md:text-5xl leading-none">
                    {cat.icon}
                  </span>
                  <span className="text-white font-bold text-xs md:text-base leading-tight text-center">
                    {cat.label}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all ${isActive ? "bg-white/25 text-white" : "bg-white/15 text-white/70 group-hover:bg-white/20"}`}
                  >
                    {counts[cat.key] || 0} газар
                  </span>

                  {/* Animated arrow when active */}
                  <div
                    className={`transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
                  >
                    <svg
                      className="w-4 h-4 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Active shimmer overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Бүгд */}
          <div className="mt-5">
            <button
              onClick={handleAllClick}
              className={`text-sm font-semibold transition-all duration-200 underline underline-offset-4 decoration-2
                ${activeCategory === null ? "text-white decoration-white" : "text-teal-300 decoration-teal-400 hover:text-white hover:decoration-white"}`}
            >
              ← Бүгдийг харах
            </button>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16 fill-white">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </section>
  );
}

export default Hero;
