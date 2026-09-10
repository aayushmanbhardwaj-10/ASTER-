import { createHash } from "node:crypto";

export const COMPILER_VERSION = "ASTER-ONTOLOGY-COMPILER-0.1.0";
export type DiagnosticSeverity = "ERROR" | "WARNING" | "INFO";
export type DiagnosticPhase = "LEXICAL" | "CONTEXT" | "REFERENCE" | "DEPENDENCY" | "SEMANTIC_TYPE" | "FORMULA_RESOLUTION" | "REACHABILITY" | "CONSISTENCY" | "ARTIFACT";

export interface Diagnostic {
  diagnosticId: string;
  severity: DiagnosticSeverity;
  phase: DiagnosticPhase;
  conceptId?: string | undefined;
  formulaId?: string | undefined;
  variantId?: string | undefined;
  sourceLocation?: string | undefined;
  message: string;
  relatedObjects?: readonly string[] | undefined;
}

type JsonObject = Record<string, unknown>;
type UnitSemantics = { dimension: string; measureSemantics?: string; currencyRequired: boolean; canonicalUnit?: string };
type ApplicabilityContext = { accountingFramework?: string; jurisdiction?: string; industry?: string; entityType?: string; reportingBasis?: string; securityClass?: string; currency?: string; requiredDimensions?: readonly string[] };
type FormulaInput = { name: string; conceptId: string; unitSemantics: UnitSemantics; temporalBinding?: { relation?: string; offset?: number; anchor?: string; alignment?: string; granularity?: string; calendar?: string } };
type FormulaVariant = { variantId: string; formulaId: string; version: string; familyId: string; targetConceptId: string; fidelityRank: number; expression: JsonObject; inputs: readonly FormulaInput[]; outputUnitSemantics: UnitSemantics; constraints: readonly string[]; provenance: readonly string[]; status: string; applicableContext?: ApplicabilityContext };
type FormulaFamily = { familyId: string; targetConceptId: string; variants: readonly FormulaVariant[]; solutionVariants?: readonly FormulaVariant[] };
type Concept = { conceptId: string; canonicalName: string; definition: string; realm: string; role: string; unitSemantics: UnitSemantics; applicability?: ApplicabilityContext; aliases?: readonly { value: string; normalizedValue?: string; applicability?: ApplicabilityContext }[]; sourceReferences?: readonly string[]; relationships?: readonly { relationshipId: string; sourceConceptId: string; targetConceptId: string; sourceReferences: readonly string[] }[] };
type Constraint = { constraintId: string; referencedConceptIds?: readonly string[] };
type SourceReference = { sourceReferenceId: string };

export interface SeedManifest {
  manifestId: string;
  manifestVersion: string;
  status: "DRAFT" | "RELEASE_CANDIDATE";
  semanticVersion: string;
  ontologyVersion: string;
  baseReleaseId?: string | null;
  sourceReferences: readonly SourceReference[];
  constraints: readonly Constraint[];
  concepts: readonly Concept[];
  relationships: readonly JsonObject[];
  formulaFamilies: readonly FormulaFamily[];
  effectiveDuring?: { start: string; end?: string; boundarySemantics: string };
}

interface TypeInfo { dimension: string; measure?: string | undefined; currencyRequired: boolean; }

const error = (phase: DiagnosticPhase, message: string, extra: Partial<Diagnostic> = {}): Diagnostic => ({ diagnosticId: `${phase}_${message}`.replace(/[^A-Za-z0-9_]+/g, "_").slice(0, 180), severity: "ERROR", phase, message, ...extra });

function stable(value: unknown): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite numeric value cannot be serialized into a release artifact.");
    return JSON.stringify(value);
  }
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${stable(object[key])}`).join(",")}}`;
}

function normalizeAlias(value: string): string { return value.normalize("NFKC").trim().toLocaleLowerCase("en-US"); }

