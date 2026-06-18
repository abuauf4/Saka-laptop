"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * Reusable image upload component.
 * - Upload file directly via /api/media/upload
 * - Also allows manual URL input
 * - Returns data URL or external URL via onChange
 */
export function ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "Homepage",
  className = "",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File maksimal 2MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("altText", label);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload gagal");
      }

      const data = await res.json();
      onChange(data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
      toast.success("URL set");
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border/50 bg-muted/30">
          <img
            src={value}
            alt={label}
            className="w-full h-32 object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload buttons */}
      <div className="flex gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="gap-1.5 flex-1"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Upload
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="gap-1.5"
        >
          <Link2 className="h-3.5 w-3.5" />
          URL
        </Button>
      </div>

      {/* URL input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlSubmit}
            className="shrink-0"
          >
            Set
          </Button>
        </div>
      )}
    </div>
  );
}
