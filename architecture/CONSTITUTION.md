# ASTER AI — Architectural Constitution

**Status:** FROZEN  
**Version:** 1.0  
**Laws:** 1–164

This document records the architectural laws governing ASTER. Laws are grouped by architectural phase for traceability; later laws refine earlier boundaries and do not silently override them.

## Foundation — Laws 1–6

1. **The ASTER Definition:** ASTER is a domain-specific financial artificial intelligence that explicitly separates probabilistic language processing from deterministic computation, structured financial knowledge, and verifiable data.
2. **Fluent ≠ Correct:** ASTER must never conflate conversational fluency or model confidence with factual accuracy, mathematical correctness, or financial truth.
3. **Insight Over Recommendation:** ASTER provides verifiable financial analysis, scenario evaluation, and decision support, but must explicitly stop short of issuing autonomous, unverified, or unrestricted investment recommendations.
4. **Domain-First Identity:** ASTER optimizes for executing structured financial tasks and analytical workflows, not for generic chatbot interaction or conversational continuation.
5. **The Epistemic Firewall:** ASTER must explicitly distinguish between observed facts, deterministic calculations, user assumptions, and model-generated inferences, never silently promoting a hypothesis to an established fact.
6. **Extraction Precedes Calculation:** Accurate deterministic financial calculation relies entirely on the flawless extraction and semantic normalization of input data; calculation engines must not execute on unverified or ambiguously extracted inputs.

## Financial Intelligence — Laws 7–10

7. **Context Before Interpretation**
8. **Master Knowledge ≠ Instance Knowledge**
9. **Preserve Historical Knowledge States**
10. **Semantics ≠ Execution**

## Trust & Epistemics — Laws 11–19

11. **Evidence Before Assertion**
12. **Uncertainty Must Propagate**
13. **Transparent Normalization, Explicit Analytical Modification**
14. **Verification Is Claim-Specific**
15. **Provenance Is Part of the Result**
16. **Controlled Refusal & Graceful Substitution**
17. **Authority Does Not Imply Correctness**
18. **Verify Inputs, Not Identical Arithmetic**
19. **Reversible Analytical Transformation**

## Language, Framework & Runtime — Laws 20–31

20. **Language by Responsibility**
21. **Compute Where the Data and Algorithm Belong**
22. **Cognitive Orchestration Separation**
23. **Contract Before Implementation**
24. **Push-Down Computation**
25. **Dimensional Integrity**
26. **Frameworks Are Boundaries, Not Domains:** ASTER's backend frameworks must provide transport, lifecycle, validation, and application infrastructure without owning financial semantics, calculation logic, epistemic logic, or reasoning logic. Domain behavior must remain framework-independent and independently testable.
27. **Streaming Is a First-Class Execution Mode**
28. **Protected Intelligence Boundary**
29. **Authoritative State Ownership**
30. **Event After Commit**
31. **Resource-Separated Workers**

## Storage & System of Record — Laws 32–43

32. **Financial System of Record**
33. **Binary/Structured Separation**
34. **Temporal Fact Preservation**
35. **Database Computation Boundary**
36. **Specialized Storage Requires Evidence**
37. **One Source of Financial Truth**
38. **Canonical Facts, Optimized Projections**
39. **Immutable Analytical State**
40. **Snapshot / Delta Branching**
41. **Tenant-Aware Retrieval**
42. **Redis Is Transport, Not Truth**
43. **Durable Events Before Broadcast**

## AI & Cognitive Runtime — Laws 44–65

44. **LLM Is Not Financial Authority**
45. **Tool Authority**
46. **No Arbitrary Data Access**
47. **Deterministic Calculation Authority**
48. **Evidence-Bound Generation**
49. **Epistemics Are Context**
50. **Model Agnosticism**
51. **Execution Graph Separation**
52. **Conversation Is Not Truth**
53. **Inline Evidence Governance**
54. **Context Budget & Dynamic Acquisition**
55. **Probabilistic Semantic Interpretation**
56. **Progressive Cognitive Escalation**
57. **Data Classification Before Inference**
58. **Model Endpoint Policy**
59. **Structure Before Multimodal Interpretation**
60. **Explicit Execution State**
61. **Hybrid Financial Retrieval**
62. **Retrieval Models Are Evaluated, Not Assumed**
63. **Context Eviction**
64. **Model Registry**
65. **Model Selection Is Constraint-Based**

## Data Engine — Laws 66–83

66. **Raw Data Preservation**
67. **Acquisition ≠ Interpretation**
68. **Canonical Observation Context**
69. **Point-in-Time Integrity**
70. **Revisions Are New States**
71. **Data Quality Is Multi-Dimensional**
72. **Freshness Is Contextual**
73. **Transformation Provenance**
74. **User Data Is Scoped**
75. **Licensing Is Part of Data Identity**
76. **Intelligence Cannot Mutate Truth**
77. **Global Identity**
78. **Entity / Security Separation**
79. **Raw Market Immutability**
80. **Point-in-Time Provenance**
81. **Extension Resolution**
82. **Rights-Aware Lineage**
83. **Observation ≠ Representation**

