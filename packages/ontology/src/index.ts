/**
 * ASTER Financial Ontology — Phase 1 core contracts.
 *
 * This package describes financial meaning. It intentionally contains no
 * database, framework, retrieval, LLM, or executable financial-model logic.
 */

export type OntologyVersion = string;
export type ConceptId = string;
export type FormulaId = string;
export type SourceReferenceId = string;

export type OntologyStatus =
  | "ACTIVE"
  | "DEPRECATED"
  | "SUPERSEDED"
  | "EXPERIMENTAL";

export type ContextDimension =
  | "ACCOUNTING_FRAMEWORK"
  | "JURISDICTION"
  | "INDUSTRY"
  | "ENTITY_TYPE"
  | "REPORTING_BASIS"
  | "SECURITY_CLASS"
  | "CURRENCY"
  | "ECONOMIC_TIME"
  | "ONTOLOGY_TIME";

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

export interface DateInterval {
  start: string;
  end?: string;
  boundarySemantics: "[start,end)" | "[start,end]" | "(start,end)" | "(start,end]";
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
  | "DEFINED_BY";

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
  | "DIMENSIONLESS"
  | "OTHER";

export interface UnitSemantics {
  dimension: UnitDimension;
  canonicalUnit?: string;
  currencyRequired: boolean;
}

export interface SemanticConstraint {
  constraintId: string;
  kind: "APPLICABILITY" | "DOMAIN" | "DIMENSION" | "TEMPORAL" | "OTHER";
  description: string;
  referencedConceptIds: readonly ConceptId[];
  applicability?: ApplicabilityContext;
}

export interface FormulaInput {
  name: string;
  conceptId: ConceptId;
  required: boolean;
  unitSemantics?: UnitSemantics;
}

export interface SemanticFormulaSpecification {
  formulaId: FormulaId;
  version: string;
  semanticDefinition: string;
  inputs: readonly FormulaInput[];
  outputConceptId: ConceptId;
  outputUnitSemantics?: UnitSemantics;
  constraints: readonly SemanticConstraint[];
  assumptions: readonly string[];
  applicableContext?: ApplicabilityContext;
  implementationRef?: string;
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
  category: string;
  status: OntologyStatus;
  applicability: ApplicabilityContext;
  aliases: readonly ConceptAlias[];
  relationships: readonly ConceptRelationship[];
  unitSemantics?: UnitSemantics;
  constraints: readonly SemanticConstraint[];
  formulaSpecification?: SemanticFormulaSpecification;
  sourceReferences: readonly SourceReferenceId[];
  effectiveDuring: DateInterval;
}

export interface OntologyRelease {
  ontologyVersion: OntologyVersion;
  releaseId: string;
  publishedAt: string;
  effectiveDuring: DateInterval;
  concepts: readonly FinancialConcept[];
  relationships: readonly ConceptRelationship[];
  sourceReferences: readonly KnowledgeSourceReference[];
}
