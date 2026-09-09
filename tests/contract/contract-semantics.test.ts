import test from "node:test";
import assert from "node:assert/strict";

import {
  ContractVersion,
  FinancialNumber,
  FinancialPeriod,
  LifecycleState,
  ResourceReference,
} from "../../packages/contracts/src/index.js";

test("contract version remains frozen at ASTER-CON-001@1.1", () => {
  assert.equal(ContractVersion, "ASTER-CON-001@1.1");
});

test("financial numbers reject bare non-finite numeric semantics", () => {
  const finite: FinancialNumber = {
    status: "FINITE",
    value: "0.0842",
    representation: "DECIMAL",
  };

  const nonFinite: FinancialNumber = {
    status: "NON_FINITE",
    error_code: "NON_CONVERGENT_INFINITY",
    diagnostic: "calculation did not converge",
  };

  assert.equal(finite.status, "FINITE");
  assert.equal(nonFinite.status, "NON_FINITE");
  assert.notEqual((nonFinite as Record<string, unknown>).value, Infinity);
  assert.notEqual((nonFinite as Record<string, unknown>).value, null);
});

test("financial periods require explicit boundaries", () => {
  const period: FinancialPeriod = {
    period_type: "FISCAL_YEAR",
    start_boundary: "2023-10-01",
    end_boundary: "2024-10-01",
    boundary_semantics: "[start,end)",
    fiscal_label: "FY2023",
    fiscal_year: 2023,
    fiscal_calendar: "issuer_calendar_v1",
  };

  assert.equal(period.start_boundary, "2023-10-01");
  assert.equal(period.end_boundary, "2024-10-01");
  assert.equal(period.boundary_semantics, "[start,end)");
});

test("resource identifiers are opaque and non-authorizing", () => {
  const reference: ResourceReference = {
    object_id: "fact_e8b4",
    resource_type: "FINANCIAL_FACT",
  };

  assert.equal(reference.object_id, "fact_e8b4");
  assert.equal("tenant_id" in reference, false);
  assert.equal("authorization" in reference, false);
});

test("tombstone lifecycle remains distinct from active state", () => {
  assert.ok(LifecycleState.includes("TOMBSTONED"));
  assert.notEqual(LifecycleState.indexOf("TOMBSTONED"), LifecycleState.indexOf("ACTIVE"));
});
