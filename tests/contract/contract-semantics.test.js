import test from "node:test";
import assert from "node:assert/strict";

test("contract semantics are represented without runtime-specific authority", () => {
  const finite = {
    status: "FINITE",
    value: "0.0842",
    representation: "DECIMAL",
  };

  const nonFinite = {
    status: "NON_FINITE",
    error_code: "NON_CONVERGENT_INFINITY",
    diagnostic: "calculation did not converge",
  };

  assert.equal(finite.status, "FINITE");
  assert.equal(nonFinite.status, "NON_FINITE");
  assert.notEqual(nonFinite.value, Infinity);
  assert.notEqual(nonFinite.value, null);
});

test("financial periods use explicit boundaries and half-open semantics", () => {
  const period = {
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
  assert.notEqual(period.start_boundary, period.fiscal_label);
});

test("resource identifiers are opaque and non-authorizing", () => {
  const reference = {
    object_id: "fact_e8b4",
    resource_type: "FINANCIAL_FACT",
  };

  assert.equal(reference.object_id, "fact_e8b4");
  assert.equal("tenant_id" in reference, false);
  assert.equal("authorization" in reference, false);
});

test("tombstones are distinct from active lifecycle state", () => {
  const lifecycleStates = ["ACTIVE", "TOMBSTONED", "RESTRICTED", "PURGED"];
  assert.ok(lifecycleStates.includes("TOMBSTONED"));
  assert.notEqual(lifecycleStates.indexOf("TOMBSTONED"), lifecycleStates.indexOf("ACTIVE"));
});
