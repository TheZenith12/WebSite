import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Eye, MapPin, Heart, ChevronRight } from "lucide-react";
import Header from "./Header";
import Hero from "./Hero";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef(null);
  const PAGE_SIZE = 4;

  // 🏕️ Fetch resorts from backend
  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Серверээс алдаа ирлээ: " + res.status);
      }

      const data = await res.json();

      const resorts = (data.resorts || data).map((r) => {
        const imgs = r.images || [];
        const imgSrc = imgs.length > 0 ? imgs[0] : "";
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

  // Visible items for infinite scroll
  const visibleItems = useMemo(() => filteredList.slice(0, visibleCount), [filteredList, visibleCount]);
  const hasMore = visibleCount < filteredList.length;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Reset visible count on search
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm]);

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

  //  Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
        <Header totalResorts={0} totalVisitors={0} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-red-600 font-semibold mb-4">Мэдээлэл ачаалж байна...</div>
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
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} list={list} totalVisitors={totalVisitors} />

      {/* Resorts Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Онцлох амралтын газрууд</h2>
          <span className="text-gray-500 font-medium">{filteredList.length} газар олдлоо</span>
        </div>

        {filteredList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleItems.map((resort) => (
                <article
                  key={resort._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-36 sm:h-48">
                    <img
                      src={resort.image}
                      alt={resort.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Like Button */}
                    <button
                      onClick={(e) => toggleFavorite(resort._id, e)}
                      className="absolute top-2 right-2 w-8 h-8 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors duration-300 ${favorites.has(resort._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                          }`}
                      />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                      Сувилал
                    </div>

                    {/* Views Counter */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {resort.visitors?.toLocaleString() || "2.5k"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-6">
                    <div className="mb-2 sm:mb-3">
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-teal-600 transition-colors leading-tight">
                        {resort.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" />
                        <span className="truncate">{resort.location}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-2 sm:mb-4 pb-2 sm:pb-4 border-b border-gray-100">
                      <span className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        {resort.price ? `${parseInt(resort.price).toLocaleString()}₮` : "—"}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">/ хоног</span>
                    </div>

                    {/* Amenities - hide on mobile */}
                    <div className="hidden sm:flex flex-wrap gap-2 mb-4">
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
                      className="w-full py-2 sm:py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs sm:text-base font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      <span className="hidden sm:inline">Дэлгэрэнгүй үзэх</span>
                      <span className="sm:hidden">Үзэх</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={loaderRef} className="flex justify-center py-10">
              {hasMore ? (
                <div className="flex items-center gap-3 text-teal-600">
                  <div className="w-6 h-6 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: "3px" }} />
                  <span className="font-medium text-gray-500">Ачаалж байна...</span>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">Бүх амралт харагдаж байна ({filteredList.length})</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Тохирох амралт олдсонгүй</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-blue-700 to-blue-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Таны амралтын газар энд байна уу?
            </h2>
            <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
              Өөрийн амралтын газрыг бүртгүүлж, мянга мянган хүмүүст таниулаарай
            </p>
            <button className="px-10 py-5 bg-white text-teal-600 hover:bg-gray-50 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105">
              Амралтын газар нэмэх
            </button>
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
                <span className="text-2xl font-bold text-white">Амралтын газар</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Монголын амралтын газрын мэдээллийн платформ
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Холбогдох</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+976 91354449</span>
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
            <p>© 2026 Амралтын газар</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Resorts;