const CONTEXT_KEYS = ["accountingFramework", "jurisdiction", "industry", "entityType", "reportingBasis", "securityClass", "currency"] as const;
const VALID_CONTEXT_DIMENSIONS = new Set(["ACCOUNTING_FRAMEWORK", "JURISDICTION", "INDUSTRY", "ENTITY_TYPE", "REPORTING_BASIS", "SECURITY_CLASS", "CURRENCY", "ECONOMIC_TIME", "PUBLICATION_TIME", "KNOWLEDGE_TIME", "ONTOLOGY_TIME"]);

function contextsOverlap(a: ApplicabilityContext = {}, b: ApplicabilityContext = {}): boolean { return CONTEXT_KEYS.every((key) => !a[key] || !b[key] || a[key] === b[key]); }

function expressionType(node: JsonObject, inputs: Map<string, TypeInfo>, diagnostics: Diagnostic[]): TypeInfo | undefined {
  switch (node.kind) {
    case "INPUT": {
      const name = typeof node.inputName === "string" ? node.inputName : "";
      const type = inputs.get(name);
      if (!type) diagnostics.push(error("SEMANTIC_TYPE", `Unbound expression input: ${name}.`));
      return type;
    }
    case "CONSTANT": {
      const unit = node.unitSemantics as UnitSemantics | undefined;
      return unit ? { dimension: unit.dimension, ...(unit.measureSemantics ? { measure: unit.measureSemantics } : {}), currencyRequired: unit.currencyRequired } : { dimension: "DIMENSIONLESS", measure: "RATIO", currencyRequired: false };
    }
    case "NEGATE": return expressionType(node.operand as JsonObject, inputs, diagnostics);
    case "ADD":
    case "SUBTRACT": {
      const left = expressionType(node.left as JsonObject, inputs, diagnostics), right = expressionType(node.right as JsonObject, inputs, diagnostics);
      if (!left || !right) return undefined;
      const sameDimension = left.dimension === right.dimension;
      const scalarCompatibility = (left.dimension === "DIMENSIONLESS" || left.dimension === "RATIO") && (right.dimension === "DIMENSIONLESS" || right.dimension === "RATIO");
      if ((!sameDimension && !scalarCompatibility) || left.currencyRequired !== right.currencyRequired) { diagnostics.push(error("SEMANTIC_TYPE", `Incompatible ${String(node.kind)} dimensions: ${left.dimension} and ${right.dimension}.`)); return undefined; }
      if (left.dimension === "RATE" && right.dimension === "RATE") return { dimension: "RATE", measure: "RATE", currencyRequired: false };
      return left;
    }
    case "MULTIPLY": {
      const left = expressionType(node.left as JsonObject, inputs, diagnostics), right = expressionType(node.right as JsonObject, inputs, diagnostics);
      if (!left || !right) return undefined;
      if (left.dimension === "DIMENSIONLESS" || left.dimension === "RATIO") return right;
      if (right.dimension === "DIMENSIONLESS" || right.dimension === "RATIO") return left;
      if (left.dimension === "RATE" && right.dimension === "CURRENCY_AMOUNT") return { dimension: "CURRENCY_AMOUNT", currencyRequired: true, ...(right.measure ? { measure: right.measure } : {}) };
      if (left.dimension === "CURRENCY_AMOUNT" && right.dimension === "RATE") return { dimension: "CURRENCY_AMOUNT", currencyRequired: true, ...(left.measure ? { measure: left.measure } : {}) };
      if (left.dimension === "RATE" && right.dimension === "RATE") return { dimension: "RATIO", measure: "RATIO", currencyRequired: false };
      if (left.dimension === "CURRENCY_AMOUNT" && right.dimension === "SHARE_QUANTITY") return { dimension: "PRICE", measure: "POINT_IN_TIME", currencyRequired: true };
      diagnostics.push(error("SEMANTIC_TYPE", `Unsupported multiplication dimensions: ${left.dimension} * ${right.dimension}.`)); return undefined;
    }
    case "DIVIDE": {
      const left = expressionType(node.left as JsonObject, inputs, diagnostics), right = expressionType(node.right as JsonObject, inputs, diagnostics);
      if (!left || !right) return undefined;
      if (right.dimension === "DIMENSIONLESS" || right.dimension === "RATIO") return left;
      if (left.dimension === "CURRENCY_AMOUNT" && right.dimension === "RATE") return { dimension: "CURRENCY_AMOUNT", currencyRequired: true, ...(left.measure ? { measure: left.measure } : {}) };
      if (left.dimension === "CURRENCY_AMOUNT" && right.dimension === "SHARE_QUANTITY") return { dimension: "PRICE", measure: "POINT_IN_TIME", currencyRequired: true };
      if (left.dimension === right.dimension) return { dimension: "RATIO", measure: "RATIO", currencyRequired: false };
      diagnostics.push(error("SEMANTIC_TYPE", `Unsupported division dimensions: ${left.dimension} / ${right.dimension}.`)); return undefined;
    }
    case "POWER": {
      const base = expressionType(node.base as JsonObject, inputs, diagnostics), exponent = expressionType(node.exponent as JsonObject, inputs, diagnostics);
      if (!base || !exponent) return undefined;
      if (exponent.dimension !== "DIMENSIONLESS" && exponent.dimension !== "RATIO") diagnostics.push(error("SEMANTIC_TYPE", "Power exponent must be dimensionless."));
      if (base.dimension !== "DIMENSIONLESS" && base.dimension !== "RATIO" && base.dimension !== "RATE") diagnostics.push(error("SEMANTIC_TYPE", "Power base must be a scalar rate expression."));
      return { dimension: "DIMENSIONLESS", measure: "RATIO", currencyRequired: false };
    }
    default: diagnostics.push(error("LEXICAL", `Unknown expression node kind: ${String(node.kind)}.`)); return undefined;
  }
}

