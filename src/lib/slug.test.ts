import { describe, it, expect } from "vitest";
import { normalizeSlug, isReservedSlug, isUsableSlug } from "./slug";

describe("normalizeSlug", () => {
  it("lowercases and trims", () => {
    expect(normalizeSlug("  HELLO  ")).toBe("hello");
  });
  it("removes diacritics", () => {
    expect(normalizeSlug("coração")).toBe("coracao");
    expect(normalizeSlug("Lá-lá")).toBe("la-la");
    expect(normalizeSlug("São João")).toBe("sao-joao");
  });
  it("replaces non-alphanumeric with dashes", () => {
    expect(normalizeSlug("ácido//base")).toBe("acido-base");
    expect(normalizeSlug("a_b c.d")).toBe("a-b-c-d");
  });
  it("collapses repeated dashes and trims them", () => {
    expect(normalizeSlug("--foo----bar--")).toBe("foo-bar");
  });
  it("handles empty / nullish input", () => {
    expect(normalizeSlug("")).toBe("");
    expect(normalizeSlug(null)).toBe("");
    expect(normalizeSlug(undefined)).toBe("");
  });
  it("is idempotent", () => {
    const once = normalizeSlug("Coração-De-Ouro!!");
    expect(normalizeSlug(once)).toBe(once);
  });
});

describe("isReservedSlug", () => {
  it("flags reserved words", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("PRODUTO")).toBe(true);
    expect(isReservedSlug("checkout")).toBe(true);
  });
  it("ignores non-reserved", () => {
    expect(isReservedSlug("vela-perfumada")).toBe(false);
  });
  it("normalizes before checking", () => {
    expect(isReservedSlug("  Admin  ")).toBe(true);
  });
  it("empty is not reserved", () => {
    expect(isReservedSlug("")).toBe(false);
  });
});

describe("isUsableSlug", () => {
  it("accepts a clean slug", () => {
    expect(isUsableSlug("vela-de-soja")).toBe(true);
  });
  it("rejects empty", () => {
    expect(isUsableSlug("")).toBe(false);
    expect(isUsableSlug("   ")).toBe(false);
  });
  it("rejects reserved", () => {
    expect(isUsableSlug("login")).toBe(false);
  });
});
