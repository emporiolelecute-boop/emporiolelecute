import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_subtotal: number;
  valid_from: string | null;
  valid_until: string | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
}

export interface ValidCoupon {
  valid: true;
  coupon_id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  discount_applied: number;
  description: string | null;
}

export interface InvalidCoupon {
  valid: false;
  error: string;
}

export const useCoupons = () =>
  useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
  });

export const useUpsertCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Partial<Coupon> & { code: string }) => {
      const payload = { ...c, code: c.code.toUpperCase().trim() };
      if (c.id) {
        const { error } = await supabase.from("coupons").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("coupons").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const validateCoupon = async (
  code: string,
  subtotal: number
): Promise<ValidCoupon | InvalidCoupon> => {
  const { data, error } = await supabase.rpc("validate_coupon", {
    _code: code,
    _subtotal: subtotal,
  });
  if (error) return { valid: false, error: error.message };
  return data as unknown as ValidCoupon | InvalidCoupon;
};