function stageLexical(seed: SeedManifest, diagnostics: Diagnostic[]) {
  if (!/^\d+\.\d+\.\d+$/.test(seed.semanticVersion)) diagnostics.push(error("LEXICAL", "semanticVersion must use SemVer MAJOR.MINOR.PATCH."));
  if (!seed.manifestId || !seed.manifestVersion || !seed.ontologyVersion) diagnostics.push(error("LEXICAL", "Manifest identity and ontology version fields are required."));
  const ids = new Set<string>();
  for (const concept of seed.concepts) {
    if (!/^concept_[a-z0-9_]+$/.test(concept.conceptId ?? "")) diagnostics.push(error("LEXICAL", `Invalid concept ID: ${concept.conceptId}.`, { conceptId: concept.conceptId }));
    if (ids.has(concept.conceptId)) diagnostics.push(error("LEXICAL", `Duplicate concept ID: ${concept.conceptId}.`, { conceptId: concept.conceptId }));
    ids.add(concept.conceptId);
    for (const key of ["canonicalName", "definition", "realm", "role", "unitSemantics", "effectiveDuring"] as const) if (!concept[key as keyof Concept]) diagnostics.push(error("LEXICAL", `Missing ${key} on concept ${concept.conceptId}.`, { conceptId: concept.conceptId }));
  }
  for (const family of seed.formulaFamilies) {
    if (!family.familyId || !family.targetConceptId) diagnostics.push(error("LEXICAL", "Formula family requires familyId and targetConceptId."));
    if (!family.variants?.length) diagnostics.push(error("FORMULA_RESOLUTION", `Formula family has no variants: ${family.familyId}.`));
    for (const variant of family.variants ?? []) {
      if (!Number.isInteger(variant.fidelityRank) || variant.fidelityRank < 0) diagnostics.push(error("LEXICAL", `Invalid fidelityRank on ${variant.variantId}.`, { variantId: variant.variantId }));
      if (!variant.expression || typeof variant.expression !== "object") diagnostics.push(error("LEXICAL", `Missing expression on ${variant.variantId}.`, { variantId: variant.variantId }));
    }
  }
}

