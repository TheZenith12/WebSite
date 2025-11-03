import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import places from "../data/Places.js";

export default function Details() {
  const { id } = useParams();
  const place = places.find((p) => p.id === Number(id));
  const [currentImg, setCurrentImg] = useState(place ? place.img : "");

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-lg text-center p-8 bg-white/80 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">Газрын мэдээлэл олдсонгүй</h2>
          <Link to="/" className="text-blue-600  underline mt-4 block">
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Image */}
      <div className="w-full h-96 relative overflow-hidden">
        <img
          src={currentImg}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-4 left-4 bg-white/70 px-3 py-1 rounded font-medium">
          {place.name}
        </span>
        <Link
          to="/"
          className="absolute top-4 left-4 text-white/90 color-red-600 font-medium bg-black/30 px-3 py-1 rounded hover:bg-black/50 transition"
        >
          ← Буцах
        </Link>
      </div>

      {/* Main Content + Gallery */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Info */}
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2">{place.name}</h1>
          <p className="text-gray-700 mb-4">{place.long}</p>

          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">Үйлчилгээ</h3>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>Тохилог байр</li>
              <li>Хоол үйлчилгээ</li>
              <li>Гэр бүл-д ээлтэй</li>
            </ul>
          </div>
        </div>

        {/* Horizontal Thumbnails */}
        <div className="flex-1 overflow-x-auto flex space-x-4 py-2">
          {places.map((p) => (
            <img
              key={p.id}
              src={p.img}
              alt={p.name}
              className="w-48 h-32 object-cover rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setCurrentImg(p.img)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
