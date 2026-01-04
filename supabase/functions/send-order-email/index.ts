import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: track requests per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max requests per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// HTML escape function to prevent XSS/injection
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Input validation
function validateInput(data: any): { valid: boolean; error?: string } {
  const { name, email, whatsapp, product, occasion, quantity, message, type } = data;
  
  // Required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Nome é obrigatório' };
  }
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }
  if (!whatsapp || typeof whatsapp !== 'string') {
    return { valid: false, error: 'WhatsApp é obrigatório' };
  }
  if (!type || (type !== 'product' && type !== 'quote')) {
    return { valid: false, error: 'Tipo de solicitação inválido' };
  }
  
  // Length limits
  if (name.length > 100) {
    return { valid: false, error: 'Nome muito longo (máximo 100 caracteres)' };
  }
  if (email.length > 255) {
    return { valid: false, error: 'Email muito longo (máximo 255 caracteres)' };
  }
  if (whatsapp.length > 30) {
    return { valid: false, error: 'WhatsApp muito longo (máximo 30 caracteres)' };
  }
  if (message && message.length > 2000) {
    return { valid: false, error: 'Mensagem muito longa (máximo 2000 caracteres)' };
  }
  if (product && product.length > 200) {
    return { valid: false, error: 'Nome do produto muito longo' };
  }
  if (occasion && occasion.length > 100) {
    return { valid: false, error: 'Ocasião muito longa' };
  }
  if (quantity && quantity.length > 20) {
    return { valid: false, error: 'Quantidade muito longa' };
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Formato de email inválido' };
  }
  
  // WhatsApp format validation (only numbers, spaces, parentheses, hyphens, plus)
  const whatsappRegex = /^[\d\s()+-]+$/;
  if (!whatsappRegex.test(whatsapp)) {
    return { valid: false, error: 'Formato de WhatsApp inválido' };
  }
  
  return { valid: true };
}

interface OrderEmailRequest {
  name: string;
  email: string;
  whatsapp: string;
  product?: string;
  occasion?: string;
  quantity?: string;
  message?: string;
  type: "product" | "quote";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";
  
  // Check rate limit
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ success: false, error: "Muitas solicitações. Tente novamente mais tarde." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const requestData = await req.json();
    
    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.warn(`Invalid input from ${clientIP}: ${validation.error}`);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, whatsapp, product, occasion, quantity, message, type }: OrderEmailRequest = requestData;

    // Sanitize all inputs
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeWhatsapp = escapeHtml(whatsapp);
    const safeProduct = escapeHtml(product);
    const safeOccasion = escapeHtml(occasion);
    const safeQuantity = escapeHtml(quantity);
    const safeMessage = escapeHtml(message);

    console.log("Received order request:", { 
      ip: clientIP,
      type, 
      hasProduct: !!product, 
      hasOccasion: !!occasion 
    });

    const subject = type === "product" 
      ? `🎁 Novo Pedido de Produto - ${safeProduct}` 
      : `💬 Nova Solicitação de Orçamento - ${safeOccasion || "Geral"}`;

    // Sanitize WhatsApp number for URL (only digits)
    const sanitizedWhatsappNumber = whatsapp.replace(/\D/g, '');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Nunito', Arial, sans-serif; background: #fdf8f7; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #f88770 0%, #e66753 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .value { color: #333; font-size: 16px; padding: 12px; background: #f8f8f8; border-radius: 8px; word-break: break-word; }
          .footer { background: #fdf8f7; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .cta { display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Empório LeleCute</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">${escapeHtml(subject)}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nome</div>
              <div class="value">${safeName}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${safeEmail}</div>
            </div>
            <div class="field">
              <div class="label">WhatsApp</div>
              <div class="value">${safeWhatsapp}</div>
            </div>
            ${safeProduct ? `
            <div class="field">
              <div class="label">Produto</div>
              <div class="value">${safeProduct}</div>
            </div>
            ` : ""}
            ${safeOccasion ? `
            <div class="field">
              <div class="label">Ocasião</div>
              <div class="value">${safeOccasion}</div>
            </div>
            ` : ""}
            ${safeQuantity ? `
            <div class="field">
              <div class="label">Quantidade</div>
              <div class="value">${safeQuantity}</div>
            </div>
            ` : ""}
            ${safeMessage ? `
            <div class="field">
              <div class="label">Mensagem</div>
              <div class="value">${safeMessage}</div>
            </div>
            ` : ""}
            <center>
              <a href="https://wa.me/55${sanitizedWhatsappNumber}" class="cta">📱 Responder via WhatsApp</a>
            </center>
          </div>
          <div class="footer">
            <p>Este email foi enviado automaticamente pelo site Empório LeleCute</p>
            <p>© ${new Date().getFullYear()} Empório LeleCute - Ateliê Criativo</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Empório LeleCute <onboarding@resend.dev>",
      to: ["emporiolelecute@gmail.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao processar solicitação" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
