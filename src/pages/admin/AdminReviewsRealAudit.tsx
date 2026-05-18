// Auditoria real e manual de avaliações importadas da Elo7.
// NENHUMA avaliação vai para `product_reviews` sem aprovação visual aqui.
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDbProducts, type DbProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Upload, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Search, ArrowRight } from 'lucide-react';

// ---------- normalização ----------
const stripDiacritics = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalize = (s: string | null | undefined): string => {
  if (!s) return '';
  let v = stripDiacritics(String(s).toLowerCase().trim());
  // corta sufixos descritivos após " - " (padrão Elo7)
  const dashIdx = v.indexOf(' - ');
  if (dashIdx > 0) v = v.substring(0, dashIdx);
  return v.replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const tokens = (s: string) => new Set(normalize(s).split(' ').filter(t => t.length > 2));

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  a.forEach(t => { if (b.has(t)) inter += 1; });
  return inter / (a.size + b.size - inter);
};

interface MatchResult {
  product_id: string | null;
  product_name: string | null;
  confidence: number;
  method: 'exact' | 'normalized' | 'fuzzy' | 'none';
}

const matchProduct = (elo7Name: string, products: DbProduct[]): MatchResult => {
  const raw = String(elo7Name || '').toLowerCase().trim();
  const norm = normalize(elo7Name);
  if (!norm) return { product_id: null, product_name: null, confidence: 0, method: 'none' };

  // exato (case insensitive)
  const exact = products.find(p => p.name.toLowerCase().trim() === raw);
  if (exact) return { product_id: exact.id, product_name: exact.name, confidence: 100, method: 'exact' };

  // normalizado
  const normMatch = products.find(p => normalize(p.name) === norm);
  if (normMatch) return { product_id: normMatch.id, product_name: normMatch.name, confidence: 95, method: 'normalized' };

  // fuzzy por tokens
  const elo7Tokens = tokens(elo7Name);
  let best: { p: DbProduct; score: number } | null = null;
  for (const p of products) {
    const score = jaccard(elo7Tokens, tokens(p.name));
    if (!best || score > best.score) best = { p, score };
  }
  if (!best || best.score === 0) return { product_id: null, product_name: null, confidence: 0, method: 'none' };
  return {
    product_id: best.p.id,
    product_name: best.p.name,
    confidence: Math.round(best.score * 100),
    method: 'fuzzy',
  };
};

// ---------- detecção flexível de colunas ----------
const pick = (row: Record<string, any>, names: string[]): any => {
  const keys = Object.keys(row);
  for (const n of names) {
    const k = keys.find(k => normalize(k) === normalize(n));
    if (k && row[k] != null && String(row[k]).trim() !== '') return row[k];
  }
  return null;
};

interface ParsedRow {
  feedback_id: string;
  elo7_product_name: string;
  elo7_product_slug: string | null;
  elo7_image_url: string | null;
  elo7_comment: string | null;
  elo7_sentiment: string | null;
  elo7_review_date: string | null;
  elo7_buyer_name: string | null;
  raw: Record<string, any>;
}

const parseSheet = (rows: Record<string, any>[]): ParsedRow[] => {
  return rows
    .map((r, i) => {
      const fid = pick(r, ['feedback_id', 'id', 'id_feedback', 'feedback']);
      const name = pick(r, ['nome_produto', 'produto', 'product_name', 'name']);
      if (!fid || !name) return null;
      return {
        feedback_id: String(fid).trim(),
        elo7_product_name: String(name).trim(),
        elo7_product_slug: pick(r, ['slug', 'produto_slug', 'url']) ? String(pick(r, ['slug','produto_slug','url'])).trim() : null,
        elo7_image_url: pick(r, ['imagem', 'imagens', 'image_url', 'foto', 'fotos']) ? String(pick(r, ['imagem','imagens','image_url','foto','fotos'])).split(/[\s,;]+/)[0].trim() : null,
        elo7_comment: pick(r, ['comentario', 'comment', 'avaliacao', 'review']) ? String(pick(r, ['comentario','comment','avaliacao','review'])) : null,
        elo7_sentiment: pick(r, ['sentimento', 'sentiment']) ? String(pick(r, ['sentimento','sentiment'])) : null,
        elo7_review_date: pick(r, ['data', 'date', 'data_avaliacao']) ? String(pick(r, ['data','date','data_avaliacao'])) : null,
        elo7_buyer_name: pick(r, ['comprador', 'cliente', 'buyer', 'nome']) ? String(pick(r, ['comprador','cliente','buyer','nome'])) : null,
        raw: r,
      };
    })
    .filter((x): x is ParsedRow => x !== null);
};

