# Specification

## Summary
**Goal:** Import and browse an internet-sourced video game discovery library, with a manual refresh workflow and visible import status.

**Planned changes:**
- Extend the backend to store a standalone "video game library" catalog (separate from crafting/item data) and expose queries to list library games and fetch a library game by id.
- Add backend configuration for one or more HTTPS JSON remote data sources and a manual refresh/import operation that validates, upserts by id, persists results, and records update status (idle/inProgress/success/failed with lastUpdated and error message).
- Update the frontend discovery/search experience to display library games, provide a manual refresh/import control, show refresh status (in progress, last updated, error), and invalidate/refetch data after refresh.
- Ensure game detail navigation handles games without crafting data by showing an English empty-state message instead of crashing.

**User-visible outcome:** Users can browse a larger, internet-imported game catalog, manually trigger a library import, see the current import status/last updated/error, and open game details even when crafting data is unavailable.
