"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, User } from "lucide-react";
import { updateProfilePicture } from "@/lib/actions/account";

export function AvatarUploader({ currentAvatarUrl }: { currentAvatarUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", "Profile picture");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Upload failed.");
      setAvatarUrl(body.asset.url);
      startTransition(() => updateProfilePicture(body.asset.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-forest-700/10">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile picture" className="h-full w-full object-cover" />
        ) : (
          <User size={26} className="text-forest-700" />
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || isPending}
          className="rounded-stub border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-700 hover:border-forest-700 disabled:opacity-60"
        >
          {uploading || isPending ? <Loader2 size={13} className="inline animate-spin" /> : "Change photo"}
        </button>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
