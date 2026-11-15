import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  subject: z.string().trim().min(1, "Please add a subject").max(150, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  // Honeypot: real visitors never fill this hidden field.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Turns a local Kenyan number (07.., 01..) or +254… into wa.me digits. */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

/** Pre-filled greeting used by every WhatsApp click-to-chat link on the site. */
export const WHATSAPP_GREETING =
  "Hello, I visited your portfolio website and would like to get in touch with you.";

/** Official WhatsApp click-to-chat URL: https://wa.me/<country-code digits>?text=... */
export function whatsappLink(phone: string, text: string = WHATSAPP_GREETING): string {
  const base = `https://wa.me/${toWhatsAppDigits(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