// ---------- tipos do staging ----------
interface AuditRow {
  id: string;
  feedback_id: string;
  elo7_product_name: string | null;
  elo7_product_slug: string | null;
  elo7_image_url: string | null;
  elo7_comment: string | null;
  elo7_sentiment: string | null;
  elo7_review_date: string | null;
  elo7_buyer_name: string | null;
  elo7_raw: any;
  suggested_product_id: string | null;
  suggested_product_name: string | null;
  suggested_confidence: number | null;
  suggested_method: string | null;
  manual_status: 'pending' | 'confirmed' | 'doubtful' | 'rejected' | 'no_match';
  manual_product_id: string | null;
  visual_notes: string | null;
  reviewed_at: string | null;
  imported_review_id: string | null;
  created_at: string;
}

const STATUS_BADGES: Record<AuditRow['manual_status'], { label: string; cls: string; icon: any }> = {
  pending:   { label: 'Pendente',   cls: 'bg-gray-100 text-gray-800',     icon: HelpCircle },
  confirmed: { label: 'Confirmado', cls: 'bg-green-100 text-green-800',   icon: CheckCircle2 },
  doubtful:  { label: 'Duvidoso',   cls: 'bg-amber-100 text-amber-800',   icon: AlertTriangle },
  no_match:  { label: 'Sem correspondência', cls: 'bg-orange-100 text-orange-800', icon: XCircle },
  rejected:  { label: 'Rejeitado',  cls: 'bg-red-100 text-red-800',       icon: XCircle },
};

