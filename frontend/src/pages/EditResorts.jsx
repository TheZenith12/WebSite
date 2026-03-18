import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const API_BASE = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  { key: "suvilal", label: "Амралтын газар", icon: "🏥", color: "from-teal-500 to-emerald-500" },
  { key: "juulchnii_baaz", label: "Жуулчны бааз", icon: "⛺", color: "from-blue-500 to-indigo-500" },
  { key: "uzseglent_gazar", label: "Байгалийн үзэсгэлэнт", icon: "🏔️", color: "from-purple-500 to-pink-500" },
];

function EditResort() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    price: "",
    location: "",
    lat: "",
    lng: "",
    category: "", // ← шинэ
  });

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedVideos, setRemovedVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResort = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/resorts/${id}`);
        const resort = res.data.resort;
        const files = res.data.files;

        setForm({
          name: resort.name || "",
          description: resort.description || "",
          phone: resort.phone || "",
          price: resort.price || "",
          location: resort.location || "",
          lat: resort.lat || "",
          lng: resort.lng || "",
          category: resort.category || "suvilal",
        });

        setExistingImages(files?.images || []);
        setExistingVideos(files?.videos || []);
      } catch (err) {
        setError("Амралтын газар ачаалахад алдаа гарлаа");
      } finally {
        setInitializing(false);
      }
    };
    fetchResort();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleNewVideos = (e) => {
    const files = Array.from(e.target.files);
    setNewVideos((prev) => [...prev, ...files]);
    setVideoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (i) => {
    setRemovedImages((prev) => [...prev, existingImages[i]]);
    setExistingImages(existingImages.filter((_, idx) => idx !== i));
  };

  const removeExistingVideo = (i) => {
    setRemovedVideos((prev) => [...prev, existingVideos[i]]);
    setExistingVideos(existingVideos.filter((_, idx) => idx !== i));
  };

  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, idx) => idx !== i));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
  };

  const removeNewVideo = (i) => {
    setNewVideos(newVideos.filter((_, idx) => idx !== i));
    setVideoPreviews(videoPreviews.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { alert("Төрлөө сонгоно уу!"); return; }
    setLoading(true);
    try {
      const uploadedImages = [];
      for (let img of newImages) uploadedImages.push(await uploadToCloudinary(img));

      const uploadedVideos = [];
      for (let vid of newVideos) uploadedVideos.push(await uploadToCloudinary(vid));

      await axios.put(`${API_BASE}/api/admin/resorts/edit/${id}`, {
        ...form,
        newImages: uploadedImages,
        newVideos: uploadedVideos,
        removedImages,
        removedVideos,
      });

      alert("Амжилттай шинэчлэв 🎉");
      navigate("/resorts");
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return <p className="p-6">Түр хүлээнэ үү...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Амралтын газар засах</h2>

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
        </div>

        {/* ===== FIELDS ===== */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Нэр</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Тайлбар</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Утас</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Байршил</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Latitude</label>
            <input type="text" name="lat" value={form.lat} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Longitude</label>
            <input type="text" name="lng" value={form.lng} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Үнэ (₮/хоног)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300" />
        </div>

        {/* Existing Images */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">Одоо байгаа зургууд</label>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-24 h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">🖼️ Шинэ зургууд нэмэх</label>
          <input type="file" multiple accept="image/*" onChange={handleNewImages} />
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} className="w-24 h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Videos */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">Одоо байгаа бичлэгүүд</label>
          <div className="flex flex-wrap gap-2">
            {existingVideos.map((vid, i) => (
              <div key={i} className="relative">
                <video src={vid} width="120" controls className="rounded-lg" />
                <button type="button" onClick={() => removeExistingVideo(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* New Videos */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">🎥 Шинэ бичлэгүүд нэмэх</label>
          <input type="file" multiple accept="video/*" onChange={handleNewVideos} />
          <div className="flex flex-wrap gap-2 mt-2">
            {videoPreviews.map((url, i) => (
              <div key={i} className="relative">
                <video src={url} width="120" controls className="rounded-lg" />
                <button type="button" onClick={() => removeNewVideo(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-60">
          {loading ? "Хадгалж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}

export default EditResort;