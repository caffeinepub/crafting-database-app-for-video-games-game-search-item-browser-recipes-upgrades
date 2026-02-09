import { useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { usePreflightDiagnosticsStore, type PreflightMethodResult } from '../state/preflightDiagnosticsStore';

/**
 * Production preflight hook that performs non-blocking connectivity checks
 * on initial app load to verify backend actor methods are accessible.
 * Records structured diagnostics in the preflight store for display in the Diagnostics UI.
 * 
 * Hardened to avoid false-negative failures: methods that return null/empty arrays
 * for non-existent IDs are considered successful connectivity checks.
 */
export function useProductionPreflight() {
  const { actor } = useActor();
  const hasRun = useRef(false);
  const { setRunning, setSkipped, setComplete } = usePreflightDiagnosticsStore();

  useEffect(() => {
    // Only run once on initial mount
    if (hasRun.current) return;
    
    // If no actor, mark as skipped
    if (!actor) {
      if (!hasRun.current) {
        setSkipped();
      }
      return;
    }
    
    hasRun.current = true;
    setRunning();

    const runPreflight = async () => {
      const results: PreflightMethodResult[] = [];

      // Test method with expected result validation
      const testMethod = async (
        methodName: string, 
        testFn: () => Promise<any>,
        validateResult?: (result: any) => boolean
      ) => {
        try {
          const result = await testFn();
          
          // If validator provided, use it; otherwise any non-throw is success
          const isValid = validateResult ? validateResult(result) : true;
          
          if (isValid) {
            results.push({ method: methodName, status: 'pass' });
            console.log(`[Preflight] ${methodName}: PASS`);
          } else {
            results.push({ 
              method: methodName, 
              status: 'fail',
              error: 'Unexpected result format' 
            });
            console.warn(`[Preflight] ${methodName}: FAIL - Unexpected result format`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.push({ 
            method: methodName, 
            status: 'fail',
            error: errorMessage 
          });
          console.warn(`[Preflight] ${methodName}: FAIL -`, errorMessage);
        }
      };

      try {
        // Test catalog methods (these should return arrays, possibly empty)
        await testMethod(
          'getCatalogGames', 
          () => actor.getCatalogGames(),
          (result) => Array.isArray(result)
        );
        
        await testMethod(
          'getCatalogGame', 
          () => actor.getCatalogGame('preflight-test-id'),
          (result) => result === null || (typeof result === 'object' && result !== null)
        );

        // Test crafting game methods (these should return arrays/null, possibly empty)
        await testMethod(
          'getGames', 
          () => actor.getGames(),
          (result) => Array.isArray(result)
        );
        
        await testMethod(
          'getGame', 
          () => actor.getGame('preflight-test-id'),
          (result) => result === null || (typeof result === 'object' && result !== null)
        );
        
        await testMethod(
          'getItems', 
          () => actor.getItems('preflight-test-id'),
          (result) => Array.isArray(result)
        );
        
        await testMethod(
          'getItem', 
          () => actor.getItem('preflight-test-game-id', 'preflight-test-item-id'),
          (result) => result === null || (typeof result === 'object' && result !== null)
        );
        
        await testMethod(
          'getItemsByCategory', 
          () => actor.getItemsByCategory('preflight-test-id', 'food' as any),
          (result) => Array.isArray(result)
        );
        
        await testMethod(
          'getUpdateStatus', 
          () => actor.getUpdateStatus('preflight-test-id'),
          (result) => result === null || (typeof result === 'object' && result !== null)
        );

        // Store results in the diagnostics store
        setComplete(results);

        // Log summary
        const passedChecks = results.filter(r => r.status === 'pass').length;
        const totalChecks = results.length;
        
        console.log('[Preflight] Backend connectivity check complete:', {
          passed: passedChecks,
          total: totalChecks,
          details: results,
        });

        if (passedChecks < totalChecks) {
          console.warn('[Preflight] Some backend methods are not accessible. This may indicate network issues or backend unavailability.');
        }
      } catch (error) {
        console.error('[Preflight] Unexpected error during preflight checks:', error);
        setComplete(results);
      }
    };

    // Run preflight asynchronously without blocking
    runPreflight();
  }, [actor, setRunning, setSkipped, setComplete]);
}
