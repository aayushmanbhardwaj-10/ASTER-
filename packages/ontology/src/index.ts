/**
 * ASTER Financial Ontology — Phase 1 canonical semantic contracts.
 *
 * These contracts describe financial meaning and compilation inputs. They contain
 * no database, framework, retrieval, LLM, or executable financial-model logic.
 */

export type OntologyVersion = string;
export type ConceptId = string;
export type FormulaId = string;
export type FormulaVariantId = string;
export type SourceReferenceId = string;
export type ConstraintId = string;

export type OntologyStatus =
  | "PROPOSED"
  | "DRAFT"
  | "RELEASE_CANDIDATE"
  | "ACTIVE"
  | "DEPRECATED"
  | "SUPERSEDED"
  | "RETIRED";

export type ConceptRealm = "REPORTING" | "ANALYTICAL" | "BOTH";
export type ConceptRole =
  | "ROOT"
  | "METRIC"
  | "PRIMITIVE_INPUT"
  | "INTERMEDIATE"
  | "DERIVED"
  | "TAXONOMIC";

export type ContextDimension =
  | "ACCOUNTING_FRAMEWORK"
  | "JURISDICTION"
  | "INDUSTRY"
  | "ENTITY_TYPE"
  | "REPORTING_BASIS"
  | "SECURITY_CLASS"
  | "CURRENCY"
  | "ECONOMIC_TIME"
  | "PUBLICATION_TIME"
  | "KNOWLEDGE_TIME"
  | "ONTOLOGY_TIME";

export interface DateInterval {
  start: string;
  end?: string;
  boundarySemantics: "[start,end)" | "[start,end]" | "(start,end)" | "(start,end]";
}

export interface ApplicabilityContext {
  requiredDimensions: readonly ContextDimension[];
  accountingFramework?: string;
  jurisdiction?: string;
  industry?: string;
  entityType?: string;
  reportingBasis?: string;
  securityClass?: string;
  currency?: string;
  economicTime?: DateInterval;
}

export type AliasKind =
  | "ACRONYM"
  | "COMMON_TERM"
  | "REGIONAL_TERM"
  | "HISTORICAL_LABEL"
  | "ISSUER_TERM"
  | "SPELLING_VARIANT";

export interface ConceptAlias {
  value: string;
  normalizedValue: string;
  kind: AliasKind;
  applicability?: ApplicabilityContext;
  validDuring?: DateInterval;
  status?: OntologyStatus;
}

export type RelationshipType =
  | "IS_A"
  | "PART_OF"
  | "DERIVED_FROM"
  | "CALCULATED_FROM"
  | "DEPENDS_ON"
  | "AFFECTS"
  | "CONSTRAINS"
  | "CONTRADICTS"
  | "PRECEDES"
  | "SUBSTITUTE_FOR"
  | "RELATED_TO"
  | "MEASURED_BY"
  | "APPLIES_TO"
  | "DEFINED_BY"
  | "SUPERSEDED_BY";

export interface ConceptRelationship {
  relationshipId: string;
  sourceConceptId: ConceptId;
  targetConceptId: ConceptId;
  type: RelationshipType;
  applicability?: ApplicabilityContext;
  validDuring?: DateInterval;
  ontologyVersion: OntologyVersion;
  sourceReferences: readonly SourceReferenceId[];
  status: OntologyStatus;
}

export type UnitDimension =
  | "CURRENCY_AMOUNT"
  | "RATE"
  | "RATIO"
  | "COUNT"
  | "DURATION"
  | "PRICE"
  | "YIELD"
  | "PROBABILITY"
  | "SHARE_QUANTITY"
  | "INDEX_LEVEL"
  | "DIMENSIONLESS";

export type MeasureSemantics =
  | "FLOW"
  | "STOCK"
  | "POINT_IN_TIME"
  | "RATE"
  | "RATIO"
  | "COUNT"
  | "DURATION";

export type SignRepresentation = "DIRECTIONAL" | "ABSOLUTE_MAGNITUDE";
export type EconomicPolarity =
  | "INFLOW"
  | "OUTFLOW"
  | "EXPENSE"
  | "BENEFIT"
  | "NEUTRAL";

export interface SignSemantics {
  representation: SignRepresentation;
  economicPolarity: EconomicPolarity;
  normalizationPolicy: string;
}