function stageContext(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const aliases = new Map<string, { conceptId: string; applicability: ApplicabilityContext }[]>();
  for (const concept of seed.concepts) for (const alias of concept.aliases ?? []) {
    const normalized = normalizeAlias(alias.normalizedValue ?? alias.value), entries = aliases.get(normalized) ?? [];
    for (const prior of entries) if (prior.conceptId !== concept.conceptId && contextsOverlap(prior.applicability, alias.applicability ?? {})) diagnostics.push(error("CONTEXT", `Alias collision under overlapping context: ${normalized}.`, { relatedObjects: [prior.conceptId, concept.conceptId] }));
    entries.push({ conceptId: concept.conceptId, applicability: alias.applicability ?? {} }); aliases.set(normalized, entries);
    if (alias.applicability && concept.applicability && !contextsOverlap(concept.applicability, alias.applicability)) diagnostics.push(error("CONTEXT", `Alias applicability conflicts with concept: ${alias.value}.`, { conceptId: concept.conceptId }));
  }
}

function stageReferences(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const concepts = new Set(seed.concepts.map((concept) => concept.conceptId)), sources = new Set(seed.sourceReferences.map((source) => source.sourceReferenceId)), constraints = new Set(seed.constraints.map((constraint) => constraint.constraintId)), relationshipIds = new Set<string>();
  for (const relationship of seed.relationships) {
    const id = typeof relationship.relationshipId === "string" ? relationship.relationshipId : "";
    if (id && relationshipIds.has(id)) diagnostics.push(error("REFERENCE", `Duplicate relationship ID: ${id}.`));
    if (id) relationshipIds.add(id);
    if (!concepts.has(String(relationship.sourceConceptId))) diagnostics.push(error("REFERENCE", `Relationship source concept does not exist: ${String(relationship.sourceConceptId)}.`));
    if (!concepts.has(String(relationship.targetConceptId))) diagnostics.push(error("REFERENCE", `Relationship target concept does not exist: ${String(relationship.targetConceptId)}.`));
    for (const source of (relationship.sourceReferences as string[] | undefined) ?? []) if (!sources.has(source)) diagnostics.push(error("REFERENCE", `Unknown relationship provenance source: ${source}.`));
  }
  for (const concept of seed.concepts) {
    for (const source of concept.sourceReferences ?? []) if (!sources.has(source)) diagnostics.push(error("REFERENCE", `Unknown concept source reference: ${source}.`, { conceptId: concept.conceptId }));
    for (const relationship of concept.relationships ?? []) if (!relationshipIds.has(relationship.relationshipId)) diagnostics.push(error("REFERENCE", `Concept references unknown relationship: ${relationship.relationshipId}.`, { conceptId: concept.conceptId }));
  }
  const variantIds = new Set<string>(), formulaIds = new Set<string>();
  for (const family of seed.formulaFamilies) for (const variant of family.variants ?? []) {
    if (variant.familyId !== family.familyId) diagnostics.push(error("REFERENCE", `Variant familyId does not match parent family: ${variant.variantId}.`, { variantId: variant.variantId }));
    if (variant.targetConceptId !== family.targetConceptId) diagnostics.push(error("REFERENCE", `Variant targetConceptId does not match parent family: ${variant.variantId}.`, { variantId: variant.variantId }));
    if (variantIds.has(variant.variantId)) diagnostics.push(error("REFERENCE", `Duplicate variant ID: ${variant.variantId}.`, { variantId: variant.variantId }));
    if (formulaIds.has(variant.formulaId)) diagnostics.push(error("REFERENCE", `Duplicate formula ID: ${variant.formulaId}.`, { formulaId: variant.formulaId }));
    variantIds.add(variant.variantId); formulaIds.add(variant.formulaId);
    if (!concepts.has(variant.targetConceptId)) diagnostics.push(error("REFERENCE", `Formula target does not exist: ${variant.targetConceptId}.`, { formulaId: variant.formulaId, variantId: variant.variantId }));
    const inputNames = new Set<string>();
    for (const input of variant.inputs ?? []) {
      if (!concepts.has(input.conceptId)) diagnostics.push(error("REFERENCE", `Formula input concept does not exist: ${input.conceptId}.`, { formulaId: variant.formulaId, variantId: variant.variantId }));
      if (inputNames.has(input.name)) diagnostics.push(error("REFERENCE", `Duplicate formula input name: ${input.name}.`, { formulaId: variant.formulaId, variantId: variant.variantId }));
      inputNames.add(input.name);
    }
    for (const source of variant.provenance ?? []) if (!sources.has(source)) diagnostics.push(error("REFERENCE", `Unknown formula provenance source: ${source}.`, { formulaId: variant.formulaId }));
    for (const constraint of variant.constraints ?? []) if (!constraints.has(constraint)) diagnostics.push(error("REFERENCE", `Unknown formula constraint: ${constraint}.`, { formulaId: variant.formulaId }));
  }
}

