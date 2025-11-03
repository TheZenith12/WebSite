import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../global";

export default function AddResort() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧾 Text input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🖼️ Олон зураг сонгох
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]); // шинэ зураг нэмэх
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // 🎥 Олон видео
  const handleVideos = (e) => setVideos([...e.target.files]);

  // 🖼️ Preview-с зураг устгах
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 📨 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("location", form.location);

    images.forEach((img) => formData.append("images", img));
    videos.forEach((vid) => formData.append("videos", vid));

    try {
      await axios.post(`${API_BASE}/api/admin/resorts/new`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Амжилттай нэмэгдлээ!");
      setForm({ name: "", description: "", price: "", location: "" });
      setImages([]);
      setVideos([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error("Алдаа:", err);
      alert("Амралтын газар нэмэхэд алдаа гарлаа!");
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
        <input
          name="price"
          type="number"
          placeholder="Үнэ"
          value={form.price}
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


        <div>
          <label className="font-medium">🖼️ Олон зураг сонгох</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`preview-${i}`}
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
