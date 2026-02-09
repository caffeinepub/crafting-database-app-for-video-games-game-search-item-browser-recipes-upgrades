import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameSearchPage from './pages/GameSearchPage';
import GameDetailPage from './pages/GameDetailPage';
import ItemDetailPage from './pages/ItemDetailPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import { useProductionPreflight } from './hooks/useProductionPreflight';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Layout() {
  useProductionPreflight();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle deep-link restoration from 404.html redirect
    const initialPath = sessionStorage.getItem('spa_initial_path');
    if (initialPath) {
      sessionStorage.removeItem('spa_initial_path');
      // Navigate to the stored path after router is ready
      setTimeout(() => {
        navigate({ to: initialPath as any }).catch(() => {
          // If navigation fails, stay on current route
          console.warn('Failed to navigate to initial path:', initialPath);
        });
      }, 0);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GameSearchPage,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId',
  component: GameDetailPage,
});

const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId/item/$itemId',
  component: ItemDetailPage,
});

const diagnosticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/diagnostics',
  component: DiagnosticsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, gameRoute, itemRoute, diagnosticsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
