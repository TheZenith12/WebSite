import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const API_BASE = import.meta.env.VITE_API_URL;

function EditResort() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    price: "",
    location: "",
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

  // ============================
  // Resort мэдээлэл татах
  // ============================
  useEffect(() => {
    const fetchResort = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/resorts/${id}`);

        const resort = res.data.resort;
const files = res.data.files; // ❗ array биш object

setForm({
  name: resort.name || "",
  description: resort.description || "",
  phone: resort.phone || "",
  price: resort.price || "",
  location: resort.location || "",
  lat: resort.lat || "",
  lng: resort.lng || "",
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

  // ============================
  // Input change
  // ============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================
  // Шинэ зураг
  // ============================
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    const preview = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...preview]);
  };

  // ============================
  // Шинэ бичлэг
  // ============================
  const handleNewVideos = (e) => {
    const files = Array.from(e.target.files);
    setNewVideos((prev) => [...prev, ...files]);

    const preview = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...preview]);
  };

  // ============================
  // Remove old media
  // ============================
  const removeExistingImage = (i) => {
    setRemovedImages((prev) => [...prev, existingImages[i]]);
    setExistingImages(existingImages.filter((_, idx) => idx !== i));
  };

  const removeExistingVideo = (i) => {
    setRemovedVideos((prev) => [...prev, existingVideos[i]]);
    setExistingVideos(existingVideos.filter((_, idx) => idx !== i));
  };

  // ============================
  // Remove new media
  // ============================
  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, idx) => idx !== i));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
  };

  const removeNewVideo = (i) => {
    setNewVideos(newVideos.filter((_, idx) => idx !== i));
    setVideoPreviews(videoPreviews.filter((_, idx) => idx !== i));
  };

  // ============================
  // Submit
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 1. Cloudinary руу upload
      const uploadedImages = [];
      for (let img of newImages) {
        const url = await uploadToCloudinary(img);
        uploadedImages.push(url);
      }

      const uploadedVideos = [];
      for (let vid of newVideos) {
        const url = await uploadToCloudinary(vid);
        uploadedVideos.push(url);
      }

      // 🔥 2. Backend рүү зөвхөн URL илгээнэ
      const payload = {
        ...form,
        newImages: uploadedImages,
        newVideos: uploadedVideos,
        removedImages,
        removedVideos,
      };

      await axios.put(`${API_BASE}/api/admin/resorts/edit/${id}`, payload);

      alert("Амжилттай шинэчлэв 🎉");
      navigate("/resorts");
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UI
  // ============================
  if (initializing) return <p>Түр хүлээнэ үү...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Амралтын газар засах</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">

        {/* TEXT FIELDS */}
        <input type="text" name="name" value={form.name} onChange={handleChange} className="border w-full p-2 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border w-full p-2 rounded" />
        <input type="number" name="phone" value={form.price} onChange={handleChange} className="border w-full p-2 rounded" />
        <input type="number" name="price" value={form.price} onChange={handleChange} className="border w-full p-2 rounded" />
        <input type="text" name="location" value={form.location} onChange={handleChange} className="border w-full p-2 rounded" />
        <input type="text" name="lng" value={form.lng} onChange={handleChange} className="border w-full p-2 rounded" />
        <input type="text" name="lat" value={form.lat} onChange={handleChange} className="border w-full p-2 rounded" />
        
        {/* EXISTING IMAGES */}
        <h3 className="font-medium">Одоо байгаа зургууд</h3>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="w-24 h-24 object-cover rounded" />
              <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded text-xs">✕</button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <h3 className="font-medium">Шинэ зургууд</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />
        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="w-24 h-24 object-cover rounded" />
              <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded text-xs">✕</button>
            </div>
          ))}
        </div>

        {/* EXISTING VIDEOS */}
        <h3 className="font-medium">Одоо байгаа бичлэгүүд</h3>
        <div className="flex flex-wrap gap-2">
          {existingVideos.map((vid, i) => (
            <div key={i} className="relative">
              <video src={vid} width="120" controls className="rounded" />
              <button type="button" onClick={() => removeExistingVideo(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded text-xs">✕</button>
            </div>
          ))}
        </div>

        {/* NEW VIDEOS */}
        <h3 className="font-medium">Шинэ бичлэгүүд</h3>
        <input type="file" multiple accept="video/*" onChange={handleNewVideos} />
        <div className="flex flex-wrap gap-2 mt-2">
          {videoPreviews.map((url, i) => (
            <div key={i} className="relative">
              <video src={url} width="120" controls className="rounded" />
              <button type="button" onClick={() => removeNewVideo(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded text-xs">✕</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Хадгалж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}

export default EditResort;
