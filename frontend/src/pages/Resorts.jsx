import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

function Resorts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageViews, setPageViews] = useState(0);

  // 🔹 Resort жагсаалт авах
  async function fetchResorts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Серверээс алдаа ирлээ: " + res.status);
      }

      const data = await res.json();

      const resorts = (data.resorts || data).map((r) => {
        const imgs = r.images || [];
        const imgSrc = imgs.length > 0 ? imgs[0] : "";
        const fullImg = imgSrc
          ? /^https?:\/\//i.test(imgSrc)
            ? imgSrc
            : `${API_BASE}/${imgSrc.replace(/^\/+/, "")}`
          : "https://via.placeholder.com/600x400?text=No+Image";

        return {
          ...r,
          image: fullImg,
          rating: r.rating || (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
          visitors: r.visitors || Math.floor(Math.random() * 2000) + 500,
          location: r.location || "Монгол",
        };
      });
      setList(resorts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Resort устгах
  async function removeResort(id) {
    console.log("Deleting ID:", id);
    if (!confirm("Та энэ амралтын газрыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/resorts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resort");
      setList(list.filter((resort) => resort._id !== id));
      
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🏕 Амралтын газрууд</h2>
        <Link
          to="/resorts/new"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Resort
        </Link>
      </div>

      {loading && <div>Loading resorts...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="space-y-3">
        {list.map((resort) => (
          <div
            key={resort._id}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-start"
          >
            <div className="flex gap-4">
              <img
                 src={resort.image}
                 alt={resort.name}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />

              <div>
                <div className="font-semibold text-lg">{resort.name}</div>
                <div className="text-gray-600 text-sm mb-1">
                  {resort.description || "No description"}
                </div>
                <div className="text-gray-800 text-sm">
                  phone:{resort.phone || " "}
                </div>
                <div className="text-gray-800 text-sm">
                  💰 Үнэ:{" "}
                  <span className="font-semibold">
                    {resort.price ? `${resort.price} ₮` : "—"}
                  </span>
                </div>
                <div className="text-gray-800 text-sm">
                  📍 Байршил: {resort.location || "—"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to={`/resorts/edit/${resort._id}`}
                className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => removeResort(resort._id)}
                className="px-2 py-1 border rounded text-sm text-red-600 hover:bg-red-50"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}


        {!loading && list.length === 0 && (
          <div className="text-gray-500">No resorts found.</div>
        )}
      </div>
    </div>
  );
}

export default Resorts;
