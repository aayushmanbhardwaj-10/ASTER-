export type ContractVersion = "ASTER-CON-001@1.1";

export type DataClassification =
  | "PUBLIC"
  | "CONFIDENTIAL"
  | "RESTRICTED"
  | "HIGHLY_RESTRICTED";

export type LifecycleState =
  | "ACTIVE"
  | "TOMBSTONED"
  | "RESTRICTED"
  | "PURGED";

export interface ResourceReference {
  readonly resourceType: string;
  readonly resourceId: string;
  readonly contractVersion: ContractVersion;
}

export interface PayloadReference extends ResourceReference {
  readonly resourceType: "PAYLOAD";
  readonly storageClass: string;
  readonly mediaType: string;
  readonly serializationFormat: string;
  readonly contentHash: string;
  readonly byteSize: number;
  readonly schemaVersion: string;
  readonly lifecycleState: LifecycleState;
  readonly classification: DataClassification;
}

export interface FinancialPeriod {
  readonly periodType: string;
  readonly startBoundary: string;
  readonly endBoundary: string;
  readonly boundarySemantics: "[start,end)";
  readonly fiscalLabel?: string;
  readonly fiscalYear?: number;
  readonly fiscalPeriod?: string;
  readonly fiscalCalendar?: string;
}

export interface FiniteFinancialNumber {
  readonly status: "FINITE";
  readonly value: string;
  readonly representation: "DECIMAL" | "INTEGER" | "FLOAT64";
}

export interface NonFiniteFinancialNumber {
  readonly status: "NON_FINITE";
  readonly errorCode: string;
  readonly diagnostic?: string;
}

export type FinancialNumber = FiniteFinancialNumber | NonFiniteFinancialNumber;
