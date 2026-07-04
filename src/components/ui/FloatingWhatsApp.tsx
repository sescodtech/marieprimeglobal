"use client";

import { motion, useReducedMotion } from "framer-motion";

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" width={26} height={26} fill="currentColor" aria-hidden>
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.15 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z" />
    <path d="M12 2.5A9.5 9.5 0 0 0 3.6 17l-1.1 4.5 4.6-1.2A9.5 9.5 0 1 0 12 2.5zm0 17.2c-1.55 0-3.03-.42-4.3-1.2l-.31-.18-3.06.8.81-2.98-.2-.32A7.7 7.7 0 1 1 12 19.7z" />
  </svg>
);

export function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  const reduceMotion = useReducedMotion();

  if (!whatsapp) return null;

  return (
    <motion.a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MariePrime Global Services on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] sm:bottom-7 sm:right-7"
    >
      {!reduceMotion && (
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40"
          style={{ animationDuration: "2.4s" }}
        />
      )}
      <span className="relative">
        <WhatsAppGlyph />
      </span>
    </motion.a>
  );
}
