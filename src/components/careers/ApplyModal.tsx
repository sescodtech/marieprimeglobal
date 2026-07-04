"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, X, ArrowRight } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  message: z.string().optional(),
  cv: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A CV file is required"),
  coverLetter: z.custom<FileList>().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ApplyModal({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("jobListingId", jobId);
      formData.append("jobTitle", jobTitle);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.message) formData.append("message", data.message);
      formData.append("cv", data.cv[0]);
      if (data.coverLetter?.[0]) formData.append("coverLetter", data.coverLetter[0]);

      const res = await fetch("/api/careers/apply", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  function close() {
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-stub border border-forest-700/30 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 transition-colors hover:border-forest-700 hover:bg-forest-700/5"
      >
        Apply
        <ArrowRight size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/60 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-stub bg-cream-50 p-7 shadow-stub sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest-700">
                    Apply for
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-forest-900">
                    {jobTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="text-ink-500 hover:text-forest-900"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 size={36} className="text-forest-700" />
                  <h4 className="mt-4 font-display text-lg font-semibold text-forest-900">
                    Application received
                  </h4>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                    We'll review your application and reach out if there's a fit.
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 underline underline-offset-4"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.fullName?.message}>
                      <input {...register("fullName")} className="input" placeholder="Jane Doe" />
                    </Field>
                    <Field label="Email" error={errors.email?.message}>
                      <input {...register("email")} type="email" className="input" placeholder="you@email.com" />
                    </Field>
                  </div>

                  <Field label="Phone number" error={errors.phone?.message}>
                    <input {...register("phone")} type="tel" className="input" placeholder="+234 800 000 0000" />
                  </Field>

                  <Field label="CV / résumé (PDF or Word, max 5MB)" error={errors.cv?.message as string}>
                    <input
                      {...register("cv")}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="input file:mr-3 file:rounded-md file:border-0 file:bg-forest-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cream-50"
                    />
                  </Field>

                  <Field label="Cover letter (optional)">
                    <input
                      {...register("coverLetter")}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="input file:mr-3 file:rounded-md file:border-0 file:bg-forest-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cream-50"
                    />
                  </Field>

                  <Field label="Anything else you'd like us to know? (optional)">
                    <textarea {...register("message")} rows={3} className="input resize-none" />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
                  >
                    {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
                    {status === "submitting" ? "Submitting…" : "Submit application"}
                  </button>

                  {status === "error" && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-500">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
