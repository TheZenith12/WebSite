export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const presetName = import.meta.env.VITE_UPLOAD_PRESET;

  if (!cloudName || !presetName) {
    throw new Error("❌ Cloudinary config (cloud name / preset) is missing.");
  }

  // Видео эсэхийг шалгах
  const isVideo = file.type.startsWith("video/");

  // Image эсвэл Video upload endpoint
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetName);

  // Folder ялгах
  formData.append("folder", isVideo ? "resorts/videos" : "resorts/images");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // Алдаа барих
  if (data.error) {
    console.error("Cloudinary upload error:", data.error.message);
    throw new Error(data.error.message);
  }

  return data.secure_url;
};
