import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

  try {
    const { name, email, whatsapp, product, occasion, quantity, message, type }: OrderEmailRequest = await req.json();

    console.log("Received order request:", { name, email, whatsapp, product, occasion, type });

    const subject = type === "product" 
      ? `🎁 Novo Pedido de Produto - ${product}` 
      : `💬 Nova Solicitação de Orçamento - ${occasion || "Geral"}`;

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
          .value { color: #333; font-size: 16px; padding: 12px; background: #f8f8f8; border-radius: 8px; }
          .footer { background: #fdf8f7; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .cta { display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Empório LeleCute</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">${subject}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nome</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">WhatsApp</div>
              <div class="value">${whatsapp}</div>
            </div>
            ${product ? `
            <div class="field">
              <div class="label">Produto</div>
              <div class="value">${product}</div>
            </div>
            ` : ""}
            ${occasion ? `
            <div class="field">
              <div class="label">Ocasião</div>
              <div class="value">${occasion}</div>
            </div>
            ` : ""}
            ${quantity ? `
            <div class="field">
              <div class="label">Quantidade</div>
              <div class="value">${quantity}</div>
            </div>
            ` : ""}
            ${message ? `
            <div class="field">
              <div class="label">Mensagem</div>
              <div class="value">${message}</div>
            </div>
            ` : ""}
            <center>
              <a href="https://wa.me/55${whatsapp.replace(/\D/g, '')}" class="cta">📱 Responder via WhatsApp</a>
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
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
