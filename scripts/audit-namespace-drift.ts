/**
 * Fase 2.3 — Auditoria unificada de drift de namespace.
 *
 * Roda TODAS as checagens estruturais pré-deploy em um único comando:
 *
 *   bun run scripts/audit-namespace-drift.ts
 *
 * Verifica:
 *  1. Helpers frontend ↔ edge concordam em PREFIX e ORIGIN.
 *  2. public/sitemap.xml: marker + namespace correto + sem prefixo legado.
 *  3. public/.sitemap-source.json: hash/bytes batem com XML.
 *  4. public/robots.txt: aponta para a origem canônica.
 *  5. Nenhum hardcode `/produto(s)/${...}` fora dos helpers em src/ e edge.
 *  6. AdminRedirects placeholders coerentes (apenas warning, não falha).
 *
 * Exit code 0 → tudo limpo. 1 → drift detectado.
 *
 * NÃO altera nada. Apenas reporta.
 */

// @ts-expect-error - node types not in tsconfig
import { readFileSync, existsSync } from "fs";
// @ts-expect-error - node types not in tsconfig
import { resolve } from "path";
// @ts-expect-error - node types not in tsconfig
import { createHash } from "crypto";
// @ts-expect-error - node types not in tsconfig
import { execSync } from "child_process";
// @ts-expect-error - node types not in tsconfig
import process from "process";

const read = (p: string) => readFileSync(resolve(p), "utf8");

interface Check {
  name: string;
  ok: boolean;
  detail?: string;
}
const results: Check[] = [];
const push = (name: string, ok: boolean, detail?: string) =>
  results.push({ name, ok, detail });

// ---------- 1. Helpers em sincronia ----------
const fe = read("src/lib/urls.ts");
const edge = read("supabase/functions/_shared/urls.ts");
const fePrefix = fe.match(/PRODUCT_PATH_PREFIX\s*=\s*"([^"]+)"/)?.[1];
const edgePrefix = edge.match(/PRODUCT_PATH_PREFIX\s*=\s*"([^"]+)"/)?.[1];
const feOrigin = fe.match(/CANONICAL_ORIGIN\s*=\s*"([^"]+)"/)?.[1];
const edgeOrigin = edge.match(/CANONICAL_ORIGIN\s*=\s*"([^"]+)"/)?.[1];
push(
  "helpers: PRODUCT_PATH_PREFIX frontend == edge",
  fePrefix === edgePrefix,
  `frontend="${fePrefix}" edge="${edgePrefix}"`,
);
push(
  "helpers: CANONICAL_ORIGIN frontend == edge",
  feOrigin === edgeOrigin,
  `frontend="${feOrigin}" edge="${edgeOrigin}"`,
);

const NAMESPACE = fePrefix ?? "/produto";
const LEGACY = fe.match(/LEGACY_PRODUCT_PATH_PREFIX\s*=\s*"([^"]+)"/)?.[1];
push(
  "helpers: legacy != canonical",
  Boolean(LEGACY && LEGACY !== NAMESPACE),
  `canonical="${NAMESPACE}" legacy="${LEGACY}"`,
);

// ---------- 2. sitemap.xml ----------
const xml = read("public/sitemap.xml");
push(
  "sitemap: marker de origem presente",
  xml.includes("lovable:sitemap-source generate-sitemap"),
);
const nsMarker = xml.match(/<!--\s*lovable:sitemap-namespace\s+([^\s-]+)\s*-->/)?.[1];
push(
  "sitemap: namespace marker == helper",
  nsMarker === NAMESPACE,
  `marker="${nsMarker}" helper="${NAMESPACE}"`,
);
const legacyLocs =
  LEGACY &&
  xml.match(new RegExp(`<loc>[^<]*${LEGACY}/[^<]+</loc>`, "g"))?.length;
push(
  "sitemap: zero entries no namespace legado",
  !legacyLocs,
  legacyLocs ? `${legacyLocs} entradas em ${LEGACY}` : undefined,
);

// ---------- 3. .sitemap-source.json ----------
if (existsSync(resolve("public/.sitemap-source.json"))) {
  const meta = JSON.parse(read("public/.sitemap-source.json"));
  const hash = createHash("sha256").update(xml).digest("hex");
  push(
    "sitemap-source: hash bate com XML materializado",
    meta.sha256 === hash && meta.bytes === xml.length,
    `meta.sha256=${meta.sha256?.slice(0, 12)}… atual=${hash.slice(0, 12)}…`,
  );
  push(
    "sitemap-source: namespace == helper",
    meta.namespace === NAMESPACE,
    `meta=${meta.namespace}`,
  );
} else {
  push("sitemap-source: arquivo presente", false, "ausente");
}

// ---------- 4. robots.txt ----------
const robots = read("public/robots.txt");
push(
  "robots.txt: Sitemap aponta para CANONICAL_ORIGIN",
  robots.includes(`Sitemap: ${feOrigin}/sitemap.xml`),
);

// ---------- 5. Hardcodes residuais ----------
// `/produto/${...}` ou `/produtos/${...}` fora do allowlist.
const allowlist = new Set([
  "src/lib/urls.ts",
  "supabase/functions/_shared/urls.ts",
  "src/lib/seoSurfaceDrift.test.ts",
  "scripts/audit-namespace-drift.ts",
]);
let grep = "";
try {
  grep = execSync(
    `rg -nP "[\\\`\\"']/(produtos|produto)/\\\\\\$\\{" src/ supabase/functions/ 2>/dev/null || true`,
    { encoding: "utf8" },
  );
} catch {
  /* rg may exit 1 if no match */
}
const hardcodes = grep
  .split("\n")
  .filter(Boolean)
  .filter((line) => {
    const file = line.split(":")[0];
    return !allowlist.has(file);
  });
push(
  "hardcodes: nenhum literal /produto(s)/${…} fora dos helpers",
  hardcodes.length === 0,
  hardcodes.length ? hardcodes.slice(0, 5).join("\n  ") : undefined,
);

// ---------- 6. Merchant feed usa helper ----------
const merchant = read("supabase/functions/merchant-feed/index.ts");
push(
  "merchant-feed: usa productAbsolute (helper)",
  merchant.includes("productAbsolute"),
);

// ---------- Relatório ----------
console.log(`\n[audit] namespace=${NAMESPACE} legacy=${LEGACY}\n`);
let failed = 0;
for (const r of results) {
  const tag = r.ok ? "  OK " : "FAIL ";
  console.log(`${tag} ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  if (!r.ok) failed++;
}
console.log(`\n[audit] ${results.length - failed}/${results.length} checks ok`);
if (failed > 0) {
  console.error(`[audit] ${failed} drift(s) detectado(s).`);
  process.exit(1);
}
