/**
 * Cloudinary helper — server-side upload utilities
 * Used by /api/upload route to upload images to Cloudinary
 *
 * If Cloudinary is not configured, images are stored as base64 in the database (fallback).
 * Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env to enable.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

/** Check if Cloudinary is configured */
export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a base64 image string to Cloudinary
 * @param base64 - Base64 data URL (e.g. "data:image/jpeg;base64,...")
 * @param folder - Cloudinary folder (e.g. "products", "logo", "store")
 * @returns Cloudinary upload result with secure_url
 * If Cloudinary is not configured, returns the original base64 as url
 */
export async function uploadToCloudinary(
  base64: string,
  folder: string = "nauka"
): Promise<CloudinaryUploadResult> {
  // Graceful fallback: if Cloudinary not configured, return base64 as-is
  if (!isCloudinaryConfigured()) {
    console.log("[Cloudinary] Not configured — storing image as base64 in database");
    return {
      secure_url: base64,
      public_id: "",
      width: 0,
      height: 0,
      format: "base64",
    };
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // Generate signature
  const timestamp = Math.round(Date.now() / 1000);
  const signatureStr = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await sha1(signatureStr);

  const formData = new FormData();
  formData.append("file", base64);
  formData.append("folder", folder);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", API_KEY);
  formData.append("signature", signature);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Cloudinary upload error:", errorData);
    throw new Error(errorData.error?.message || "Cloudinary upload failed");
  }

  return response.json();
}

/**
 * Delete an image from Cloudinary by public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return;

  const timestamp = Math.round(Date.now() / 1000);
  const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await sha1(signatureStr);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", API_KEY);
  formData.append("signature", signature);

  const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
  await fetch(destroyUrl, { method: "POST", body: formData });
}

/**
 * Extract public_id from a Cloudinary URL
 * e.g. "https://res.cloudinary.com/demo/image/upload/v123/saka/products/abc123.jpg" → "saka/products/abc123"
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

/**
 * SHA-1 hash function for Cloudinary signature
 */
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}


