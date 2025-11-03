import React, { useEffect, useState } from "react";
import { API_BASE } from "../global";

function Files() {
  const [files, setFiles] = useState([]);

  
  async function fetchFiles() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // --- Upload хийх функц ---
  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE}/api/admin/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const newFile = await res.json();
      setFiles([newFile, ...files]);
    } catch (err) {
      alert(err.message);
    }
  }

  // --- Mount үед файлуудыг татах ---
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-4">
      {/* Толгой хэсэг */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📂 File Manager</h2>
        <label className="px-3 py-1 border rounded cursor-pointer bg-blue-50 hover:bg-blue-100">
          Upload
          <input type="file" className="hidden" onChange={uploadFile} />
        </label>
      </div>

      {/* Файлуудыг харуулах хэсэг */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((f) => {
          // --- URL тодорхойлох ---
          const fileUrl =
            f.url && f.url.startsWith("http")
              ? f.url
              : f.url
              ? `${API_BASE}${f.url}`
              : f.image
              ? `${API_BASE}${f.image}`
              : f.video
              ? `${API_BASE}${f.video}`
              : null;

          // --- Видео эсэхийг шалгах ---
          const isVideo =
            fileUrl &&
            (fileUrl.endsWith(".mp4") ||
              fileUrl.endsWith(".mov") ||
              fileUrl.endsWith(".avi") ||
              fileUrl.endsWith(".webm"));

          return (
            <div
              key={f._id}
              className="bg-white p-2 rounded shadow hover:shadow-lg transition"
            >
              {fileUrl ? (
                isVideo ? (
                  <video
                    src={fileUrl}
                    className="w-full h-40 object-cover rounded"
                    controls
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt={f.filename || "file"}
                    className="w-full h-40 object-cover rounded"
                  />
                )
              ) : (
                <div className="text-gray-500 text-center py-10">
                  ⚠️ File URL not found
                </div>
              )}

              <div className="text-sm text-gray-600 truncate mt-1">
                {f.filename || "Unnamed file"}
              </div>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Open
                </a>
              )}
            </div>
          );
        })}

        {files.length === 0 && (
          <div className="text-gray-500 col-span-full text-center">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
