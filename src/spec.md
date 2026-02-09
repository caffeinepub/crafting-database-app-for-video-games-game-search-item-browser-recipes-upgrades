# Specification

## Summary
**Goal:** Retry publishing by promoting the currently deployed draft artifact to production.

**Planned changes:**
- Re-run the production publish step as a promotion-only operation (no rebuilds, code/config changes, or migrations).
- Ensure any user-facing publish/status messaging is in English.

**User-visible outcome:** The existing draft build is promoted and published to the production environment without any application changes.
