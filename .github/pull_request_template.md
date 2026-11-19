## Summary of Changes
Provide a clear, concise summary of the changes introduced in this pull request and link relevant issue/spec tickets.

- **Module / Subsystem**:
- **Requirements Addressed**: `FR-X.X` / `NFR-X.X`
- **Related Issue**: #

## Architectural & Security Compliance Checklist
- [ ] **Multi-Tenant Isolation**: Verified all new queries and mutations strictly enforce `org_id` isolation or active session scope.
- [ ] **Cryptographic Boundaries**: Verified zero server-side exposure of unencrypted plaintext bodies or secret keys.
- [ ] **Input Sanitization**: Verified all request DTOs apply `class-validator` rules and strict type constraints.
- [ ] **Type-Safety & Build**: Ran `npm --prefix apps/api run build` and `npm --prefix apps/web run build` with zero compiler errors.
- [ ] **Test Coverage**: Added or updated automated unit/integration tests with 100% pass rate.
- [ ] **No ASCII Mock Icons**: Vector SVG / Lucide icons only.

## Verification Evidence
Provide exact terminal commands or automated test output proving verification:
```bash
# Example verification command
npm --prefix apps/api run test
```
