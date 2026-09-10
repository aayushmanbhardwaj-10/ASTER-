import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileOntology } from "../dist/index.js";

const root = new URL("../../../", import.meta.url);
const seed = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.json", root), "utf8"));
const formulas = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.formulas.json", root), "utf8"));
seed.formulaFamilies = formulas.formulaFamilies;

function compile() {
  return compileOntology(structuredClone(seed));
}

test("regression: compiler emits a deterministic immutable artifact after successful validation", () => {
  const first = compile();
  const second = compile();

  assert.equal(first.diagnostics.filter(d => d.severity === "ERROR").length, 0);
  assert.ok(first.artifact);
  assert.ok(second.artifact);
  assert.equal(first.artifact.artifactHash, second.artifact.artifactHash);
  assert.equal(first.artifact.compilerVersion, "ASTER-ONTOLOGY-COMPILER-0.1.0");
});

test("regression: fractional scalar arithmetic accepts RATE, RATIO, and DIMENSIONLESS combinations", () => {
  const result = compile();
  assert.equal(result.diagnostics.filter(d => d.severity === "ERROR").length, 0, JSON.stringify(result.diagnostics, null, 2));

  const nopat = seed.formulaFamilies.find(f => f.familyId === "family_nopat");
  const wacc = seed.formulaFamilies.find(f => f.familyId === "family_wacc");
  assert.ok(nopat);
  assert.ok(wacc);
  assert.equal(nopat.variants[0].expression.kind, "MULTIPLY");
  assert.equal(wacc.variants[0].expression.kind, "ADD");
});

test("regression: temporal offset hardening rejects missing prior-period offsets", () => {
  const broken = structuredClone(seed);
  const family = broken.formulaFamilies.find(f => f.familyId === "family_change_in_nwc");
  assert.ok(family);
  const prior = family.variants[0].inputs.find(i => i.name === "nwc_prior");
  assert.ok(prior);
  delete prior.temporalBinding.offset;

  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "SEMANTIC_TYPE" && d.message.includes("explicit numeric offset")));
  assert.equal(result.artifact, undefined);
});

test("regression: input/concept unit mismatch remains a fatal semantic error", () => {
  const broken = structuredClone(seed);
  const family = broken.formulaFamilies.find(f => f.familyId === "family_nopat");
  assert.ok(family);
  const input = family.variants[0].inputs.find(i => i.name === "ebit");
  assert.ok(input);
  input.unitSemantics = { dimension: "RATE", currencyRequired: false, measureSemantics: "RATE" };

  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "SEMANTIC_TYPE" && d.message.includes("unit semantics do not match concept")));
  assert.equal(result.artifact, undefined);
});

test("regression: dependency cycles remain rejected rather than silently accepted", () => {
  const broken = structuredClone(seed);
  const first = broken.formulaFamilies.find(f => f.familyId === "family_ebit");
  const second = broken.formulaFamilies.find(f => f.familyId === "family_ebitda");
  assert.ok(first);
  assert.ok(second);

  first.variants[0].inputs[0].conceptId = "concept_ebitda";
  second.variants[0].inputs[0].conceptId = "concept_ebit";

  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "DEPENDENCY" && d.message.includes("Dependency cycle detected")));
  assert.equal(result.artifact, undefined);
});
