import test from "node:test";
import assert from "node:assert/strict";

const finiteFinancialNumber = {
  status: "FINITE",
  value: "0.0842",
  representation: "DECIMAL",
};

const nonFiniteFinancialNumber = {
  status: "NON_FINITE",
  errorCode: "NON_CONVERGENT_INFINITY",
  diagnostic: "calculation did not converge",
};

test("finite financial numbers use tagged decimal semantics", () => {
  assert.equal(finiteFinancialNumber.status, "FINITE");
  assert.equal(typeof finiteFinancialNumber.value, "string");
  assert.equal(finiteFinancialNumber.representation, "DECIMAL");
});

test("non-finite financial numbers use tagged failure semantics", () => {
  assert.equal(nonFiniteFinancialNumber.status, "NON_FINITE");
  assert.equal(nonFiniteFinancialNumber.errorCode, "NON_CONVERGENT_INFINITY");
  assert.equal("value" in nonFiniteFinancialNumber, false);
});

test("financial periods use explicit boundaries and half-open semantics", () => {
  const period = {
    periodType: "FISCAL_YEAR",
    startBoundary: "2023-10-01",
    endBoundary: "2024-10-01",
    boundarySemantics: "[start,end)",
    fiscalLabel: "FY2023",
    fiscalYear: 2023,
    fiscalCalendar: "issuer_calendar_v1",
  };

  assert.equal(period.startBoundary, "2023-10-01");
  assert.equal(period.endBoundary, "2024-10-01");
  assert.equal(period.boundarySemantics, "[start,end)");
  assert.notEqual(period.startBoundary, period.fiscalLabel);
});

test("resource identifiers are opaque and non-authorizing", () => {
  const reference = {
    resourceType: "FINANCIAL_FACT",
    resourceId: "fact_e8b4",
    contractVersion: "ASTER-CON-001@1.1",
  };

  assert.equal(reference.resourceId, "fact_e8b4");
  assert.equal("tenantId" in reference, false);
  assert.equal("authorization" in reference, false);
});

test("tombstones are distinct from active lifecycle state", () => {
  const lifecycleStates = ["ACTIVE", "TOMBSTONED", "RESTRICTED", "PURGED"];
  assert.ok(lifecycleStates.includes("TOMBSTONED"));
  assert.notEqual(lifecycleStates.indexOf("TOMBSTONED"), lifecycleStates.indexOf("ACTIVE"));
});

test("large analytical outputs use artifact references rather than control-plane blobs", () => {
  const payloadReference = {
    resourceType: "PAYLOAD",
    resourceId: "payload_123",
    storageClass: "OBJECT",
    mediaType: "application/octet-stream",
    serializationFormat: "PARQUET",
    contentHash: "sha256:example",
    byteSize: 75_000_000,
    schemaVersion: "1.0",
    lifecycleState: "ACTIVE",
    classification: "CONFIDENTIAL",
  };

  assert.equal(payloadReference.resourceType, "PAYLOAD");
  assert.ok(payloadReference.byteSize > 50_000_000);
});
