import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

import { supabase } from "@/integrations/supabase/client";
import { resolveProductSlug } from "./productResolver";

const rpc = supabase.rpc as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  rpc.mockReset();
});

describe("resolveProductSlug", () => {
  it("returns null for empty slug", async () => {
    expect(await resolveProductSlug("")).toBeNull();
    expect(rpc).not.toHaveBeenCalled();
  });

  it("classifies primary correctly", async () => {
    rpc.mockResolvedValue({
      data: [{ product_id: "p1", matched_slug: "abc", primary_slug: "abc", is_primary: true, is_active: true, source: "legacy" }],
      error: null,
    });
    const r = await resolveProductSlug("abc");
    expect(r?.resolvedVia).toBe("primary");
    expect(r?.shouldRedirect).toBe(false);
  });

  it("classifies historical (legacy/rename) as historical", async () => {
    rpc.mockResolvedValue({
      data: [{ product_id: "p1", matched_slug: "old", primary_slug: "new", is_primary: false, is_active: true, source: "rename" }],
      error: null,
    });
    const r = await resolveProductSlug("old");
    expect(r?.resolvedVia).toBe("historical");
    expect(r?.shouldRedirect).toBe(true);
  });

  it("classifies manual alias as alias", async () => {
    rpc.mockResolvedValue({
      data: [{ product_id: "p1", matched_slug: "promo", primary_slug: "real", is_primary: false, is_active: true, source: "manual" }],
      error: null,
    });
    const r = await resolveProductSlug("promo");
    expect(r?.resolvedVia).toBe("alias");
  });

  it("returns null when inactive (404 contract)", async () => {
    rpc.mockResolvedValue({
      data: [{ product_id: "p1", matched_slug: "old", primary_slug: "new", is_primary: false, is_active: false, source: "rename" }],
      error: null,
    });
    expect(await resolveProductSlug("old")).toBeNull();
  });

  it("returns null when unknown", async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    expect(await resolveProductSlug("ghost")).toBeNull();
  });
});
