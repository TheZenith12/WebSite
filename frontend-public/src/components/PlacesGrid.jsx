import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // 🔍 icon
import places from "../data/Places.js"; // ✅ ЗӨВ — .js болгосон

export default function PlacesGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const distanceUBtoKhujirt = 380;

  // Хайлтын логик
  const filteredPlaces = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return places;
    return places.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(term);
      const priceMatch = p.price?.toString().includes(term);
      return nameMatch || priceMatch;
    });
  }, [searchTerm]);

  return (
    <div className="relative w-full bg-gradient-to-b from-sky-50 to-green-50 py-10">
      <div className="container mx-auto px-6">
        
        {/* Амралтын Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-center">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 text-center flex-1">
                    {p.short}
                  </p>
                  <p className="mt-3 text-green-700 font-semibold text-center">
                    Үнэ:{" "}
                    {p.price ? `${parseInt(p.price).toLocaleString()} ₮` : ""}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <Link
                      to={`/details/${p.id}`}
                      className="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-transform hover:scale-105 shadow-md"
                    >
                      Дэлгэрэнгүй үзэх
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">
            😕 Тохирох амралт олдсонгүй.
          </p>
        )}

        {/* 🗺️ Map хэсэг */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Байршлын зураг
          </h3>
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="UB to Khujirt map"
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d381271.6506442562!2d102.99124969310406!3d46.518505456418624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x5d969238cf70dc39%3A0x91f0e2e79b2644a4!2z1qjQu9C10YDQutC10YLRgdC60LjQvNCwLCDTqNC10L7QsdCw0L3QvtCz!3m2!1d47.9198198!2d106.9174562!4m5!1s0x5dcb43b1c9bbfc73%3A0x9bfa44f6c6e78e62!2z0KXQvNC_0YzQs9C70LjRjywg0KHQv9C-0LzQtdC90YI!3m2!1d46.7871784!2d102.882374!5e0!3m2!1smn!2smn!4v1696775087211!5m2!1smn!2smn"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-center mt-4 text-gray-700">
            🛣️ Улаанбаатараас Хужирт хүртэлх зай:{" "}
            <span className="font-semibold text-green-700">
              {distanceUBtoKhujirt} км
            </span>
          </p>
        </div>
      </div>

      {/* 🔍 Floating Search Button (баруун талд байрлана) */}
      <div className="fixed bottom-8 right-8 z-50">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Search className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-slide-left">
            <input
              type="text"
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Бүгдийг харах
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className="ml-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
