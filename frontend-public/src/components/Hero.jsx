import React from 'react';

function Hero({ searchTerm, setSearchTerm }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white">
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
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row items-center gap-3">
                <svg className="w-6 h-6 text-gray-400 ml-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Амралтын газар хайх..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg w-full"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute md:relative right-4 md:right-0 top-1/2 md:top-0 -translate-y-1/2 md:translate-y-0 text-gray-400 hover:text-gray-600 text-xl md:px-4"
                  >
                    ✖
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-16 fill-current text-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
      `}</style>
    </section>
  );
}

export default Hero;
