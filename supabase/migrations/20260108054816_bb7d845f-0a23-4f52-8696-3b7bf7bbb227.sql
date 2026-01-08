-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible FAQs
CREATE POLICY "Anyone can view visible FAQs"
ON public.faqs
FOR SELECT
USING (is_visible = true);

-- Admins can manage FAQs
CREATE POLICY "Admins can manage FAQs"
ON public.faqs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, position) VALUES
('Quais são as formas de pagamento?', 'Aceitamos PIX com 7% de desconto e cartão de crédito em até 3x sem juros.', 1),
('Qual é a quantidade mínima de pedido?', 'A quantidade mínima varia de acordo com cada produto e está informada na descrição de cada um.', 2),
('Como funciona o processo de compra?', 'É simples: 1) Escolha o modelo que deseja encomendar, 2) Defina a quantidade e adicione ao carrinho, 3) No carrinho, preencha seus dados e clique em "Finalizar no WhatsApp", 4) Você será direcionado ao WhatsApp para cálculo de frete e pagamento do pedido.', 3),
('Qual é o prazo de produção?', 'O prazo de produção varia de acordo com cada produto e quantidade solicitada. Geralmente trabalhamos com 7 a 15 dias úteis após a confirmação do pagamento.', 4),
('Vocês fazem envio para todo o Brasil?', 'Sim! Enviamos para todo o Brasil através dos Correios ou transportadoras parceiras. O frete é calculado de acordo com o CEP de destino.', 5),
('Posso personalizar os produtos?', 'Sim! A maioria dos nossos produtos aceita personalização com nomes, datas ou mensagens especiais. Consulte a descrição de cada produto para mais detalhes.', 6);