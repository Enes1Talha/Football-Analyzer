// Re-encode a small, metadata-free JPEG; never store the original upload.
export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("JPG, PNG veya WebP fotoğraf seç.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Fotoğraf en fazla 5 MB olabilir.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Fotoğraf bu tarayıcıda işlenemedi.");
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 256, 256);
    ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
    const result = canvas.toDataURL("image/jpeg", 0.85);
    if (result.length > 180000) throw new Error("Fotoğraf çok büyük. Daha sade bir fotoğraf seç.");
    return result;
  } catch (error) {
    if (error instanceof Error && error.name !== "EncodingError") throw error;
    throw new Error("Fotoğraf açılamadı. Başka bir dosya seç.");
  } finally { URL.revokeObjectURL(url); }
}
