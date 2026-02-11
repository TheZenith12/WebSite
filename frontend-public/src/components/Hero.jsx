import React, { useState } from 'react';

function Hero({ searchTerm, setSearchTerm }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section style={{ backgroundImage: "url('/website.png')" }}>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Animated circles */}
  <div className="absolute inset-0 opacity-20">...</div>

  {/* Content */}
  <div className="relative z-10">...</div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative w-full px-6 py-20 max-w-[1400px] mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-float">
            Тавтай морилно уу! 👋
          </h2>
          <p className="text-xl md:text-2xl text-teal-50 mb-12">
            Байгаль, тайван амралт, тохилог байр танай хүлээж байна
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              {/* Animated Gradient Border Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-3xl blur-2xl transition-all duration-500 ${
                isFocused ? 'opacity-75 scale-105' : 'opacity-50 group-hover:opacity-75'
              }`}></div>
              
              {/* Search Container */}
              <div className={`relative bg-white rounded-3xl shadow-2xl transition-all duration-300 ${
                isFocused ? 'ring-4 ring-white/40' : ''
              }`}>
                <div className="flex items-center gap-3 p-2">
                  {/* Search Icon with Animation */}
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl ml-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg 
                      className={`w-6 h-6 text-white transition-transform duration-500 ${
                        isFocused ? 'scale-110 rotate-90' : ''
                      }`}
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

                  {/* Input Field */}
                  <input
                    type="text"
                    placeholder="Хаана амрах вэ? 🏕️"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 px-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg font-medium"
                  />

                  {/* Clear Button (when typing) */}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 mr-2 group/clear"
                    >
                      <svg 
                        className="w-5 h-5 text-gray-600 group-hover/clear:rotate-90 transition-transform duration-300" 
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

                  {/* Search Button */}
                  <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mr-1">
                    <span className="hidden md:inline">Хайх</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>

                {/* Suggestion Pills (shown when focused and empty) */}
                {isFocused && !searchTerm && (
                  <div className="px-6 pb-4 flex flex-wrap gap-2 animate-fadeIn">
                    {['Төв аймаг', 'Архангай', 'Өвөрхангай', 'Хэнтий'].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchTerm(suggestion)}
                        className="px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-700 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Tips Text */}
              <div className="mt-4 flex items-center justify-center gap-2 text-teal-100 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Байршил, нэр, эсвэл үнээр хайж болно</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-16 fill-white">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

export default Hero;