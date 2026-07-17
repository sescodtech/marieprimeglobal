"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type ActivePopup = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imageUrl: string | null;
  bgColor: string;
  textColor: string;
  triggerRule: string;
  triggerValue: number;
};

function track(id: string, event: "view" | "click" | "close") {
  void fetch(`/api/popups/${id}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  }).catch(() => {});
}

function alreadyShown(id: string): boolean {
  try {
    return sessionStorage.getItem(`mpg_popup_shown_${id}`) === "1";
  } catch {
    return false;
  }
}

function markShown(id: string) {
  try {
    sessionStorage.setItem(`mpg_popup_shown_${id}`, "1");
  } catch {
    /* storage unavailable — non-fatal, popup may just show again */
  }
}

export function PopupManager() {
  const pathname = usePathname();
  const [visible, setVisible] = useState<ActivePopup | null>(null);

  const showPopup = useCallback((popup: ActivePopup) => {
    if (alreadyShown(popup.id)) return;
    setVisible((current) => {
      if (current) return current; // one at a time
      track(popup.id, "view");
      markShown(popup.id);
      return popup;
    });
  }, []);

  useEffect(() => {
    // Skip the admin dashboard entirely — popups are a public-site feature.
    if (pathname?.startsWith("/admin")) return;

    let cancelled = false;
    const cleanupFns: (() => void)[] = [];

    fetch(`/api/popups/active?path=${encodeURIComponent(pathname || "/")}`)
      .then((res) => res.json())
      .then((data: { popups: ActivePopup[] }) => {
        if (cancelled) return;
        for (const popup of data.popups) {
          if (alreadyShown(popup.id)) continue;

          switch (popup.triggerRule) {
            case "AFTER_SECONDS": {
              const timer = setTimeout(() => showPopup(popup), Math.max(popup.triggerValue, 0) * 1000);
              cleanupFns.push(() => clearTimeout(timer));
              break;
            }
            case "AFTER_SCROLL_PERCENT": {
              const handler = () => {
                const scrolled =
                  (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)) * 100;
                if (scrolled >= popup.triggerValue) {
                  showPopup(popup);
                  window.removeEventListener("scroll", handler);
                }
              };
              window.addEventListener("scroll", handler, { passive: true });
              cleanupFns.push(() => window.removeEventListener("scroll", handler));
              break;
            }
            case "EXIT_INTENT": {
              const handler = (e: MouseEvent) => {
                if (e.clientY <= 0) showPopup(popup);
              };
              document.addEventListener("mouseleave", handler);
              cleanupFns.push(() => document.removeEventListener("mouseleave", handler));
              break;
            }
            case "FIRST_VISIT": {
              let hasVisited = false;
              try {
                hasVisited = localStorage.getItem("mpg_has_visited") === "1";
                localStorage.setItem("mpg_has_visited", "1");
              } catch {
                /* ignore */
              }
              if (!hasVisited) showPopup(popup);
              break;
            }
            case "ONCE_PER_SESSION":
            case "ALWAYS":
            default:
              showPopup(popup);
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, [pathname, showPopup]);

  if (!visible) return null;

  function handleClose() {
    if (!visible) return;
    track(visible.id, "close");
    setVisible(null);
  }

  function handleButtonClick() {
    if (!visible) return;
    track(visible.id, "click");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-stub shadow-2xl"
        style={{ backgroundColor: visible.bgColor, color: visible.textColor }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/20 p-1.5 hover:bg-black/30"
          aria-label="Close"
        >
          <X size={16} color={visible.textColor} />
        </button>
        {visible.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={visible.imageUrl} alt="" className="h-40 w-full object-cover" />
        )}
        <div className="p-6 sm:p-8">
          {visible.subtitle && (
            <p className="font-mono text-xs uppercase tracking-wider opacity-75">{visible.subtitle}</p>
          )}
          <h2 className="mt-2 font-display text-2xl font-semibold">{visible.title}</h2>
          {visible.description && <p className="mt-3 text-sm leading-relaxed opacity-90">{visible.description}</p>}
          {visible.buttonText && visible.buttonLink && (
            <a
              href={visible.buttonLink}
              onClick={handleButtonClick}
              className="mt-6 inline-flex items-center justify-center rounded-stub bg-white/95 px-6 py-2.5 text-sm font-semibold text-forest-900 hover:bg-white"
            >
              {visible.buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
