# Specification

## Summary
**Goal:** Promote the currently deployed draft release (Draft Version 2) to production so production serves the same reviewed functionality.

**Planned changes:**
- Create a production deployment from the current draft (Draft Version 2).
- Run a pre-production verification pass for backend canister availability and production-frontend API connectivity to the Motoko actor methods used by the UI.
- Validate production navigation and rendering for core routes: game search/list, game detail, and item detail pages; ensure no draft/review-only messaging appears.

**User-visible outcome:** The production app loads successfully and users can browse game lists/search, open game details, and view item details in production without runtime errors or draft-only banners.
