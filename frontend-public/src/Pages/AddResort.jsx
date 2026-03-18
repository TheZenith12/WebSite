import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function AddResort() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);

  // Input өөрчлөгдөх үед
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Зураг upload
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("description", formData.description);

      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }

      await axios.post(`${API_BASE}/admin/add-resort`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Амжилттай нэмэгдлээ ✅");
      navigate("/admin"); // нэмсний дараа admin page руу буцна
    } catch (error) {
      console.error(error);
      alert("Алдаа гарлаа ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">
          Амралтын газар нэмэх
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Амралтын газрын нэр"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Байршил"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Үнэ (₮)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Тайлбар"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Images */}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition"
          >
            {loading ? "Нэмэж байна..." : "Нэмэх"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddResort;
