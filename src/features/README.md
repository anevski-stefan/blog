# `src/features`

Feature-first modules live here (domain code + UI that primarily belongs to a
single route/area).

**Convention**

- `src/features/<feature>/components/**` — feature-specific React components
- `src/features/<feature>/actions/**` — server actions for that feature
- `src/features/<feature>/lib/**` — feature utilities (formatters, selectors)
- `src/features/<feature>/types/**` — feature types
- `src/features/<feature>/data/**` — feature static data (if applicable)

**Shared code stays out of features**

- Reusable UI primitives: `src/components/ui/**`
- Shared, cross-feature components: `src/components/shared/**`