function stageDependencies(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const graph = new Map<string, Set<string>>();
  for (const concept of seed.concepts) graph.set(concept.conceptId, new Set());
  for (const family of seed.formulaFamilies) for (const variant of family.variants ?? []) for (const input of variant.inputs ?? []) graph.get(variant.targetConceptId)?.add(input.conceptId);
  const active = new Set<string>(), done = new Set<string>();
  const visit = (node: string, path: string[]) => {
    if (active.has(node)) { diagnostics.push(error("DEPENDENCY", `Dependency cycle detected: ${[...path, node].join(" -> ")}.`, { relatedObjects: [...path, node] })); return; }
    if (done.has(node)) return;
    active.add(node); for (const dependency of graph.get(node) ?? []) visit(dependency, [...path, node]); active.delete(node); done.add(node);
  };
  for (const node of graph.keys()) visit(node, []);
}

function sameUnit(a: UnitSemantics, b: UnitSemantics): boolean { return a.dimension === b.dimension && a.currencyRequired === b.currencyRequired && (a.measureSemantics ?? undefined) === (b.measureSemantics ?? undefined); }

function stageTypes(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const concepts = new Map(seed.concepts.map((concept) => [concept.conceptId, concept]));
  for (const family of seed.formulaFamilies) for (const variant of family.variants ?? []) {
    const inputs = new Map<string, TypeInfo>();
    for (const input of variant.inputs ?? []) inputs.set(input.name, { dimension: input.unitSemantics.dimension, measure: input.unitSemantics.measureSemantics, currencyRequired: input.unitSemantics.currencyRequired });
    for (const input of variant.inputs ?? []) {
      const conceptUnit = concepts.get(input.conceptId)?.unitSemantics;
      if (conceptUnit && !sameUnit(input.unitSemantics, conceptUnit)) diagnostics.push(error("SEMANTIC_TYPE", `Formula input unit semantics do not match concept ${input.conceptId}.`, { formulaId: variant.formulaId, variantId: variant.variantId }));
    }
    const actual = expressionType(variant.expression, inputs, diagnostics), expected = concepts.get(variant.targetConceptId)?.unitSemantics;
    if (actual && expected && (actual.dimension !== expected.dimension || actual.currencyRequired !== expected.currencyRequired)) diagnostics.push(error("SEMANTIC_TYPE", `Formula output type does not match target ${variant.targetConceptId}: ${actual.dimension} vs ${expected.dimension}.`, { formulaId: variant.formulaId, variantId: variant.variantId, conceptId: variant.targetConceptId }));
    if (expected && !sameUnit(variant.outputUnitSemantics, expected)) diagnostics.push(error("SEMANTIC_TYPE", `Declared output unit semantics do not match target concept ${variant.targetConceptId}.`, { formulaId: variant.formulaId, variantId: variant.variantId, conceptId: variant.targetConceptId }));
    for (const input of variant.inputs ?? []) if (input.temporalBinding?.relation === "PRIOR_COMPARABLE_PERIOD" && typeof input.temporalBinding.offset !== "number") diagnostics.push(error("SEMANTIC_TYPE", `Prior-period input requires an explicit numeric offset: ${input.name}.`, { formulaId: variant.formulaId, variantId: variant.variantId }));
  }
}

