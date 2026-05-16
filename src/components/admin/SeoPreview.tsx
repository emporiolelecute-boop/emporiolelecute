import { TAXONOMY_LABELS, TaxonomyKind } from '@/lib/taxonomy';

interface Props {
  kind: TaxonomyKind;
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

const SeoPreview = ({ kind, name, slug, metaTitle, metaDescription }: Props) => {
  const host = 'emporiolelecute.com.br';
  const prefix = TAXONOMY_LABELS[kind].urlPrefix;
  const title = (metaTitle || name || `${TAXONOMY_LABELS[kind].singular}`).slice(0, 60);
  const desc = (metaDescription || 'Defina uma meta description para aparecer aqui.').slice(0, 160);
  const url = `https://${host}${prefix}${slug || 'slug'}`;

  return (
    <div className="rounded-md border border-border bg-card p-4 space-y-1 text-left">
      <p className="text-xs text-muted-foreground">{url}</p>
      <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-snug truncate">{title}</p>
      <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
    </div>
  );
};

export default SeoPreview;
