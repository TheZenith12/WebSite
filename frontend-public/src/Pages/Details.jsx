import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Star, MapPin, Eye, Heart, ArrowLeft, Send } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;
const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Details() {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentImg, setCurrentImg] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isLiked, setIsLiked] = useState(false);

  const mapRef = useRef(null);

  // Fetch Resort Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/resorts/${id}`);
        const data = await res.json();

        setResort(data.resort || data);

        const imgs = data.files?.images || [];
        const fullImgs = imgs.map((src) =>
          /^https?:\/\//i.test(src)
            ? src
            : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`
        );
        setImages(fullImgs);
        setCurrentImg(fullImgs[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80");

        const vids = data.files?.videos || [];
        const fullVids = vids.map((src) =>
          /^https?:\/\//i.test(src)
            ? src
            : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`
        );
        setVideos(fullVids);

        fetchReviews();
      } catch (err) {
        console.error("Fetch resort error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Google Maps
  useEffect(() => {
    if (!resort?.lat || !resort?.lng) return;

    const scriptId = "google-maps-script";

    const initMap = () => {
      const pos = {
        lat: Number(resort.lat),
        lng: Number(resort.lng),
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center: pos,
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9e9f6" }],
          },
        ],
      });

      new window.google.maps.Marker({
        position: pos,
        map,
        title: resort.name,
      });
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else if (window.google) {
      initMap();
    }
  }, [resort]);

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/reviews/${id}`, {
        userName,
        rating,
        comment,
      });
      setUserName("");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">⏳</div>
          <div className="text-2xl text-gray-700 font-semibold">Уншиж байна...</div>
        </div>
      </div>
    );
  }

  if (!resort) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Амралтын газар олдсонгүй</h2>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Hero Image */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        <img
          src={currentImg}
          alt={resort.name}
          className="w-full h-full object-cover"
        />
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Буцах</span>
        </Link>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-6 right-6 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-7 h-7 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-8 left-8 z-20 text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{resort.name}</h1>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5" />
              <span>{resort.location || "Монгол"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{resort.rating || "4.8"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Eye className="w-5 h-5" />
              <span>2.5k үзсэн</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-20 relative z-30">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12">
          
          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Тайлбар</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {resort.description || "Тайлбар байхгүй байна."}
              </p>
            </div>
            
            {/* Price Card */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">Хоногийн үнэ</div>
              <div className="text-5xl font-bold mb-6">
                {resort.price ? `${parseInt(resort.price).toLocaleString()}₮` : "—"}
              </div>
              <button className="w-full py-4 bg-white text-teal-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg">
                Захиалах
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Зургийн галерей</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${resort.name} ${i + 1}`}
                    className={`w-full h-48 object-cover rounded-xl shadow cursor-pointer transition-all duration-300 ${
                      currentImg === src 
                        ? 'ring-4 ring-teal-500 scale-105' 
                        : 'hover:scale-105 hover:shadow-xl'
                    }`}
                    onClick={() => setCurrentImg(src)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video & Map */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Video */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                🎬 Видео
              </h3>
              {videos.length > 0 ? (
                <video
                  src={videos[0]}
                  controls
                  className="w-full h-80 rounded-2xl shadow-xl"
                />
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p>Видео байхгүй</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                🗺 Байршил
              </h3>
              <div
                ref={mapRef}
                className="w-full h-80 rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Сэтгэгдлүүд</h2>

            {/* Add Review Form */}
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 mb-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Сэтгэгдэл үлдээх</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-200 outline-none transition-all"
                  placeholder="Таны нэр"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <textarea
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-200 outline-none transition-all resize-none"
                  placeholder="Таны сэтгэгдэл..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <div className="flex gap-4 items-center">
                  <select
                    className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-200 outline-none transition-all font-semibold"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{"⭐".repeat(n)} {n} од</option>
                    ))}
                  </select>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    Илгээх
                  </button>
                </div>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 text-lg">Сэтгэгдэл байхгүй байна. Эхний сэтгэгдлээ үлдээгээрэй!</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{r.userName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < r.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(r.createdAt).toLocaleDateString('mn-MN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}
