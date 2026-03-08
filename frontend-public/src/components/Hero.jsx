import React, { useEffect, useState } from 'react';

function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    function animate(time) {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

function Hero({ searchTerm, setSearchTerm, list = [], totalVisitors = 0 }) {
  const [isFocused, setIsFocused] = useState(false);
  const heroImage =
    list && list.length > 0
      ? list[0].images?.[0] || list[0].image
      : "13.png";

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay — утсанд илүү харанхуй */}
      <div className="absolute inset-0 bg-black/55 md:bg-black/40"></div>

      {/* Subtle glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative w-full px-4 md:px-6 pt-12 pb-28 md:py-20 max-w-[1400px] mx-auto">
        <div className="text-center max-w-4xl mx-auto">

          <h2 className="text-4xl md:text-6xl font-bold mb-3 md:mb-6 leading-tight animate-float text-white drop-shadow-lg">
            Тавтай морилно уу!
          </h2>
          <p className="text-base md:text-2xl text-teal-100 mb-8 md:mb-12 drop-shadow">
            Байгаль, тайван амралт, тохилог байр танай хүлээж байна
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8 md:mb-0">
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl md:rounded-3xl blur-xl transition-all duration-500 ${isFocused ? 'opacity-60' : 'opacity-25 group-hover:opacity-45'}`}></div>

              <div className={`relative bg-white rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-teal-300' : ''}`}>
                <div className="flex items-center gap-2 p-1.5 md:p-2">

                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl md:rounded-2xl ml-1 shadow-lg flex-shrink-0">
                    <svg
                      className={`w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-500 ${isFocused ? 'scale-110' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Хаана амрах вэ?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 px-2 md:px-4 py-3 md:py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm md:text-lg font-medium min-w-0"
                  />

                  {/* Clear */}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {/* Button: компьютерт текст+icon, утсанд icon л */}
                  <button className="flex items-center gap-2 px-3 md:px-8 py-3 md:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl md:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:scale-105 mr-0.5 flex-shrink-0">
                    <span className="hidden md:inline text-sm">Хайх</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>

                {/* Suggestion Pills */}
                {isFocused && !searchTerm && (
                  <div className="px-4 md:px-6 pb-3 md:pb-4 flex flex-wrap gap-2 animate-fadeIn">
                    {['Төв аймаг', 'Архангай', 'Өвөрхангай', 'Хэнтий'].map((s, i) => (
                      <button
                        key={i}
                        onMouseDown={() => setSearchTerm(s)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tip */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-teal-200 text-xs md:text-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Байршил, нэр, эсвэл үнээр хайж болно</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 md:mt-16">

            {/* Mobile: хэвтээ дараалал */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide px-1 justify-center">
              {[
                { value: 4, suffix: "+", label: "Амралтын газар", from: "from-teal-500", to: "to-emerald-600" },
                { value: 1370, suffix: "k+", label: "Жуулчид", from: "from-blue-500", to: "to-indigo-600" },
                { value: 48, suffix: "★", label: "Дундаж үнэлгээ", from: "from-purple-500", to: "to-pink-600" },
              ].map((stat, i) => (
                <div key={i} className={`flex-shrink-0 bg-gradient-to-br ${stat.from} ${stat.to} rounded-2xl px-5 py-4 text-white shadow-lg`}>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-white/80 mt-0.5 whitespace-nowrap">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Desktop: 3 багана */}
            <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-all">
                <div className="text-5xl font-bold mb-2"><AnimatedCounter value={4} suffix="+" /></div>
                <div className="text-teal-50 text-lg">Амралтын газар</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-all">
                <div className="text-5xl font-bold mb-2"><AnimatedCounter value={1370} suffix="k+" /></div>
                <div className="text-blue-50 text-lg">Жуулчид</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-all">
                <div className="text-5xl font-bold mb-2"><AnimatedCounter value={48} suffix="★" /></div>
                <div className="text-purple-50 text-lg">Дундаж үнэлгээ</div>
              </div>
            </div>
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default Hero;