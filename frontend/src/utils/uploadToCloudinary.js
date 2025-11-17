export async function uploadToCloudinary(file, preset, folder) {
  const url = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", folder);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; // CLOUDINARY URL
}
