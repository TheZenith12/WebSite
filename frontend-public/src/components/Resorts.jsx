import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Search, Eye, Star, MapPin, Heart, Calendar } from 'lucide-react';

function Resorts({ searchTerm, setSearchTerm, onStatsUpdate }) {
  const [list, setList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResort, setSelectedResort] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Жишээ өгөгдөл (та өөрийн API-аар солих)
  const mockResorts = [
    {
      _id: '1',
      name: 'Хөвсгөл нуур',
      description: 'Монголын хамгийн том, үзэсгэлэнт цэнгэг усны нуур',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.8,
      visitors: 1234,
      location: 'Хөвсгөл аймаг'
    },
    {
      _id: '2',
      name: 'Тэрэлж',
      description: 'Улаанбаатар хотоос ойрхон, байгалийн үзэсгэлэнт газар',
      price: 80000,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      rating: 4.6,
      visitors: 2156,
      location: 'Төв аймаг'
    },
    {
      _id: '3',
      name: 'Алтай нуруу',
      description: 'Өргөн уудам талд, өндөр уулархаг газар',
      price: 200000,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      rating: 4.9,
      visitors: 892,
      location: 'Баян-Өлгий аймаг'
    },
    {
      _id: '4',
      name: 'Хустайн нуруу',
      description: 'Тахь адууны нөөц газар, байгалийн цогцолбор',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      rating: 4.7,
      visitors: 1567,
      location: 'Төв аймаг'
    },
    {
      _id: '5',
      name: 'Хустайн нуруу',
      description: 'Тахь адууны нөөц газар, байгалийн цогцолбор',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      rating: 4.7,
      visitors: 1567,
      location: 'Төв аймаг'
    }
  ];

  useEffect(() => {
    // Жишээ өгөгдөл ачаалах
    setTimeout(() => {
      setList(mockResorts);
      
      // Нийт зочдын тоо тооцоолох
      const total = mockResorts.reduce((sum, r) => sum + (r.visitors || 0), 0);
      
      // Stats-ыг parent component руу дамжуулах
      if (onStatsUpdate) {
        onStatsUpdate({ visitors: total, count: mockResorts.length });
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // Хайлтын систем
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

  // Таалагдсан газруудтай ажиллах
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  if (loading)
    return (
      <div className="w-full px-6 py-20 text-center max-w-[1400px] mx-auto">
        <div className="text-6xl mb-4 animate-bounce">⏳</div>
        <div className="text-xl text-gray-600">Мэдээлэл ачаалж байна...</div>
      </div>
    );

  if (error)
    return (
      <div className="w-full px-6 py-20 text-center max-w-[1400px] mx-auto">
        <div className="text-6xl mb-4">⚠️</div>
        <div className="text-xl text-red-600">Алдаа гарлаа: {error}</div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen">
      <div className="w-full px-6 py-12 max-w-[1400px] mx-auto">
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredList.map((resort) => (
              <article
                key={resort._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedResort(resort)}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
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

                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{resort.rating}</span>
                  </div>
                </div>

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
                      <span>{resort.visitors.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Дэлгэрэнгүй үзэх
                  </button>
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
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <Search className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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

      {/* Modal */}
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
                  <span>{selectedResort.visitors.toLocaleString()} зочид</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Жилийн турш</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-emerald-600 mb-6">
                {selectedResort.price ? `${parseInt(selectedResort.price).toLocaleString()}₮` : "—"} / хоног
              </div>

              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all">
                Захиалга өгөх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resorts;