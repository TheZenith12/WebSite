import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, MapPin, Star, Heart } from "lucide-react";
import Header from "./Header";
import Hero from "./Hero";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedResort, setSelectedResort] = useState(null);

  // 🏕️ Амралтын газруудыг танай backend-ээс авах
  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`);
      const data = await res.json();

      const resorts = (data.resorts || data).map((r) => {
        // 🖼️ Зургийн логик
        let imgSrc = "";
        if (Array.isArray(r.image)) {
          imgSrc = r.image[0];
        } else if (typeof r.image === "string") {
          imgSrc = r.image;
        } else if (r.image && typeof r.image === "object") {
          imgSrc = r.image.url || r.image.path || Object.values(r.image)[0];
        }

        const fullImg = imgSrc
          ? /^https?:\/\//i.test(imgSrc)
            ? imgSrc
            : `${API_BASE}${imgSrc.startsWith("/") ? imgSrc : `/${imgSrc}`}`
          : "/no-image.png";

        return {
          ...r,
          image: fullImg,
          rating: r.rating || (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
          visitors: r.visitors || Math.floor(Math.random() * 2000) + 500,
          location: r.location || "Монгол"
        };
      });

      setList(resorts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResorts();
  }, []);

  // 🔍 Хайлт
  const filteredList = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.price?.toString().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.location?.toLowerCase().includes(term)
    );
  }, [searchTerm, list]);

  // ♥ Таалагдсан
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // 🌀 Ачаалж байна
  if (loading)
    return (
      <>
        <Header totalResorts={0} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="text-7xl mb-6 animate-bounce">⏳</div>
            <div className="text-2xl text-gray-700 font-semibold">Мэдээлэл ачаалж байна...</div>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header totalResorts={0} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="text-7xl mb-6">⚠️</div>
            <div className="text-2xl text-red-600 font-semibold mb-4">Алдаа гарлаа</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <Header totalResorts={list.length} />

      {/* Hero Section */}
      <Hero />

      {/* Resorts Grid */}
      <div className="container mx-auto px-6 py-12">
        {/* Хайлтын Input - Desktop */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Амралтын газар хайх... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none text-lg shadow-lg transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredList.map((resort) => (
              <article
                key={resort._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedResort(resort)}
              >
                {/* Зураг */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.currentTarget.src = "/no-image.png")}
                  />
                  
                  {/* Таалагдсан товч */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(resort._id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(resort._id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Үнэлгээ */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{resort.rating}</span>
                  </div>
                </div>

                {/* Мэдээлэл */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-3">
                    {resort.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resort.description || "Тайлбар байхгүй"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{resort.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {resort.price ? `${parseInt(resort.price).toLocaleString()}₮` : "—"}
                      </div>
                      <div className="text-xs text-gray-500">хоногт</div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{resort.visitors?.toLocaleString()}</span>
                    </div>
                  </div>

                 <Link
                    to={`/details/${resort.id}`}
                    className="w-full block mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all text-center"
                  >
                    Дэлгэрэнгүй үзэх
                  </Link>

                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-xl text-gray-600">Тохирох амралт олдсонгүй</p>
          </div>
        )}
      </div>

      {/* Floating Search Button (Mobile) */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Modal - Дэлгэрэнгүй мэдээлэл */}
      {selectedResort && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResort(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80">
              <img
                src={selectedResort.image}
                alt={selectedResort.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedResort(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
              >
                ✖
              </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4">{selectedResort.name}</h2>
              <p className="text-gray-600 mb-6">{selectedResort.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{selectedResort.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{selectedResort.rating} үнэлгээ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>{selectedResort.visitors?.toLocaleString()} зочид</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <span>Жилийн турш</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-emerald-600 mb-6">
                {selectedResort.price ? `${parseInt(selectedResort.price).toLocaleString()}₮` : "—"} / хоног
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resorts;