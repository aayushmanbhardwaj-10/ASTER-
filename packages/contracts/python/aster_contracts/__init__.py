"""Python representation of ASTER-CON-001 domain contracts.

This package is a language-specific projection of the canonical contract semantics.
It must not introduce framework-specific or authority-specific behavior.
"""

from dataclasses import dataclass
from typing import Literal

ContractVersion = Literal["ASTER-CON-001@1.1"]
DataClassification = Literal["PUBLIC", "CONFIDENTIAL", "RESTRICTED", "HIGHLY_RESTRICTED"]
LifecycleState = Literal["ACTIVE", "TOMBSTONED", "RESTRICTED", "PURGED"]


@dataclass(frozen=True)
class ResourceReference:
    resource_type: str
    resource_id: str
    contract_version: ContractVersion


@dataclass(frozen=True)
class FinancialPeriod:
    period_type: str
    start_boundary: str
    end_boundary: str
    boundary_semantics: Literal["[start,end)"] = "[start,end)"
    fiscal_label: str | None = None
    fiscal_year: int | None = None
    fiscal_period: str | None = None
    fiscal_calendar: str | None = None
