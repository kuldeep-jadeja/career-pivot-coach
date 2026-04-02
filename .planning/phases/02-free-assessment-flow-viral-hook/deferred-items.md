# Deferred Items

## 02-01 Plan Execution

- `npm run lint` reports pre-existing `react/no-unescaped-entities` issues in:
  - `app/(marketing)/methodology/page.tsx`
  - `app/(marketing)/sources/page.tsx`
- `npm run lint` also reports existing type/lint issues in:
  - `data-processing/scripts/download-onet.ts`
  - `lib/db/queries/*`
  - `lib/llm/*`
  - `lib/scoring/*`
- These files were not modified by plan `02-01` and are out-of-scope per execution boundary rules.
