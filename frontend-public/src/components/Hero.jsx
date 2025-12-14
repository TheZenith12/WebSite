import React from 'react';

function Hero({ searchTerm, setSearchTerm }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 backdrop-blur-3xl"></div>
      <div className="w-full px-6 py-16 relative max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            Тавтай морилно уу!
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Байгаль, тайван амралт, тохилог байр таныг хүлээж байна
          </p>
            </div>
          </div>
    </section>
  );
}

export default Hero;