function stageResolution(seed: SeedManifest, diagnostics: Diagnostic[]) {
  for (const family of seed.formulaFamilies) {
    const active = (family.variants ?? []).filter((variant) => variant.status === "ACTIVE");
    if (!active.length) { diagnostics.push(error("FORMULA_RESOLUTION", `Formula family has no ACTIVE variant: ${family.familyId}.`)); continue; }
    const best = Math.max(...active.map((variant) => variant.fidelityRank)), ties = active.filter((variant) => variant.fidelityRank === best);
    if (ties.length > 1) diagnostics.push(error("FORMULA_RESOLUTION", `Ambiguous formula precedence for ${family.familyId}.`, { formulaId: ties[0].formulaId, relatedObjects: ties.map((variant) => variant.variantId) }));
  }
}

function stageReachability(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const formulas = new Map<string, number>();
  for (const family of seed.formulaFamilies) for (const variant of family.variants ?? []) if (variant.status === "ACTIVE") formulas.set(variant.targetConceptId, (formulas.get(variant.targetConceptId) ?? 0) + 1);
  for (const concept of seed.concepts) {
    const derived = concept.role === "DERIVED" || concept.role === "INTERMEDIATE";
    if (derived && !formulas.has(concept.conceptId)) diagnostics.push(error("REACHABILITY", `Derived/intermediate concept has no active formula family: ${concept.conceptId}`, { conceptId: concept.conceptId }));
    if (concept.role === "PRIMITIVE_INPUT" && formulas.has(concept.conceptId)) diagnostics.push(error("REACHABILITY", `Primitive input has an active derived formula family: ${concept.conceptId}`, { conceptId: concept.conceptId }));
  }
}

function stageConsistency(seed: SeedManifest, diagnostics: Diagnostic[]) {
  const ids = new Set(seed.concepts.map((concept) => concept.conceptId));
  for (const constraint of seed.constraints) for (const conceptId of constraint.referencedConceptIds ?? []) if (!ids.has(conceptId)) diagnostics.push(error("CONSISTENCY", `Constraint references unknown concept: ${conceptId}.`, { relatedObjects: [constraint.constraintId, conceptId] }));
  for (const concept of seed.concepts) for (const dimension of concept.applicability?.requiredDimensions ?? []) if (!VALID_CONTEXT_DIMENSIONS.has(dimension)) diagnostics.push(error("CONSISTENCY", `Unknown applicability context dimension: ${dimension}.`, { conceptId: concept.conceptId }));
}

export function compileOntology(seed: SeedManifest) {
  const diagnostics: Diagnostic[] = [];
  stageLexical(seed, diagnostics); stageContext(seed, diagnostics); stageReferences(seed, diagnostics); stageDependencies(seed, diagnostics); stageTypes(seed, diagnostics); stageResolution(seed, diagnostics); stageReachability(seed, diagnostics); stageConsistency(seed, diagnostics);
  if (diagnostics.some((diagnostic) => diagnostic.severity === "ERROR")) return { diagnostics };
  const unsigned = { releaseId: `ontrel_${seed.manifestId}`, semanticVersion: seed.semanticVersion, ontologyVersion: seed.ontologyVersion, compilerVersion: COMPILER_VERSION, publishedAt: "", effectiveDuring: seed.effectiveDuring ?? { start: "2026-01-01", boundarySemantics: "[start,end)" }, concepts: seed.concepts, relationships: seed.relationships, formulaFamilies: seed.formulaFamilies, constraints: seed.constraints, sourceReferences: seed.sourceReferences };
  try {
    const artifactHash = `sha256:${createHash("sha256").update(stable(unsigned)).digest("hex")}`;
    return { artifact: { ...unsigned, artifactHash }, diagnostics };
  } catch (cause) {
    diagnostics.push(error("ARTIFACT", cause instanceof Error ? cause.message : "Failed to serialize release artifact."));
    return { diagnostics };
  }
}
