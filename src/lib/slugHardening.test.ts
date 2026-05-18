import { describe, it, expect } from "vitest";
import {
  generateSafeSlug,
  assessSlugQuality,
  SLUG_MAX_HEALTHY,
} from "./slugHardening";

describe("generateSafeSlug — token-aware truncation", () => {
  it("retorna slug íntegro quando cabe", () => {
    expect(generateSafeSlug("Lembrancinha Sabonete Patinho")).toBe(
      "lembrancinha-sabonete-patinho",
    );
  });

  it("nunca corta no meio de palavra", () => {
    const slug = generateSafeSlug(
      "Lembrancinha Sabonete Pezinho no Tule com Tag Personalizada",
      48,
    );
    expect(slug.length).toBeLessThanOrEqual(48);
    // nenhum token cortado
    for (const t of slug.split("-")) {
      expect(t.length).toBeGreaterThan(0);
    }
    // não termina em sufixo suspeito
    expect(slug).not.toMatch(/-[a-z0-9]{1,2}$/);
  });

  it("remove stopwords antes de cortar tokens semânticos", () => {
    const slug = generateSafeSlug(
      "Lembrancinha Sabonete Pezinho no Tule com Tag Personalizada",
      52,
    );
    expect(slug.includes("personalizada")).toBe(true);
    expect(slug.includes("pezinho")).toBe(true);
  });

  it("preserva numerais", () => {
    const slug = generateSafeSlug("Lembrancinha Sabonete Nome 3 Letras Personalizado");
    expect(slug).toContain("3-letras");
  });

  it("nunca produz hash residual", () => {
    for (const name of [
      "Lembrancinha Sabonete Fundo do Mar Letra Mini Coracao Especial Edicao Limitada Extra Longa",
      "Mini Vela na Latinha Personalizada com Mensagem Secreta Edicao Limitada Especial",
    ]) {
      const slug = generateSafeSlug(name, SLUG_MAX_HEALTHY);
      expect(slug).not.toMatch(/-[a-z]{1,2}$/);
      expect(slug).not.toMatch(/-[a-z0-9]{4}$/);
    }
  });

  it("preserva pelo menos 2 tokens", () => {
    expect(generateSafeSlug("Sabonete", 5).split("-").length).toBeGreaterThanOrEqual(1);
  });
});

describe("assessSlugQuality", () => {
  it("ok para slug saudável", () => {
    const q = assessSlugQuality("lembrancinha-sabonete-patinho");
    expect(q.severity).toBe("ok");
    expect(q.issues).toEqual([]);
  });

  it("erro para hash residual com dígitos", () => {
    const q = assessSlugQuality("lembrancinha-sabonete-fundo-do-mar-letra-mini-cora-ii6z");
    expect(q.severity).toBe("error");
    expect(q.issues.join(" ")).toMatch(/hash/);
  });

  it("erro para hash sem vogal", () => {
    expect(assessSlugQuality("sabonete-letra-brasao-hxsv").severity).toBe("error");
    expect(assessSlugQuality("sabonete-letra-bwvf").severity).toBe("error");
  });

  it("warn para token final truncado", () => {
    expect(assessSlugQuality("sabonete-letra-mini-c").severity).toBe("warn");
    expect(assessSlugQuality("sabonete-mensagem-se").severity).toBe("warn");
  });

  it("não acusa stopwords curtas legítimas", () => {
    expect(assessSlugQuality("lembrancinha-sabonete-pezinho-no-tule").severity).toBe("ok");
    expect(assessSlugQuality("lembrancinha-anjinho-com-tag").severity).toBe("ok");
  });

  it("não acusa numerais finais", () => {
    expect(assessSlugQuality("lembrancinha-sabonete-brasao-15-anos").severity).toBe("ok");
  });

  it("warn para slug longo, error para gigante", () => {
    expect(assessSlugQuality("a".repeat(61)).severity).toBe("warn");
    expect(assessSlugQuality("a".repeat(76)).severity).toBe("error");
  });

  it("ignora slug vazio", () => {
    expect(assessSlugQuality("").severity).toBe("ok");
  });
});
