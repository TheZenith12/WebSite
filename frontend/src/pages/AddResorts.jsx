import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const API_BASE = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  { key: "suvilal", label: "Амралтын газар", icon: "🛌", color: "from-teal-500 to-emerald-500" },
  { key: "juulchnii_baaz", label: "Жуулчны бааз", icon: "⛺", color: "from-blue-500 to-indigo-500" },
  { key: "uzseglent_gazar", label: "Байгалийн үзэсгэлэнт", icon: "🌿", color: "from-purple-500 to-pink-500" },
];

export default function AddResort() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    location: "",
    lat: "",
    lng: "",
    price: "",
    category: "", // ← шинэ
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleVideos = (e) => {
    setVideos((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      alert("Төрлөө сонгоно уу!");
      return;
    }
    setLoading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        images.map(async (img) => {
          const res = await uploadToCloudinary(img);
          if (typeof res === "string") return res;
          if (res?.secure_url) return res.secure_url;
          if (res?.url) return res.url;
          throw new Error("Cloudinary response-д URL олдсонгүй");
        })
      );

      const uploadedVideoUrls = await Promise.all(
        videos.map(async (vid) => {
          const res = await uploadToCloudinary(vid);
          if (typeof res === "string") return res;
          if (res?.secure_url) return res.secure_url;
          if (res?.url) return res.url;
          throw new Error("Cloudinary response-д URL олдсонгүй");
        })
      );

      const payload = {
        ...form,
        lat: form.lat ? parseFloat(form.lat) : undefined,
        lng: form.lng ? parseFloat(form.lng) : undefined,
        images: uploadedImageUrls,
        videos: uploadedVideoUrls,
      };

      await axios.post(`${API_BASE}/api/admin/resorts/new`, payload);
      alert("Амжилттай нэмэгдлээ!");

      setForm({ name: "", description: "", phone: "", location: "", lat: "", lng: "", price: "", category: "" });
      setImages([]);
      setVideos([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error("Алдаа:", err?.response?.data ?? err);
      alert("Амралтын газар нэмэхэд алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Амралтын газар нэмэх</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">

        {/* ===== CATEGORY SELECTOR ===== */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Төрөл сонгох <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = form.category === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.key })}
                  className={`
                    flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl
                    border-2 transition-all duration-200 cursor-pointer
                    ${isSelected
                      ? `bg-gradient-to-br ${cat.color} border-transparent text-white shadow-lg scale-[1.03]`
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
          {!form.category && (
            <p className="text-xs text-gray-400 mt-2">Төрлөө заавал сонгоно уу</p>
          )}
        </div>

        {/* ===== FIELDS ===== */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Нэр</label>
          <input name="name" placeholder="Амралтын газрын нэр" value={form.name} onChange={handleChange} required className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Тайлбар</label>
          <textarea name="description" placeholder="Тайлбар" value={form.description} onChange={handleChange} rows={3} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Утас</label>
          <input name="phone" placeholder="+976 ..." value={form.phone} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Байршил</label>
          <input name="location" placeholder="Аймаг, дүүрэг..." value={form.location} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Latitude</label>
            <input name="lat" placeholder="47.9077" value={form.lat} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Longitude</label>
            <input name="lng" placeholder="106.8832" value={form.lng} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Үнэ (₮/хоног)</label>
          <input name="price" type="number" placeholder="0" value={form.price} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        {/* Images */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">🖼️ Зургууд</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} className="block" />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-700">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">🎥 Бичлэгүүд</label>
          <input type="file" multiple accept="video/*" onChange={handleVideos} className="block" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-60">
          {loading ? "Хадгалж байна..." : "Нэмэх"}
        </button>
      </form>
    </div>
  );
}