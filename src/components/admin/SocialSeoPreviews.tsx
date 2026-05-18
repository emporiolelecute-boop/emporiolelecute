// Fase 8 — Pré-visualizações Google / OG (WhatsApp/Facebook) / Pinterest.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PRODUCT_PATH_PREFIX } from '@/lib/urls';

interface Props {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  /** Prefixo de URL público, ex: '/produtos/'. */
  pathPrefix?: string;
}

const HOST = 'emporiolelecute.com.br';
const TITLE_MAX = 60;
const DESC_MAX = 160;

const truncate = (s: string, max: number) =>
  s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…';

const SocialSeoPreviews = ({ title, description, slug, imageUrl, pathPrefix = `${PRODUCT_PATH_PREFIX}/` }: Props) => {
  const safeTitle = (title || '').trim();
  const safeDesc = (description || '').trim();
  const url = `https://${HOST}${pathPrefix}${slug || 'slug'}`;
  const displayTitle = truncate(safeTitle || 'Título do produto', TITLE_MAX);
  const displayDesc = truncate(safeDesc || 'Defina uma descrição para aparecer aqui.', DESC_MAX);

  const issues: string[] = [];
  if (!safeTitle) issues.push('Sem título');
  else if (safeTitle.length > TITLE_MAX) issues.push(`Título excede ${TITLE_MAX} caracteres (será cortado)`);
  if (!safeDesc) issues.push('Sem descrição');
  else if (safeDesc.length > DESC_MAX) issues.push(`Descrição excede ${DESC_MAX} caracteres (será cortada)`);
  if (!imageUrl) issues.push('Sem imagem de capa (OG/Pinterest perdem força)');

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display">Pré-visualizações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.length > 0 && (
          <div className="rounded-md border border-amber-300/60 bg-amber-50 p-3 text-amber-800 text-xs">
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Atenção
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              {issues.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        )}

        {/* Google */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Google</p>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground truncate">{url}</p>
            <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-snug truncate">{displayTitle}</p>
            <p className="text-sm text-muted-foreground leading-snug">{displayDesc}</p>
          </div>
        </div>

        {/* WhatsApp / OG */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">WhatsApp / Facebook (Open Graph)</p>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            {imageUrl ? (
              <div className="aspect-[1.91/1] bg-muted overflow-hidden">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Sem imagem de capa
              </div>
            )}
            <div className="p-3">
              <p className="text-[11px] text-muted-foreground uppercase">{HOST}</p>
              <p className="text-sm font-semibold leading-snug line-clamp-2">{displayTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{displayDesc}</p>
            </div>
          </div>
        </div>

        {/* Pinterest */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Pinterest</p>
          <div className="grid grid-cols-[120px_1fr] gap-3 rounded-md border border-border bg-card p-3">
            <div className="aspect-[2/3] bg-muted rounded overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground p-2 text-center">
                  Sem imagem vertical
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug line-clamp-3">{displayTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-4 mt-1">{displayDesc}</p>
              <p className="text-[10px] text-muted-foreground mt-2 truncate">{HOST}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSeoPreviews;
