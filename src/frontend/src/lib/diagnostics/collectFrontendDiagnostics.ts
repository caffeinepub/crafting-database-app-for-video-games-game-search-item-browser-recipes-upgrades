import { usePreflightDiagnosticsStore } from '../../state/preflightDiagnosticsStore';

export interface FrontendDiagnostics {
  timestamp: number;
  url: string;
  buildMode: string;
  userAgent: string;
  build: {
    version?: string;
    timestamp?: string;
    gitCommit?: string;
    mode: string;
  };
  environment: {
    mode: string;
    dev: boolean;
    prod: boolean;
  };
  runtime: {
    platform: string;
    language: string;
    cookiesEnabled: boolean;
    onLine: boolean;
  };
  preflight: {
    status: string;
    timestamp?: number;
    actorAvailable: boolean;
    results: Array<{
      method: string;
      status: string;
      error?: string;
    }>;
    summary: {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
    };
  };
}

export function collectFrontendDiagnostics(): FrontendDiagnostics {
  const preflightState = usePreflightDiagnosticsStore.getState().state;
  
  const passedCount = preflightState.results.filter(r => r.status === 'pass').length;
  const failedCount = preflightState.results.filter(r => r.status === 'fail').length;
  const skippedCount = preflightState.results.filter(r => r.status === 'skipped').length;
  
  // Extract build metadata from environment variables
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || import.meta.env.VITE_APP_VERSION;
  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;
  const gitCommit = import.meta.env.VITE_GIT_COMMIT;
  
  return {
    timestamp: Date.now(),
    url: window.location.href,
    buildMode: import.meta.env.MODE || 'unknown',
    userAgent: navigator.userAgent,
    build: {
      version: buildVersion,
      timestamp: buildTimestamp,
      gitCommit: gitCommit,
      mode: import.meta.env.MODE || 'unknown',
    },
    environment: {
      mode: import.meta.env.MODE || 'unknown',
      dev: import.meta.env.DEV || false,
      prod: import.meta.env.PROD || false,
    },
    runtime: {
      platform: navigator.platform || 'unknown',
      language: navigator.language || 'unknown',
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    },
    preflight: {
      status: preflightState.status,
      timestamp: preflightState.timestamp,
      actorAvailable: preflightState.actorAvailable,
      results: preflightState.results,
      summary: {
        total: preflightState.results.length,
        passed: passedCount,
        failed: failedCount,
        skipped: skippedCount,
      },
    },
  };
}

export function formatDiagnosticsForClipboard(diagnostics: FrontendDiagnostics): string {
  return JSON.stringify(diagnostics, null, 2);
}
