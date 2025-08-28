---
description: "Run the Sensitive Query Audit and auto‑remediate violations across the codebase"
---
Purpose

- Execute the Sensitive Query Audit and automatically fix any violations found so the codebase complies with the Network & React Query Playbook and Architecture Guardrails.

Primary command to run (Windows PowerShell)

- Use this exact command to run the audit locally or in CI:
  - npx ts-node scripts/audit-sensitive-queries.ts

What Roo must do when this command is invoked

1) Run the audit

   - Execute: npx ts-node scripts/audit-sensitive-queries.ts
   - The script analyzes src/** for sensitive React Query usage and two‑step patterns, and exits non‑zero if violations are found.
   - Script reference: [scripts/audit-sensitive-queries.ts](scripts/audit-sensitive-queries.ts:1)
2) Parse results and apply targeted fixes per violation type

   - missing_meta_persist:
     - Add meta: { persist: false } to the useQuery options for the sensitive query
   - missing_gc_time:
     - Add gcTime: 0 to the same useQuery options
   - has_placeholder_data:
     - Remove placeholderData (and do not replace with keepPreviousData) for sensitive queries
   - unsafe_mutation (direct signed URL usage):
     - Replace any direct signed URL handling (e.g., window.open or window.location without an immediate API refresh) with the two‑step pattern:

       1) Internal API call through the central HTTP client [typescript.http](src/lib/api/client/index.ts:1) to obtain a fresh { signedUrl } with explicit timeoutMs and AbortSignal
       2) External step immediately after:
          - For navigation downloads: window.location.assign(signedUrl)
          - For blob downloads: fetch(signedUrl) with AbortController + hard timeout, then createObjectURL to trigger download

       - Do not cache or persist signed URLs or payloads; do not store in React Query
     - Two‑step examples:

       - [typescript.fetchRawPhase0OutputData()](src/lib/services/phase0OutputService.ts:111)
       - [typescript.downloadPhase0Output()](src/lib/services/phase0OutputService.ts:210)
       - [src/features/canonical-variable-dictionary/components/export-dropdown.tsx](src/features/canonical-variable-dictionary/components/export-dropdown.tsx)
3) Re‑run quality gates

   - TypeScript: npx pnpm exec tsc --noEmit
   - Biome: pnpm exec biome check . --fix --unsafe
   - Re‑run audit until it reports zero violations:
     - npx ts-node scripts/audit-sensitive-queries.ts
4) Acceptance: Zero violations + clean gates

   - Sensitive queries must:
     - Include meta: { persist: false } and gcTime: 0
     - Avoid placeholderData
     - Use the two‑step signed URL pattern
     - Use the central HTTP client for internal API calls with explicit timeoutMs and AbortSignal
   - Realtime and persistence provider settings must not be altered during remediation

Scope and references

- Guardrails and playbooks:
  - [.roo/rules/08-network-client-and-react-query-playbook.md](.roo/rules/08-network-client-and-react-query-playbook.md:1)
  - [.roo/rules/02-architecture-and-quality-guardrails.md](.roo/rules/02-architecture-and-quality-guardrails.md:1)
  - [docs/library-knowledge/tanstack/network-and-query-playbook.md](docs/library-knowledge/tanstack/network-and-query-playbook.md:1)
- Query Key Factory:
  - [typescript.export const queryKeys](src/lib/query/query-keys.ts:1)

Notes

- Use Canadian English for any user‑facing copy you touch.
- Do not modify the persistence provider; it already excludes meta.persist=false queries via dehydrateOptions.
- Keep changes surgical, under 500 LoC per file.