export interface UnitSemantics {
  dimension: UnitDimension;
  canonicalUnit?: string;
  currencyRequired: boolean;
  measureSemantics?: MeasureSemantics;
}

export interface SemanticConstraint {
  constraintId: ConstraintId;
  kind: "APPLICABILITY" | "DOMAIN" | "DIMENSION" | "TEMPORAL" | "SIGN" | "OTHER";
  description: string;
  referencedConceptIds: readonly ConceptId[];
  applicability?: ApplicabilityContext;
}

export type TemporalRelation =
  | "CURRENT_PERIOD"
  | "PRIOR_COMPARABLE_PERIOD"
  | "FORECAST_PERIOD"
  | "TERMINAL_PERIOD"
  | "POINT_IN_TIME"
  | "SAME_PERIOD"
  | "OFFSET_FROM_ANCHOR";

export interface TemporalBinding {
  relation: TemporalRelation;
  anchor?: string;
  offset?: number;
  alignment?: "PERIOD_END" | "PERIOD_START" | "MID_PERIOD" | "EXACT_DATE";
  granularity?: "DAY" | "MONTH" | "QUARTER" | "YEAR" | "EVENT";
  calendar?: string;
}

export type ExpressionNode =
  | { kind: "CONSTANT"; value: string; unitSemantics?: UnitSemantics }
  | { kind: "INPUT"; inputName: string }
  | { kind: "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE"; left: ExpressionNode; right: ExpressionNode }
  | { kind: "POWER"; base: ExpressionNode; exponent: ExpressionNode }
  | { kind: "NEGATE"; operand: ExpressionNode };

export interface FormulaInput {
  name: string;
  conceptId: ConceptId;
  semanticRole: string;
  required: boolean;
  unitSemantics: UnitSemantics;
  signSemantics?: SignSemantics;
  temporalBinding?: TemporalBinding;
}

export interface FormulaVariant {
  variantId: FormulaVariantId;
  formulaId: FormulaId;
  version: string;
  familyId: string;
  targetConceptId: ConceptId;
  fidelityRank: number;
  semanticDefinition: string;
  semanticExpression: string;
  expression: ExpressionNode;
  inputs: readonly FormulaInput[];
  outputUnitSemantics: UnitSemantics;
  constraints: readonly ConstraintId[];
  assumptions: readonly string[];
  applicableContext?: ApplicabilityContext;
  provenance: readonly SourceReferenceId[];
  status: OntologyStatus;
}

export interface FormulaFamily {
  familyId: string;
  targetConceptId: ConceptId;
  variants: readonly FormulaVariant[];
  solutionVariants?: readonly FormulaVariant[];
}

export interface KnowledgeSourceReference {
  sourceReferenceId: SourceReferenceId;
  sourceType:
    | "STANDARD_SETTER"
    | "REGULATOR"
    | "ACCOUNTING_FRAMEWORK"
    | "TEXTBOOK"
    | "ASTER_CURATED"
    | "OTHER_APPROVED";
  publisher: string;
  title?: string;
  locator?: string;
  authorityClass?: string;
  effectiveDuring?: DateInterval;
}

export interface FinancialConcept {
  conceptId: ConceptId;
  conceptVersion: OntologyVersion;
  canonicalName: string;
  definition: string;
  realm: ConceptRealm;
  role: ConceptRole;
  domainTags: readonly string[];
  classificationTags: readonly string[];
  status: OntologyStatus;
  applicability: ApplicabilityContext;
  aliases: readonly ConceptAlias[];
  relationships: readonly ConceptRelationship[];
  unitSemantics: UnitSemantics;
  signSemantics?: SignSemantics;
  constraints: readonly SemanticConstraint[];
  formulaFamilies: readonly FormulaFamily[];
  sourceReferences: readonly SourceReferenceId[];
  effectiveDuring: DateInterval;
}

export interface OntologyReleaseArtifact {
  releaseId: string;
  semanticVersion: string;
  ontologyVersion: string;
  artifactHash: string;
  compilerVersion: string;
  authoringCompilerVersion?: string;
  parentReleaseId?: string;
  publishedAt: string;
  effectiveDuring: DateInterval;
  concepts: readonly FinancialConcept[];
  relationships: readonly ConceptRelationship[];
  formulaFamilies: readonly FormulaFamily[];
  constraints: readonly SemanticConstraint[];
  sourceReferences: readonly KnowledgeSourceReference[];
}
