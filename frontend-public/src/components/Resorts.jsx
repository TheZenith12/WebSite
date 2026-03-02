import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, MapPin, Star, Heart, ChevronRight } from "lucide-react";
import Header from "./Header";
import Hero from "./Hero";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // 🏕️ Fetch resorts from backend
  // 🏕️ Fetch resorts from backend
  async function fetchResorts() {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Серверээс алдаа ирлээ: " + res.status);
      }

      const data = await res.json();
      console.log(data);

      const resorts = (data.resorts || data).map((r) => {
        const imgs = r.images || [];

        let imgSrc = imgs.length > 0 ? imgs[0] : "";

        const fullImg = imgSrc
          ? /^https?:\/\//i.test(imgSrc)
            ? imgSrc
            : `${API_BASE}/${imgSrc.replace(/^\/+/, "")}`
          : "https://via.placeholder.com/600x400?text=No+Image";

        return {
          ...r,
          image: fullImg,
          rating: r.rating || (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
          visitors: r.visitors || Math.floor(Math.random() * 2000) + 500,
          location: r.location || "Монгол",
        };
      });

      setList(resorts);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchResorts();
  }, []);

  // 🔍 Search filter
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

  // ♥ Toggle favorite
  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Total visitors calculation
  const totalVisitors = useMemo(() => {
    return list.reduce((sum, resort) => sum + (resort.visitors || 0), 0);
  }, [list]);

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
        <Header totalResorts={0} totalVisitors={0} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl mb-6 animate-bounce">⏳</div>
            <div className="text-2xl text-gray-700 font-semibold">Мэдээлэл ачаалж байна...</div>
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
        <Header totalResorts={0} totalVisitors={0} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl mb-6">⚠️</div>
            <div className="text-2xl text-red-600 font-semibold mb-4">Алдаа гарлаа</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Header */}
      <Header totalResorts={list.length} totalVisitors={totalVisitors} />

      {/* Hero Section */}
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Resorts Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Онцлох амралтын газрууд
          </h2>
          <span className="text-gray-500 font-medium">{filteredList.length} газар олдлоо</span>
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredList.map((resort) => (
              <article
                key={resort._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                onClick={() => setSelectedResort(resort)}
              >

                {/* Зураг */}
                <div className="relative overflow-hidden h-32 sm:h-56">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    className="w-full h-full object-cover"
                  />


                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleFavorite(resort._id, e)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors duration-300 ${favorites.has(resort._id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                        }`}
                    />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    Жуулчны бааз
                  </div>

                  {/* Views Counter */}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    {resort.visitors?.toLocaleString() || '2.5k'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {resort.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" />
                        <span className="truncate">{resort.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                    <div className="flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white text-white" />
                      <span className="text-white font-semibold text-xs sm:text-sm">{resort.rating}</span>
                    </div>
                    <span className="text-gray-500 text-xs hidden sm:inline">({resort.visitors || 2068} үнэлгээ)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between mb-2 sm:mb-4 pb-2 sm:pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        {resort.price ? `${parseInt(resort.price).toLocaleString()}₮` : "—"}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">/ хоног</span>
                    </div>
                  </div>

                  {/* Amenities - hidden on mobile */}
                  <div className="hidden sm:flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                      Халуун рашаан
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                      Ресторан
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                      WiFi
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`/details/${resort._id}`}
                    className="w-full py-2 sm:py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg hover:shadow-xl group text-xs sm:text-base"
                  >
                    Дэлгэрэнгүй
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Таны амардаг амралтын газар энд байна уу?
            </h2>
            <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
              Хэрэв үгүй бол мэдээллээ бидэнд өгч, бүртгүүлж, өөр олон хүнд тус болоорой.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <span className="text-2xl font-bold text-white">AmraltinGazar</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Танд тохирох амралтын газар энд байгаа гэдэгт найдаж байна.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Холбогдох</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+976 9135-4449</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@amraltingazar.mn</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2026 AmraltinGazar. Бүх эрх хуулиар хамгаалагдсан.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Resorts;