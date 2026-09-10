import { readFileSync, writeFileSync } from "node:fs";
import { compileOntology } from "./index.js";

const input = process.argv[2];
if (!input) { console.error("Usage: ontology-compiler <manifest.json> [artifact.json]"); process.exit(2); }
const output = process.argv[3];
const seed = JSON.parse(readFileSync(input, "utf8"));
try { seed.formulaFamilies = JSON.parse(readFileSync(input.replace(/\.json$/i, ".formulas.json"), "utf8")).formulaFamilies; } catch {}
const result = compileOntology(seed);
for (const d of result.diagnostics) console.error(`${d.severity} ${d.phase}: ${d.message}`);
if (!result.artifact) { console.error("Ontology compilation rejected."); process.exit(1); }
const encoded = `${JSON.stringify(result.artifact, null, 2)}\n`;
if (output) writeFileSync(output, encoded, "utf8"); else process.stdout.write(encoded);
