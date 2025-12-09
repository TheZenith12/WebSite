import React, { useState } from "react";
import axios from "axios";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddResort() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    price: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧾 Input handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🖼️ Multiple image select + preview
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // 🎥 Multiple videos
  const handleVideos = (e) => {
    const files = Array.from(e.target.files);
    setVideos((prev) => [...prev, ...files]);
  };

  // 🗑️ Remove preview image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 📤 Submit
  // ... таны импортууд ба state ижил
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1) Images — Promise.all ашиглана
    const uploadedImageUrls = await Promise.all(
      images.map(async (img) => {
        const res = await uploadToCloudinary(img);
        // uploadToCloudinary аливаа объект эсвэл string буцааж болно — тохируулна
        if (typeof res === "string") return res;
        // Cloudinary response-д нийтлэг нь res.secure_url
        if (res?.secure_url) return res.secure_url;
        if (res?.url) return res.url;
        throw new Error("Cloudinary response-д URL олдсонгүй");
      })
    );

    // 2) Videos
    const uploadedVideoUrls = await Promise.all(
      videos.map(async (vid) => {
        const res = await uploadToCloudinary(vid);
        if (typeof res === "string") return res;
        if (res?.secure_url) return res.secure_url;
        if (res?.url) return res.url;
        throw new Error("Cloudinary response-д URL олдсонгүй");
      })
    );

    // 3) Боловсруулалт (lat,lng-ийг Number болгох)
    const payload = {
      ...form,
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      images: uploadedImageUrls,
      videos: uploadedVideoUrls,
    };

    // Зарим API-үүд JSON string-аар хүлээдэг тул шаардлагатай бол stringify хийгээд явуулж болно.
    await axios.post(`${API_BASE}/api/admin/resorts/new`, payload);

    alert("Амжилттай нэмэгдлээ!");

    // Reset
    setForm({
      name: "",
      description: "",
      location: "",
      lat: "",
      lng: "",
      price: "",
    });
    setImages([]);
    setVideos([]);
    setPreviewUrls([]);
  } catch (err) {
    console.error("Алдаа:", err?.response?.data ?? err);
    alert("Амралтын газар нэмэхэд алдаа гарлаа! Консолыг шаллана уу.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Амралтын газар нэмэх</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">

        <input
          name="name"
          placeholder="Нэр"
          value={form.name}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Тайлбар"
          value={form.description}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <textarea
          name="lat"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <textarea
          name="lng"
          placeholder="Longitude"
          value={form.lng}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <input
          name="location"
          placeholder="Байршил"
          value={form.location}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <input
          name="price"
          type="number"
          placeholder="Үнэ"
          value={form.price}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        {/* Images */}
        <div>
          <label className="font-medium">🖼️ Олон зураг сонгох</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} />

          <div className="grid grid-cols-4 gap-2 mt-2">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div>
          <label className="font-medium">🎥 Бичлэгүүд</label>
          <input type="file" multiple accept="video/*" onChange={handleVideos} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Хадгалж байна..." : "Нэмэх"}
        </button>
      </form>
    </div>
  );
}
