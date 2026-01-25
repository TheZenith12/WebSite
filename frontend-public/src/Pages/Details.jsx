import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ------------------------
// Image normalize function
// ------------------------
function normalizeImagesField(field) {
  if (!field) return [];

  if (Array.isArray(field)) {
    return field
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          return (
            item.url ||
            item.path ||
            item.filename ||
            item.src ||
            item.image ||
            null
          );
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
        return field
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
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

  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // ------------------------
  // Fetch Resort + Reviews
  // ------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/resorts/${id}`);
        const data = await res.json();

        setResort(data.resort || data);

        // IMAGES (NEW – CORRECT)
const imgs = data.files?.images || [];

const fullImgs = imgs.map((src) =>
  /^https?:\/\//i.test(src)
    ? src
    : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`
);

setImages(fullImgs);
setCurrentImg(fullImgs[0] || "");

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

  // ------------------------
  // Load Google Maps
  // ------------------------
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
      disableDefaultUI: true, // цэвэр харагдуулна
      zoomControl: true,
      fullscreenControl: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0e1626" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // 🏨 Custom marker
    new window.google.maps.Marker({
      position: pos,
      map,
      title: resort.name,
      icon: {
        url: "/resort-marker.png", // public folder дотор байлга
        scaledSize: new window.google.maps.Size(42, 42),
      },
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
  } else {
    initMap();
  }
}, [resort]);

  // ------------------------
  // Fetch Reviews
  // ------------------------
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  // ------------------------
  // Submit Review
  // ------------------------
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

  // ------------------------
  // LOADING HANDLING
  // ------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Уншиж байна...
      </div>
    );

  if (!resort)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Амралтын газрын мэдээлэл олдсонгүй
          </h2>
          <Link to="/" className="text-blue-600 underline">
            Буцах
          </Link>
        </div>
      </div>
    );

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative h-[420px] w-full">
        <img
          src={currentImg}
          alt={resort.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold drop-shadow">{resort.name}</h1>
        </div>
        <Link
          to="/"
          className="absolute top-6 left-6 bg-white px-4 py-2 rounded shadow"
        >
          ← Буцах
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 -mt-16 relative">
        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-8">
          {/* INFO */}
          <h2 className="text-2xl font-bold">{resort.name}</h2>
          <p className="text-gray-700">{resort.description}</p>

          <div className="text-lg font-semibold text-teal-600">
            💸 Үнэ: {resort.price}₮
          </div>

          {/* GALLERY */}
          <div>
            <h3 className="font-semibold mb-3">Зургийн галерей</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className={`w-40 h-28 rounded-lg shadow cursor-pointer ${
                    currentImg === src ? "ring-4 ring-teal-500" : ""
                  }`}
                  onClick={() => setCurrentImg(src)}
                />
              ))}
            </div>
          </div>

          {/* VIDEO + MAP */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* VIDEO */}
            <div>
              <h3 className="font-semibold mb-3">🎬 Видео</h3>
              {videos.length > 0 ? (
                <video
                  src={videos[0]}
                  controls
                  className="w-full h-64 rounded-xl"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Видео байхгүй
                </div>
              )}
            </div>

            {/* MAP */}
            <div>
              <h3 className="font-semibold mb-3">🗺 Байршил</h3>
              <div
                ref={mapRef}
                className="w-full h-64 rounded-xl border shadow"
              ></div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Сэтгэгдлүүд</h2>

            {/* ADD REVIEW */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
              <input
                className="p-2 border rounded w-full"
                placeholder="Нэр"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <textarea
                className="p-2 border rounded w-full"
                placeholder="Сэтгэгдэл"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <select
                className="p-2 border rounded"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n} од</option>
                ))}
              </select>
              <button className="bg-teal-600 text-white px-4 py-2 rounded">
                Илгээх
              </button>
            </form>

            {/* LIST REVIEWS */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">Сэтгэгдэл байхгүй байна.</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="border-b py-2">
                  <strong>{r.userName}</strong> — {r.rating} од
                  <p>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
