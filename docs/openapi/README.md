# docs/openapi

HTTP contracts and OpenAPI assets.

Read first:

1. `v1/support-api.json`

## Backward compatibility

- The current versioned contract is `docs/openapi/v1/support-api.json`.
- The compatibility baseline in CI is the same file on the PR base branch or
  previous commit.
- A breaking change in v1 must fail the gate and require a new major version.
- Local validation:
  - `npm run openapi:export`
  - `npm run openapi:check`
  - `npm run openapi:compat -- <baseline.json> docs/openapi/v1/support-api.json`

The current contract describes `/health`, `/metrics`, `/api-docs`,
`/api-docs-json`, `POST /api/support/departments` (RF01), and
`PATCH /api/support/departments/{departmentId}` (RF02). RF03–RF13 have no
public endpoint yet.
