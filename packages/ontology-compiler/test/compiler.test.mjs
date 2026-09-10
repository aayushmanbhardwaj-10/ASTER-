import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileOntology } from "../dist/index.js";

const root = new URL("../../../", import.meta.url);
const seed = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.json", root), "utf8"));
const formulas = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.formulas.json", root), "utf8"));
seed.formulaFamilies = formulas.formulaFamilies;

function compileBroken(mutator) {
  const broken = structuredClone(seed);
  mutator(broken);
  return compileOntology(broken);
}

test("P1.4 DCF seed compiles with zero fatal diagnostics", () => {
  const result = compileOntology(seed);
  assert.equal(result.diagnostics.filter((d) => d.severity === "ERROR").length, 0, JSON.stringify(result.diagnostics, null, 2));
  assert.ok(result.artifact?.artifactHash.startsWith("sha256:"));
  assert.equal(result.artifact?.concepts.length, 35);
  assert.equal(result.artifact?.formulaFamilies.length, 15);
});

test("artifact hashing is deterministic", () => {
  const first = compileOntology(seed);
  const second = compileOntology(structuredClone(seed));
  assert.equal(first.artifact?.artifactHash, second.artifact?.artifactHash);
});

test("compiler rejects an unbound expression input", () => {
  const result = compileBroken((broken) => {
    broken.formulaFamilies[0].variants[0].expression.left.left.inputName = "missing_concept";
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "SEMANTIC_TYPE" && d.message.includes("Unbound expression input")));
  assert.equal(result.artifact, undefined);
});

test("compiler rejects an alias collision when applicability contexts overlap", () => {
  const result = compileBroken((broken) => {
    broken.concepts[1].aliases = [{ value: "top line", normalizedValue: "top line", kind: "COMMON_TERM", applicability: { industry: "SOFTWARE" } }];
    broken.concepts[0].aliases[0].applicability = { industry: "SOFTWARE", jurisdiction: "US" };
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "CONTEXT" && d.message.includes("Alias collision")));
});

test("compiler rejects a missing formula for an analytical concept", () => {
  const result = compileBroken((broken) => {
    broken.formulaFamilies = broken.formulaFamilies.slice(1);
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "REACHABILITY" && d.message.includes("no active formula family")));
});

test("compiler rejects a declared output unit mismatch", () => {
  const result = compileBroken((broken) => {
    broken.formulaFamilies[0].variants[0].outputUnitSemantics = { dimension: "RATE", currencyRequired: false, measureSemantics: "RATE" };
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "SEMANTIC_TYPE" && d.message.includes("Declared output unit semantics")));
});

test("compiler rejects an active formula family with ambiguous precedence", () => {
  const result = compileBroken((broken) => {
    broken.formulaFamilies[0].variants.push(structuredClone(broken.formulaFamilies[0].variants[0]));
    broken.formulaFamilies[0].variants[1].variantId = "fv_ebit_v2";
    broken.formulaFamilies[0].variants[1].formulaId = "formula_ebit_v2";
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "FORMULA_RESOLUTION" && d.message.includes("Ambiguous formula precedence")));
});

test("compiler rejects non-finite numeric values instead of hashing them as JSON null", () => {
  const result = compileBroken((broken) => {
    broken.formulaFamilies[0].variants[0].fidelityRank = Number.NaN;
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "LEXICAL" && d.message.includes("Invalid fidelityRank")));
  assert.equal(result.artifact, undefined);
});

test("compiler rejects relationship references to unknown concepts", () => {
  const result = compileBroken((broken) => {
    broken.relationships.push({
      relationshipId: "rel_bad",
      sourceConceptId: "concept_missing",
      targetConceptId: "concept_revenue",
      sourceReferences: ["src_aster_curated"],
    });
  });
  assert.ok(result.diagnostics.some((d) => d.phase === "REFERENCE" && d.message.includes("Relationship source concept does not exist")));
});
