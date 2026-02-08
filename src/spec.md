# Specification

## Summary
**Goal:** Build a crafting database app for video games where users can search for a game, browse craftable items (with recipes, upgrades, and values), and refresh game data from configurable HTTPS/JSON sources.

**Planned changes:**
- Create and persist a Motoko backend data model for Games and Craftable Items, including materials/quantities, upgrade paths, and flexible value fields, with upgrade-safe stable storage.
- Implement backend query APIs to list/search games, get game details, list/search/filter items by game (name + category), and fetch full item details without frontend-side joining.
- Add per-game remote JSON source configuration and a backend update flow to fetch/validate/upsert data, tracking lastUpdated timestamp and success/failure status.
- Build frontend pages for game search/list, game detail with category filters (Food/Tools/Buildings/Other), item list with search, and item detail views for supplies, upgrades, and values.
- Use React Query for all data fetching, loading/error states, and cache invalidation/refetch after manual “Refresh data”.
- Apply a consistent “workshop ledger” visual theme (warm neutrals, paper-like surfaces, subtle ruled accents; avoid blue/purple as primary colors).
- Add and reference static generated theme assets (logo in header/nav; hero/banner on landing page).

**User-visible outcome:** Users can search/select a game, browse and filter its craftable items, view item recipes/upgrades/values, and manually refresh the game’s crafting data from the web while seeing update status and timestamps.
