# Publish to Production

This document describes the process for promoting the currently deployed draft build to production without rebuilding or modifying the application.

## Overview

Publishing to production is a **promotion-only** operation that takes the exact artifact currently running in the draft environment and deploys it to the production environment. No code changes, rebuilds, or migrations should occur during this step.

## Pre-Publish Checklist

Before publishing, verify the following on the **draft environment**:

1. **Functional Testing**
   - [ ] All routes are accessible (home, game details, item details, diagnostics)
   - [ ] Search functionality works correctly
   - [ ] Navigation between pages functions properly
   - [ ] Deep-linking works (test by accessing a direct URL)
   - [ ] Backend connectivity is healthy (check `/diagnostics` page)

2. **Visual Testing**
   - [ ] UI renders correctly on desktop and mobile viewports
   - [ ] Theme switching (light/dark mode) works properly
   - [ ] Images and assets load correctly
   - [ ] No console errors in browser developer tools

3. **Data Integrity**
   - [ ] Catalog games display correctly
   - [ ] Game details pages show expected data
   - [ ] Item details pages render properly with materials and upgrades

## Publish Process

### Step 1: Confirm Draft Approval
Ensure stakeholders have reviewed and approved the draft build at the draft URL.

### Step 2: Execute Publish Command
The publish operation promotes the current draft artifact to production:

