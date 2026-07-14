"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { replaceMediaAsset } from "@/lib/actions/media";

export function ReplaceMediaButton({ assetId }: { assetId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      startTransition(async () => {
        await replaceMediaAsset(assetId);
        router.refresh();
      });
    } catch {
      // Non-fatal — the user can just try again.
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || isPending}
        className="text-forest-700 hover:text-forest-900 disabled:opacity-60"
        aria-label="Replace"
        title="Replace"
      >
        {uploading || isPending ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
      </button>
    </>
  );
}
