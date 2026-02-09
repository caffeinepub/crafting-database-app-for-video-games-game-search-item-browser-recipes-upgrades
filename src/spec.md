# Specification

## Summary
**Goal:** Publish (promote) the currently deployed draft build to production without any code or configuration changes.

**Planned changes:**
- Promote the existing draft deployment artifact to production (publish-only; no rebuild).
- Verify production serves the same UI/behavior as the approved draft after publishing.

**User-visible outcome:** The production URL/canister serves the exact same experience as the currently approved draft.
