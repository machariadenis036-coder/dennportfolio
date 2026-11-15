import { describe, expect, it } from "vitest";
import { contactSchema, toWhatsAppDigits, WHATSAPP_GREETING, whatsappLink } from "./contact";

describe("WhatsApp number", () => {
  it("converts the local number 0117244681 to 254117244681", () => {
    expect(toWhatsAppDigits("0117244681")).toBe("254117244681");
  });
  it("keeps a number already stored with the 254 country code, digits only", () => {
    expect(toWhatsAppDigits("254117244681")).toBe("254117244681");
    expect(toWhatsAppDigits("+254 117-244-681")).toBe("254117244681");
  });
  it("builds a wa.me link with encoded text", () => {
    expect(whatsappLink("0117244681", "Hi Denis")).toBe("https://wa.me/254117244681?text=Hi%20Denis");
  });
  it("defaults to the official click-to-chat URL with the professional greeting", () => {
    expect(whatsappLink("254117244681")).toBe(
      "https://wa.me/254117244681?text=Hello%2C%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20get%20in%20touch%20with%20you.",
    );
  });
  it("never points at api.whatsapp.com and never embeds a frame", () => {
    const url = whatsappLink("0117244681");
    expect(url.startsWith("https://wa.me/254117244681")).toBe(true);
    expect(url).not.toContain("api.whatsapp.com");
    expect(WHATSAPP_GREETING).toBe(
      "Hello, I visited your portfolio website and would like to get in touch with you.",
    );
  });
});

describe("Contact form rules", () => {
  const valid = { name: "Jane", email: "jane@example.com", subject: "Hello", message: "I would like to work with you." };
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("rejects messages over 2000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });
  it("rejects submissions where the hidden spam field is filled", () => {
    expect(contactSchema.safeParse({ ...valid, website: "spam.com" }).success).toBe(false);
  });
});
