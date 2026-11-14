import { describe, expect, it } from "vitest";
import { contactSchema, toWhatsAppDigits, whatsappLink } from "./contact";

describe("WhatsApp number", () => {
  it("converts the local number 0117244681 to 254117244681", () => {
    expect(toWhatsAppDigits("0117244681")).toBe("254117244681");
  });
  it("builds a wa.me link with encoded text", () => {
    expect(whatsappLink("0117244681", "Hi Denis")).toBe("https://wa.me/254117244681?text=Hi%20Denis");
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
