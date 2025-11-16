import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const mapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 🧩 Зураг цэвэрлэх функц
function normalizeImagesField(field) {
  if (!field) return [];

  if (Array.isArray(field)) {
    return field
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          return item.url || item.path || item.filename || item.src || item.image || null;
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return normalizeImagesField(parsed);
    } catch {
      if (field.includes(",")) {
        return field.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return [field];
    }
  }

  if (typeof field === "object") {
    return Object.values(field).filter(Boolean);
  }

  return [];
}

export default function Details() {
  const { id } = useParams();
  const [resort, setResort] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentImg, setCurrentImg] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Review & Rating state
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const distanceUBtoKhujirt = 380;

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/resorts/${id}`);
        const data = await res.json();
        if (!mounted) return;

        setResort(data.resort || data);

        // 🖼️ Зураг
        let imgs = normalizeImagesField(
          data.images || data.gallery || data.image || data.photos || (data.files?.[0]?.images ?? [])
        );

        if (imgs.length === 0 && data.image && typeof data.image === "object" && !Array.isArray(data.image)) {
          imgs = Object.values(data.image).filter(Boolean);
        }

        const fullImgs = imgs.map((src) =>
          /^https?:\/\//i.test(src) ? src : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`
        );
        setImages(fullImgs);
        setCurrentImg(fullImgs[0] || "");

        // 🎥 Видео
        const vids = normalizeImagesField(data.files?.[0]?.videos || []);
        const fullVids = vids.map((v) =>
          /^https?:\/\//i.test(v) ? v : `${API_BASE}${v.startsWith("/") ? v : `/${v}`}`
        );
        setVideos(fullVids);

        // 🔹 Fetch reviews
        fetchReviews();

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/reviews/${id}`, { userName, rating, comment });
      setUserName(""); 
      setComment(""); 
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        ⏳ Ачаалж байна...
      </div>
    );

  if (!resort)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Газрын мэдээлэл олдсонгүй</h2>
          <Link to="/" className="text-blue-600 underline">Буцах</Link>
        </div>
      </div>
    );

  const location = resort.location;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🏞️ Hero */}
      <div className="relative h-[480px] w-full">
        <img
          src={currentImg || `${API_BASE}/default-resort.jpg`}
          alt={resort.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{resort.name}</h1>
        </div>
        <Link
          to="/"
          className="absolute top-6 left-6 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow transition"
        >
          ← Буцах
        </Link>
      </div>

      {/* 💡 Resort Details */}
      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10">
          {/* 🔹 Resort Info */}
          <div className="md:flex justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{resort.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                {resort.description || "Тайлбар байхгүй байна."}
              </p>
              <div className="text-teal-700 font-semibold text-lg mt-2">
                💰 Үнэ: {resort.price ? `${parseInt(resort.price).toLocaleString()} ₮` : "—"}
              </div>
            </div>

            {/* 🔹 Gallery */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700 mb-3">Зургийн галерей</h3>
              {images.length > 0 ? (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${resort.name} ${i + 1}`}
                      onClick={() => setCurrentImg(src)}
                      className={`w-40 h-28 rounded-lg object-cover shadow-md cursor-pointer transition-transform duration-300 ${
                        currentImg === src ? "ring-4 ring-teal-500 scale-105" : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">Зураг алга байна.</div>
              )}
            </div>
          </div>

          {/* 🎥 Видео + 🗺️ Байршил */}
          {(videos.length > 0 || (location && location.lat && location.lng)) && (
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">🎬 Видео ба Байршил</h3>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Видео */}
                <div className="flex-1 bg-gray-50 rounded-xl p-3 shadow">
                  {videos.length > 0 ? (
                    <video
                      src={videos[0]}
                      controls
                      className="w-full h-64 md:h-80 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-gray-500 italic h-64 md:h-80">
                      Видео байхгүй байна.
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="flex-1 flex flex-col items-center">
                  <h3 className="text-2xl font-semibold mb-4 text-center">Байршлын зураг</h3>
                  <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      title={resort.name}
                      src={`https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${encodeURIComponent(resort.name)}`}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      loading="lazy"
                      className="border-0"
                    />
                  </div>
                  {distanceUBtoKhujirt && (
                    <p className="text-center mt-4 text-gray-700">
                      🛣️ Улаанбаатараас {resort.name} хүртэлх зай:{" "}
                      <span className="font-semibold text-green-700">{distanceUBtoKhujirt} км</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 🔹 Reviews */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Зочдын сэтгэгдэл</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                  <input 
                    type="text" 
                    placeholder="Нэрээ бичнэ үү" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)} 
                    required
                    className="p-2 border rounded"
                  />
                  <textarea 
                    placeholder="Сэтгэгдлээ бичнэ үү" 
                    value={comment} 
                    onChange={e => setComment(e.target.value)} 
                    required
                    className="p-2 border rounded"
                  />
                  <select 
                    value={rating} 
                    onChange={e => setRating(Number(e.target.value))}
                    className="p-2 border rounded w-32"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} од</option>)}
                  </select>
                  <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Илгээх</button>
                </form>

                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-gray-300 pb-2">
                      <strong>{r.userName}</strong> - {r.rating} од
                      <p>{r.comment}</p>
                      <small className="text-gray-500">{new Date(r.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                  {reviews.length === 0 && <p className="text-gray-500 italic">Одоогоор сэтгэгдэл байхгүй байна.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