const AdminReviewsRealAudit = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: products = [] } = useDbProducts();
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [staging, setStaging] = useState(false);

  // staging rows
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['review_import_audit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_import_audit' as any)
        .select('*')
        .order('manual_status', { ascending: true })
        .order('suggested_confidence', { ascending: false, nullsFirst: false })
        .limit(2000);
      if (error) throw error;
      return (data || []) as unknown as AuditRow[];
    },
  });

  const counts = useMemo(() => {
    const c = { pending: 0, confirmed: 0, doubtful: 0, no_match: 0, rejected: 0, imported: 0 };
    rows.forEach(r => {
      c[r.manual_status]++;
      if (r.imported_review_id) c.imported++;
    });
    return c;
  }, [rows]);

  // ---------- upload + staging ----------
  const handleFile = async (f: File) => {
    setFile(f);
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: null });
    setParsed(parseSheet(json));
  };

  const sendToStaging = async () => {
    if (!parsed.length || !products.length) return;
    setStaging(true);
    try {
      const batchId = crypto.randomUUID();
      const inserts = parsed.map(p => {
        const m = matchProduct(p.elo7_product_name, products);
        return {
          import_batch_id: batchId,
          feedback_id: p.feedback_id,
          elo7_product_name: p.elo7_product_name,
          elo7_product_slug: p.elo7_product_slug,
          elo7_image_url: p.elo7_image_url,
          elo7_comment: p.elo7_comment,
          elo7_sentiment: p.elo7_sentiment,
          elo7_review_date: p.elo7_review_date ? new Date(p.elo7_review_date).toISOString() : null,
          elo7_buyer_name: p.elo7_buyer_name,
          elo7_raw: p.raw,
          suggested_product_id: m.product_id,
          suggested_product_name: m.product_name,
          suggested_confidence: m.confidence,
          suggested_method: m.method,
          manual_status: m.method === 'none' ? 'no_match' : 'pending',
        };
      });

      // upsert em lotes para evitar payload gigante
      const chunkSize = 200;
      let inserted = 0, skipped = 0;
      for (let i = 0; i < inserts.length; i += chunkSize) {
        const chunk = inserts.slice(i, i + chunkSize);
        const { error, count } = await supabase
          .from('review_import_audit' as any)
          .upsert(chunk, { onConflict: 'feedback_id', ignoreDuplicates: true, count: 'exact' });
        if (error) throw error;
        inserted += count || 0;
        skipped += chunk.length - (count || 0);
      }
      toast({ title: 'Enviado para staging', description: `${inserted} novos, ${skipped} duplicados ignorados.` });
      qc.invalidateQueries({ queryKey: ['review_import_audit'] });
      setParsed([]);
      setFile(null);
    } catch (e: any) {
      toast({ title: 'Erro no staging', description: e?.message || String(e), variant: 'destructive' });
    } finally {
      setStaging(false);
    }
  };

  // ---------- ações por linha ----------
  const updateRow = useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<AuditRow> }) => {
      const { error } = await supabase
        .from('review_import_audit' as any)
        .update({ ...vars.patch, reviewed_at: new Date().toISOString() })
        .eq('id', vars.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['review_import_audit'] }),
    onError: (e: any) => toast({ title: 'Erro', description: e?.message, variant: 'destructive' }),
  });

  const importConfirmed = useMutation({
    mutationFn: async () => {
      const toImport = rows.filter(r => r.manual_status === 'confirmed' && !r.imported_review_id);
      if (!toImport.length) throw new Error('Nada para importar');
      let ok = 0, fail = 0;
      for (const r of toImport) {
        const productId = r.manual_product_id || r.suggested_product_id;
        if (!productId) { fail++; continue; }
        // sentimento → rating (apenas positiva mapeada por enquanto)
        const sentiment = (r.elo7_sentiment || '').toLowerCase();
        const rating = sentiment.includes('negat') ? 1 : sentiment.includes('neutr') ? 3 : 5;
        const { data: ins, error } = await supabase.from('product_reviews').insert({
          product_id: productId,
          author_name: r.elo7_buyer_name || 'Cliente Elo7',
          rating,
          comment: r.elo7_comment,
          source: 'elo7',
          source_url: r.elo7_product_slug,
          is_verified: true,
          is_visible: true,
          review_date: r.elo7_review_date,
          external_review_id: r.feedback_id,
        } as any).select('id').single();
        if (error || !ins) { fail++; continue; }
        await supabase.from('review_import_audit' as any).update({ imported_review_id: ins.id }).eq('id', r.id);
        ok++;
      }
      return { ok, fail };
    },
    onSuccess: ({ ok, fail }) => {
      toast({ title: 'Importação concluída', description: `${ok} importados, ${fail} falhas.` });
      qc.invalidateQueries({ queryKey: ['review_import_audit'] });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e?.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Auditoria Real — Reviews Elo7
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nenhuma avaliação vai ao site sem aprovação visual aqui. Confirme cada match manualmente.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(counts) as Array<[keyof typeof counts, number]>).map(([k, v]) => (
            <Badge key={k} variant="outline" className="capitalize">{k}: {v}</Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-1" /> Upload</TabsTrigger>
          <TabsTrigger value="audit"><Search className="w-4 h-4 mr-1" /> Auditoria ({counts.pending})</TabsTrigger>
          <TabsTrigger value="commit"><CheckCircle2 className="w-4 h-4 mr-1" /> Importar ({counts.confirmed - counts.imported})</TabsTrigger>
        </TabsList>

        {/* UPLOAD */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Carregar planilha Elo7 (.xlsx / .csv)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {file && (
                <div className="text-sm">
                  <p><strong>{file.name}</strong> — {parsed.length} linhas válidas detectadas.</p>
                  {parsed.length > 0 && (
                    <p className="text-muted-foreground mt-1">
                      Campos detectados na 1ª linha: {Object.keys(parsed[0].raw).join(', ')}
                    </p>
                  )}
                </div>
              )}
              <Button onClick={sendToStaging} disabled={!parsed.length || staging || !products.length}>
                {staging ? 'Enviando…' : `Enviar ${parsed.length} para staging (sem importar)`}
              </Button>
              <p className="text-xs text-muted-foreground">
                Apenas grava em <code>review_import_audit</code> com status pendente. Não toca em <code>product_reviews</code>.
                Duplicados (mesmo feedback_id) são ignorados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT */}
        <TabsContent value="audit" className="space-y-3">
          {isLoading ? <p>Carregando…</p> : (
            <AuditList rows={rows} products={products} onUpdate={(id, patch) => updateRow.mutate({ id, patch })} />
          )}
        </TabsContent>

        {/* COMMIT */}
        <TabsContent value="commit" className="space-y-3">
          <Card>
            <CardHeader><CardTitle>Importar para o site</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                <p className="text-sm font-medium">⚡ Importação automática segura (100% match)</p>
                <p className="text-xs text-muted-foreground">
                  Confirma e importa apenas linhas cujo nome bate exatamente (método <code>exact</code> ou <code>normalized</code>, confiança ≥ 95).
                  As demais ficam para revisão manual.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => autoImport100.mutate()}
                    disabled={autoImport100.isPending}
                  >
                    {autoImport100.isPending ? 'Processando…' : 'Importar somente 100% match'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadAuditReport(rows)}>
                    Baixar relatório de auditoria (CSV)
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm">
                  Confirmadas manualmente prontas para importar: <strong>{counts.confirmed - counts.imported}</strong>.
                </p>
                <Button onClick={() => importConfirmed.mutate()} disabled={importConfirmed.isPending || (counts.confirmed - counts.imported) === 0} className="mt-2">
                  {importConfirmed.isPending ? 'Importando…' : 'Importar confirmadas agora'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Insere em <code>product_reviews</code> com <code>source='elo7'</code> e <code>external_review_id</code>=feedback_id.
                  Idempotente: re-execução não duplica.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ---------- subcomponente lista ----------
const AuditList = ({
  rows, products, onUpdate,
}: {
  rows: AuditRow[];
  products: DbProduct[];
  onUpdate: (id: string, patch: Partial<AuditRow>) => void;
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(search);
    return rows.filter(r => {
      if (statusFilter !== 'all' && r.manual_status !== statusFilter) return false;
      if (q && !normalize(r.elo7_product_name || '').includes(q) && !normalize(r.suggested_product_name || '').includes(q)) return false;
      return true;
    });
  }, [rows, statusFilter, search]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="doubtful">Duvidosos</SelectItem>
            <SelectItem value="no_match">Sem correspondência</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Buscar por nome de produto…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        <span className="text-sm text-muted-foreground self-center ml-auto">{filtered.length} itens</span>
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 100).map(r => (
          <AuditCard key={r.id} row={r} products={products} onUpdate={onUpdate} />
        ))}
        {filtered.length > 100 && (
          <p className="text-sm text-muted-foreground text-center">Mostrando 100 de {filtered.length}. Filtre para ver mais.</p>
        )}
      </div>
    </div>
  );
};

// ---------- card visual lado a lado ----------
const AuditCard = ({
  row, products, onUpdate,
}: {
  row: AuditRow;
  products: DbProduct[];
  onUpdate: (id: string, patch: Partial<AuditRow>) => void;
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(row.manual_product_id || row.suggested_product_id || '');
  const [productSearch, setProductSearch] = useState('');
  const [notes, setNotes] = useState(row.visual_notes || '');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const badge = STATUS_BADGES[row.manual_status];
  const Icon = badge.icon;

  const productOptions = useMemo(() => {
    const q = normalize(productSearch);
    if (!q) return products.slice(0, 50);
    return products.filter(p => normalize(p.name).includes(q) || p.slug.includes(q)).slice(0, 50);
  }, [products, productSearch]);

  const confidence = row.suggested_confidence ?? 0;
  const confColor = confidence >= 93 ? 'text-green-600' : confidence >= 70 ? 'text-amber-600' : 'text-red-600';

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Badge className={badge.cls}><Icon className="w-3 h-3 mr-1" />{badge.label}</Badge>
          <div className="text-xs text-muted-foreground font-mono">{row.feedback_id}</div>
          <div className={`text-sm font-semibold ${confColor}`}>
            {row.suggested_method} · {confidence}%
          </div>
          {row.imported_review_id && <Badge variant="outline" className="text-green-700">Importado</Badge>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Elo7 (esquerda) */}
          <div className="space-y-2 border-r-0 md:border-r md:pr-4">
            <p className="text-xs uppercase text-muted-foreground font-semibold">Elo7 (original)</p>
            {row.elo7_image_url && (
              <img src={row.elo7_image_url} alt="" loading="lazy" className="w-32 h-32 object-cover rounded border" />
            )}
            <p className="font-medium">{row.elo7_product_name}</p>
            {row.elo7_product_slug && <p className="text-xs text-muted-foreground break-all">{row.elo7_product_slug}</p>}
            {row.elo7_comment && <p className="text-sm italic">"{row.elo7_comment}"</p>}
            <div className="text-xs text-muted-foreground space-x-2">
              {row.elo7_buyer_name && <span>{row.elo7_buyer_name}</span>}
              {row.elo7_review_date && <span>· {new Date(row.elo7_review_date).toLocaleDateString('pt-BR')}</span>}
              {row.elo7_sentiment && <span>· {row.elo7_sentiment}</span>}
            </div>
          </div>

          {/* Produto atual (direita) */}
          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Produto da loja
            </p>
            {selectedProduct ? (
              <>
                {selectedProduct.images?.[0] && (
                  <img src={selectedProduct.images[0]} alt="" loading="lazy" className="w-32 h-32 object-cover rounded border" />
                )}
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-xs text-muted-foreground">/produto/{selectedProduct.slug}</p>
                {selectedProduct.category?.name && <Badge variant="outline" className="text-xs">{selectedProduct.category.name}</Badge>}
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhum produto selecionado</p>
            )}

            <div className="pt-2 space-y-1">
              <Input
                placeholder="Buscar outro produto…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="h-8"
              />
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="h-8"><SelectValue placeholder="Selecionar produto" /></SelectTrigger>
                <SelectContent>
                  {productOptions.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Textarea
          placeholder="Notas visuais (opcional)…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="text-sm"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => onUpdate(row.id, {
              manual_status: 'confirmed',
              manual_product_id: selectedProductId || null,
              visual_notes: notes || null,
            })}
            disabled={!selectedProductId}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" /> Confirmar match
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate(row.id, {
              manual_status: 'doubtful',
              manual_product_id: selectedProductId || null,
              visual_notes: notes || null,
            })}
          >
            <AlertTriangle className="w-4 h-4 mr-1" /> Duvidoso
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate(row.id, { manual_status: 'no_match', visual_notes: notes || null })}
          >
            Sem correspondência
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => onUpdate(row.id, { manual_status: 'rejected', visual_notes: notes || null })}
          >
            <XCircle className="w-4 h-4 mr-1" /> Rejeitar
          </Button>
          {row.manual_status !== 'pending' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUpdate(row.id, { manual_status: 'pending' })}
            >
              Reabrir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminReviewsRealAudit;
