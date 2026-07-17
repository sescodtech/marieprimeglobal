"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Megaphone } from "lucide-react";

type ActiveAnnouncement = {
  id: string;
  title: string;
  message: string;
  icon: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  bgColor: string;
  textColor: string;
};

const DISMISSED_KEY = "mpg_dismissed_announcements";

function getDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

function dismiss(id: string) {
  try {
    const current = getDismissed();
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, id]));
  } catch {
    /* non-fatal */
  }
}

export function AnnouncementBar() {
  const pathname = usePathname();
  const [announcements, setAnnouncements] = useState<ActiveAnnouncement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    fetch(`/api/announcements/active?path=${encodeURIComponent(pathname || "/")}`)
      .then((res) => res.json())
      .then((data: { announcements: ActiveAnnouncement[] }) => {
        const dismissed = getDismissed();
        setAnnouncements(data.announcements.filter((a) => !dismissed.includes(a.id)));
        setIndex(0);
      })
      .catch(() => {});
  }, [pathname]);

  // Rotate through multiple active announcements every 6 seconds.
  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (pathname?.startsWith("/admin") || announcements.length === 0) return null;

  const current = announcements[index];

  function handleDismiss() {
    dismiss(current.id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== current.id));
    setIndex(0);
  }

  return (
    <div
      className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-center text-sm"
      style={{ backgroundColor: current.bgColor, color: current.textColor }}
    >
      <Megaphone size={15} className="hidden shrink-0 sm:block" />
      <p className="min-w-0">
        <span className="font-semibold">{current.title}</span>
        {current.message && <span className="ml-1.5 opacity-90">{current.message}</span>}
        {current.buttonText && current.buttonLink && (
          <a href={current.buttonLink} className="ml-2 underline underline-offset-2">
            {current.buttonText}
          </a>
        )}
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-black/10"
        aria-label="Dismiss"
      >
        <X size={14} color={current.textColor} />
      </button>
    </div>
  );
}
