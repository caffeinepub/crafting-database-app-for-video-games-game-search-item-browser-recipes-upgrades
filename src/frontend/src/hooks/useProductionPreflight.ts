import { useEffect, useRef } from 'react';
import { useActor } from './useActor';

/**
 * Production preflight hook that performs non-blocking connectivity checks
 * on initial app load to verify backend actor methods are accessible.
 * Logs structured diagnostics without affecting UX.
 */
export function useProductionPreflight() {
  const { actor } = useActor();
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once on initial mount
    if (hasRun.current || !actor) return;
    hasRun.current = true;

    const runPreflight = async () => {
      const checks = {
        getCatalogGames: false,
        getCatalogGame: false,
        getGames: false,
        getGame: false,
        getItems: false,
        getItem: false,
        getItemsByCategory: false,
        getUpdateStatus: false,
      };

      try {
        // Test getCatalogGames
        try {
          await actor.getCatalogGames();
          checks.getCatalogGames = true;
        } catch (e) {
          console.warn('[Preflight] getCatalogGames failed:', e);
        }

        // Test getCatalogGame with a test ID
        try {
          await actor.getCatalogGame('test-id');
          checks.getCatalogGame = true;
        } catch (e) {
          console.warn('[Preflight] getCatalogGame failed:', e);
        }

        // Test getGames
        try {
          await actor.getGames();
          checks.getGames = true;
        } catch (e) {
          console.warn('[Preflight] getGames failed:', e);
        }

        // Test getGame with a test ID
        try {
          await actor.getGame('test-id');
          checks.getGame = true;
        } catch (e) {
          console.warn('[Preflight] getGame failed:', e);
        }

        // Test getItems with a test ID
        try {
          await actor.getItems('test-id');
          checks.getItems = true;
        } catch (e) {
          console.warn('[Preflight] getItems failed:', e);
        }

        // Test getItem with test IDs
        try {
          await actor.getItem('test-game-id', 'test-item-id');
          checks.getItem = true;
        } catch (e) {
          console.warn('[Preflight] getItem failed:', e);
        }

        // Test getItemsByCategory with test data
        try {
          await actor.getItemsByCategory('test-id', 'food' as any);
          checks.getItemsByCategory = true;
        } catch (e) {
          console.warn('[Preflight] getItemsByCategory failed:', e);
        }

        // Test getUpdateStatus with a test ID
        try {
          await actor.getUpdateStatus('test-id');
          checks.getUpdateStatus = true;
        } catch (e) {
          console.warn('[Preflight] getUpdateStatus failed:', e);
        }

        // Log summary
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        
        console.log('[Preflight] Backend connectivity check complete:', {
          passed: passedChecks,
          total: totalChecks,
          details: checks,
        });

        if (passedChecks < totalChecks) {
          console.warn('[Preflight] Some backend methods are not accessible. This may indicate network issues or backend unavailability.');
        }
      } catch (error) {
        console.error('[Preflight] Unexpected error during preflight checks:', error);
      }
    };

    // Run preflight asynchronously without blocking
    runPreflight();
  }, [actor]);
}
