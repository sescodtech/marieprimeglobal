"use client";

import { useRef } from "react";
import { FileText, Loader2, Trash2, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";
import type { DocumentFieldConfig } from "@/lib/applicationForms/types";

export type DocFieldState = {
  status: "empty" | "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
  url?: string;
  publicId?: string;
  mimeType?: string;
  fileName?: string;
};

export const EMPTY_DOC_STATE: DocFieldState = { status: "empty", progress: 0 };

const DEFAULT_MAX_SIZE_BYTES = 8 * 1024 * 1024;

function uploadFile(
  file: File,
  extra: { serviceType: string; docKey: string },
  onProgress: (pct: number) => void
): Promise<{ url: string; publicId: string; mimeType: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/applications/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Unexpected response from the server."));
        }
      } else {
        try {
          reject(new Error(JSON.parse(xhr.responseText).error || "Upload failed."));
        } catch {
          reject(new Error("Upload failed."));
        }
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("serviceType", extra.serviceType);
    formData.append("docKey", extra.docKey);
    xhr.send(formData);
  });
}

function deleteFile(publicId: string, mimeType?: string) {
  void fetch("/api/applications/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, resourceType: mimeType === "application/pdf" ? "raw" : "image" }),
  }).catch(() => {
    /* best-effort cleanup — nothing to do if it fails */
  });
}

export function DocumentUploadField({
  config,
  serviceType,
  value,
  onChange,
}: {
  config: DocumentFieldConfig;
  serviceType: string;
  value: DocFieldState;
  onChange: (next: DocFieldState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = config.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;

  async function handleFile(file: File) {
    if (file.size > maxSizeBytes) {
      onChange({ status: "error", progress: 0, error: `File must be under ${Math.round(maxSizeBytes / (1024 * 1024))}MB.` });
      return;
    }

    // Replacing an existing upload — clean up the old asset (best-effort,
    // non-blocking) before starting the new one.
    if (value.status === "uploaded" && value.publicId) {
      deleteFile(value.publicId, value.mimeType);
    }

    onChange({ status: "uploading", progress: 0 });
    try {
      const result = await uploadFile(file, { serviceType, docKey: config.id }, (progress) =>
        onChange({ status: "uploading", progress })
      );
      onChange({ status: "uploaded", progress: 100, ...result });
    } catch (error) {
      onChange({
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed.",
      });
    }
  }

  function handleDelete() {
    if (value.status === "uploaded" && value.publicId) {
      deleteFile(value.publicId, value.mimeType);
    }
    onChange(EMPTY_DOC_STATE);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isImage = value.mimeType?.startsWith("image/");

  return (
    <div>
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </span>
      {config.helpText && <p className="mb-2 text-xs text-ink-500">{config.helpText}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {value.status === "empty" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-stub border border-dashed border-forest-700/30 bg-cream-100 px-4 py-6 text-sm text-ink-500 transition-colors hover:border-forest-700 hover:text-forest-700"
        >
          <UploadCloud size={18} />
          Click to upload
        </button>
      )}

      {value.status === "uploading" && (
        <div className="rounded-stub border border-forest-700/20 bg-cream-100 px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Loader2 size={16} className="animate-spin text-forest-700" />
            Uploading… {value.progress}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest-900/10">
            <div
              className="h-full rounded-full bg-forest-700 transition-all"
              style={{ width: `${value.progress}%` }}
            />
          </div>
        </div>
      )}

      {value.status === "error" && (
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-stub border border-dashed border-red-400 bg-red-50 px-4 py-6 text-sm text-red-600 transition-colors hover:border-red-500"
          >
            <AlertCircle size={18} />
            {value.error ?? "Upload failed"} — click to try again
          </button>
        </div>
      )}

      {value.status === "uploaded" && (
        <div className="flex items-center gap-3 rounded-stub border border-forest-700/20 bg-cream-100 p-3">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt={config.label} className="h-14 w-14 rounded-md object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-forest-700/10">
              <FileText size={22} className="text-forest-700" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-medium text-forest-900">
              <CheckCircle2 size={14} className="shrink-0 text-forest-700" />
              <span className="truncate">{value.fileName ?? "Uploaded"}</span>
            </div>
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-500 underline underline-offset-2 hover:text-forest-700"
            >
              Preview
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-medium text-forest-700 hover:underline"
            >
              Replace
            </button>
            <button type="button" onClick={handleDelete} className="text-red-500 hover:text-red-700" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
