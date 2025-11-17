export async function uploadToCloudinary(file) {
  const cloudName = "dl9bp4ja3";
  const presetName = "resort_unsigned";

  // Видео эсэхийг шалгах
  const isVideo = file.type.startsWith("video/");
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetName);
  formData.append("folder", isVideo ? "resorts/videos" : "resorts/images");

  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();

  if (data.error) {
    console.error("Cloudinary upload error:", data.error);
    throw new Error(data.error.message);
  }

  return data.secure_url;
}
