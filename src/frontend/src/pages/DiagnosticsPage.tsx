import { useState, useRef } from 'react';
import { usePreflightDiagnosticsStore } from '../state/preflightDiagnosticsStore';
import { collectFrontendDiagnostics, formatDiagnosticsForClipboard } from '../lib/diagnostics/collectFrontendDiagnostics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function DiagnosticsPage() {
  const { state: preflightState } = usePreflightDiagnosticsStore();
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyDiagnostics = async () => {
    try {
      const diagnostics = collectFrontendDiagnostics();
      const formatted = formatDiagnosticsForClipboard(diagnostics);
      
      // Try Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formatted);
        setCopied(true);
        toast.success('Diagnostics copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: show selectable text area
        setShowFallback(true);
        toast.info('Please manually copy the diagnostics below');
      }
    } catch (error) {
      // If Clipboard API fails, show fallback
      setShowFallback(true);
      toast.info('Please manually copy the diagnostics below');
      console.warn('Clipboard API unavailable, showing fallback:', error);
    }
  };

  const handleSelectAll = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      toast.success('Diagnostics text selected - press Ctrl+C (Cmd+C) to copy');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'skipped':
        return <Badge variant="secondary">Skipped</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPreflightStatusIcon = () => {
    switch (preflightState.status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'skipped':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const passedCount = preflightState.results.filter(r => r.status === 'pass').length;
  const failedCount = preflightState.results.filter(r => r.status === 'fail').length;

  // Extract build information from environment
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || import.meta.env.VITE_APP_VERSION;
  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;
  const gitCommit = import.meta.env.VITE_GIT_COMMIT;

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Diagnostics</h1>
          <p className="mt-2 text-muted-foreground">
            Runtime environment details and backend connectivity status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Runtime Environment</CardTitle>
            <CardDescription>Current application runtime configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="font-medium">Current URL:</span>
                <span className="text-muted-foreground font-mono text-sm break-all text-right max-w-md">{window.location.href}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Build Mode:</span>
                <Badge variant="outline">{import.meta.env.MODE || 'unknown'}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Environment:</span>
                <Badge variant={import.meta.env.PROD ? 'default' : 'secondary'}>
                  {import.meta.env.PROD ? 'Production' : 'Development'}
                </Badge>
              </div>
              {buildVersion && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Build Version:</span>
                    <span className="text-muted-foreground font-mono text-sm">{buildVersion}</span>
                  </div>
                </>
              )}
              {buildTimestamp && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Build Time:</span>
                    <span className="text-muted-foreground font-mono text-sm">
                      {new Date(buildTimestamp).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              {gitCommit && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Git Commit:</span>
                    <span className="text-muted-foreground font-mono text-sm">{gitCommit.substring(0, 8)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Backend Connectivity
                  {getPreflightStatusIcon()}
                </CardTitle>
                <CardDescription>
                  Preflight checks for backend actor methods
                </CardDescription>
              </div>
              {preflightState.status === 'complete' && (
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    {passedCount} passed
                  </Badge>
                  {failedCount > 0 && (
                    <Badge variant="destructive">
                      {failedCount} failed
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {preflightState.status === 'idle' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Preflight checks have not run yet</span>
              </div>
            )}

            {preflightState.status === 'running' && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-4 w-4 animate-pulse" />
                <span>Running preflight checks...</span>
              </div>
            )}

            {preflightState.status === 'skipped' && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">
                      Preflight checks skipped
                    </p>
                    <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                      Backend actor was not available during initialization. This may indicate network issues or backend unavailability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {preflightState.status === 'complete' && (
              <div className="space-y-3">
                {preflightState.timestamp && (
                  <div className="text-sm text-muted-foreground">
                    Last checked: {new Date(preflightState.timestamp).toLocaleString()}
                  </div>
                )}
                
                <div className="space-y-2">
                  {preflightState.results.map((result) => (
                    <div
                      key={result.method}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {result.status === 'pass' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {result.status === 'fail' && <XCircle className="h-4 w-4 text-destructive" />}
                          <span className="font-mono text-sm font-medium">{result.method}</span>
                        </div>
                        {result.error && (
                          <p className="mt-1 text-sm text-muted-foreground">{result.error}</p>
                        )}
                      </div>
                      <div>{getStatusBadge(result.status)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Diagnostics</CardTitle>
            <CardDescription>
              Copy diagnostics data to share with the Caffeine team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleCopyDiagnostics} className="w-full sm:w-auto">
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Diagnostics to Clipboard
                </>
              )}
            </Button>

            {showFallback && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Manual Copy (Clipboard API unavailable)</p>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                </div>
                <textarea
                  ref={textAreaRef}
                  readOnly
                  value={formatDiagnosticsForClipboard(collectFrontendDiagnostics())}
                  className="w-full rounded-md border bg-muted p-3 font-mono text-xs"
                  rows={12}
                  onClick={(e) => e.currentTarget.select()}
                />
                <p className="text-xs text-muted-foreground">
                  Click the text area to select, then press Ctrl+C (Cmd+C on Mac) to copy
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