## Calculation Engine — Laws 84–97

84. **Deterministic Calculation Authority**
85. **Controlled Numeric Semantics**
86. **Boundary Dimensional Integrity**
87. **Currency Transformation Explicitness**
88. **Formula / Execution Separation**
89. **Model Implementation Versioning**
90. **Calculation as Artifact**
91. **Immutable Calculation Inputs**
92. **Model-Level Dependency Integrity**
93. **Numerical Failure Transparency**
94. **Reproducible Stochastic Computation**
95. **Calculation Verification**
96. **Stale Calculation Prevention**
97. **Model Execution Isolation**

## Retrieval & Evidence — Laws 98–117

98. **Retrieval Is Evidence Acquisition**
99. **Canonical Truth Precedes Retrieval Indexes**
100. **Hybrid Retrieval**
101. **Structure Before Chunking**
102. **Tables Preserve Structure**
103. **Context-Constrained Retrieval**
104. **Required Evidence Before Retrieval**
105. **Hard Constraints Before Ranking**
106. **Evidence Sufficiency**
107. **Conflicts Are Evidence**
108. **Point-in-Time Retrieval**
109. **Retrieval Reproducibility**
110. **Retrieval Failure Transparency**
111. **Authorized Evidence Boundary**
112. **Evidence Registry Continuity**
113. **Evidence Snapshot Immutability**
114. **Runtime Identity Separation**
115. **Context Cache Is Not Truth**
116. **Context Recompilation Independence**
117. **Citation Governance**

## Verification & Trust — Laws 118–142

118. **Verification Is Not Evaluation**
119. **Claim-Centric Verification**
120. **Epistemic, Verification, and Trust Separation**
121. **Deterministic Verification First**
122. **No LLM-Only Verification**
123. **Claim-Type Appropriate Verification**
124. **Verification Artifacts**
125. **Evidence-Derived Trust**
126. **No False Precision**
127. **Financial Invariants**
128. **Behavioral Testing**
129. **Adversarial Financial Testing**
130. **Evaluation Reproducibility**
131. **Production Is Not Automatically Ground Truth**
132. **Materiality-Aware Verification**
133. **Bounded Verification**
134. **Output Governance**
135. **Controlled Human Review**
136. **Span-Level Trust**
137. **Support Does Not Equal Verification**
138. **Reported Causality Is Distinct From Inferred Causality**
139. **Governance Precedes High-Risk Rendering**
140. **Contradiction Must Be Observable**
141. **Claim Support Is Relational**
142. **Runtime Verification Must Be Reproducible**

## Infrastructure & Security — Laws 143–164

143. **Infrastructure Mirrors Authority Boundaries**
144. **Independent Workload Isolation**
145. **Authoritative Data Independence**
146. **Binary Data Separation**
147. **Durable Job State**
148. **Idempotent Execution**
149. **Bounded Resource Consumption**
150. **Controlled Execution Environment**
151. **Immutable Environment Identity**
152. **Graceful Degradation**
153. **No Silent Degradation**
154. **Infrastructure Least Privilege**
155. **Versioned Infrastructure**
156. **Tested Recovery**
157. **Historical Execution Preservation**
158. **Evaluation-Gated Deployment**
159. **Correlated Observability**
160. **Production Feedback Does Not Rewrite History**
161. **Zero-Trust Tenant Isolation:** Every tenant-scoped operation must execute within an authenticated, authorized, and explicitly scoped execution context. Tenant isolation must be enforced independently at the application, data, retrieval, object-storage, transport, and execution layers, with PostgreSQL RLS serving as a final database enforcement boundary rather than trusting worker-supplied tenant identity.
162. **Classification-Bound Egress:** External data egress must be governed by the classification and provenance of the information being transmitted, the security policy of the destination endpoint, and applicable workspace policies. Restricted evidence must never reach an unauthorized inference or external service endpoint.
163. **Cryptographic Data Destruction:** Highly restricted tenant data must support cryptographically enforced protection and, where appropriate, cryptographic destruction through tenant-scoped key management, combined with logical deletion, access revocation, retention policies, backup lifecycle controls, and auditable deletion procedures.
164. **Immutable Security Audit:** Security events, privileged access, authorization decisions, and material data mutations must produce append-only, tamper-resistant audit records outside the authoritative application-state boundary. Audit records must themselves be access-controlled, minimized, retained according to policy, and independently protected from application-level modification or deletion.

## Constitutional Interpretation

Later laws refine implementation boundaries without silently invalidating earlier laws. Where laws appear to overlap, they should be treated as layered enforcement of the same invariant. Where implementation choices remain explicitly evaluation-dependent, they must not be promoted to architectural commitments without review and re-freezing.
