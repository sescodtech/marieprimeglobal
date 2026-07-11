"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

const serviceOptions = [
  { value: "FLIGHT_BOOKING", label: "Flight Booking & Travel Solutions" },
  { value: "VISA_IMMIGRATION", label: "Visa & Immigration Assistance" },
  { value: "TRAVEL_LOAN", label: "Travel Loan Assistance" },
  { value: "STUDY_ABROAD", label: "Study Abroad Support" },
  { value: "BUSINESS_REGISTRATION", label: "Business Registration Services" },
  { value: "GENERAL_ENQUIRY", label: "General Enquiry" },
];

// Maps a Service CMS slug (e.g. from ?service=visa-travel-assistance) to the
// closest matching enquiry category, so arriving from a service page
// auto-selects the right option instead of always defaulting to General.
const SLUG_TO_SERVICE_INTEREST: Record<string, string> = {
  "visa-travel-assistance": "VISA_IMMIGRATION",
  "flight-booking": "FLIGHT_BOOKING",
};

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  serviceInterest: z.string(),
  subject: z.string().min(2, "Give your enquiry a short subject"),
  message: z.string().min(10, "Tell us a little more about what you need"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const defaultServiceInterest = (serviceSlug && SLUG_TO_SERVICE_INTEREST[serviceSlug]) || "GENERAL_ENQUIRY";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serviceInterest: defaultServiceInterest },
  });

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-stub bg-forest-700/5 p-10 text-center">
        <CheckCircle2 size={36} className="text-forest-700" />
        <h3 className="mt-4 font-display text-xl font-semibold text-forest-900">
          Enquiry received
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          A MariePrime representative will respond within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs font-semibold uppercase tracking-wider text-forest-700 underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <input {...register("fullName")} className="input" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" placeholder="you@email.com" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone number" error={errors.phone?.message}>
          <input {...register("phone")} type="tel" className="input" placeholder="+234 800 000 0000" />
        </Field>
        <Field label="Service of interest">
          <select {...register("serviceInterest")} className="input">
            {serviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Subject" error={errors.subject?.message}>
        <input {...register("subject")} className="input" placeholder="e.g. Visa documents for UK trip" />
      </Field>

      <Field label="Your message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="input resize-none"
          placeholder="Tell us what you're trying to get done and any relevant dates."
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-stub bg-forest-700 px-7 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending your enquiry. Please try again or reach us on WhatsApp.
        </p>
      )}
    </form>
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
