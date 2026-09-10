import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileOntology } from "../dist/index.js";

const root = new URL("../../", import.meta.url);
const seed = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.json", root), "utf8"));
const formulas = JSON.parse(readFileSync(new URL("packages/ontology/seed/draft-001.formulas.json", root), "utf8"));
seed.formulaFamilies = formulas.formulaFamilies;

test("P1.4 DCF seed compiles with zero fatal diagnostics", () => {
  const result = compileOntology(seed);
  assert.equal(result.diagnostics.filter(d => d.severity === "ERROR").length, 0, JSON.stringify(result.diagnostics, null, 2));
  assert.ok(result.artifact?.artifactHash.startsWith("sha256:"));
  assert.equal(result.artifact?.concepts.length, 35);
  assert.equal(result.artifact?.formulaFamilies.length, 15);
});

test("compiler rejects an unbound expression input", () => {
  const broken = structuredClone(seed);
  broken.formulaFamilies[0].variants[0].expression.left.left.inputName = "missing_concept";
  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "SEMANTIC_TYPE" && d.message.includes("Unbound expression input")));
  assert.equal(result.artifact, undefined);
});

test("compiler rejects an alias collision", () => {
  const broken = structuredClone(seed);
  broken.concepts[1].aliases = [{ value: "top line", normalizedValue: "top line", kind: "COMMON_TERM" }];
  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "CONTEXT" && d.message.includes("Alias collision")));
});

test("compiler rejects a missing formula for an analytical concept", () => {
  const broken = structuredClone(seed);
  broken.formulaFamilies = broken.formulaFamilies.slice(1);
  const result = compileOntology(broken);
  assert.ok(result.diagnostics.some(d => d.phase === "REACHABILITY" && d.message.includes("no formula family")));
});
