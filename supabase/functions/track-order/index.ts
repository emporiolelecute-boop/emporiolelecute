import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TrackOrderRequest {
  orderCode: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: TrackOrderRequest = await req.json();
    const { orderCode } = body;

    // Validate order code
    if (!orderCode || typeof orderCode !== "string") {
      return new Response(
        JSON.stringify({ error: "Order code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize and normalize order code
    const sanitizedCode = orderCode.trim().toUpperCase();
    
    // Validate order code format (alphanumeric, reasonable length)
    if (!/^[A-Z0-9]{4,20}$/.test(sanitizedCode)) {
      return new Response(
        JSON.stringify({ error: "Invalid order code format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order by code
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_code", sanitizedCode)
      .maybeSingle();

    if (orderError) {
      console.error("Error fetching order:", orderError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found", order: null, items: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("id, product_name, product_slug, product_image, quantity, unit_price, personalization")
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch order items" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return order data - the order code acts as authentication
    // Only someone who knows the order code can retrieve the order details
    return new Response(
      JSON.stringify({
        order: {
          id: order.id,
          order_code: order.order_code,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          address_cep: order.address_cep,
          address_street: order.address_street,
          address_number: order.address_number,
          address_complement: order.address_complement,
          address_neighborhood: order.address_neighborhood,
          address_city: order.address_city,
          address_state: order.address_state,
          shipping_method: order.shipping_method,
          shipping_company: order.shipping_company,
          shipping_days: order.shipping_days,
          shipping_price: order.shipping_price,
          subtotal: order.subtotal,
          total: order.total,
          status: order.status,
          notes: order.notes,
          created_at: order.created_at,
          updated_at: order.updated_at,
          tracking_code: order.tracking_code,
          tracking_carrier: order.tracking_carrier,
          tracking_url: order.tracking_url,
          shipped_at: order.shipped_at,
          payment_status: order.payment_status,
        },
        items: items || [],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Track order error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
