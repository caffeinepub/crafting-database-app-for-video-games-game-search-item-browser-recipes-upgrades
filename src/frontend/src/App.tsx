import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameSearchPage from './pages/GameSearchPage';
import GameDetailPage from './pages/GameDetailPage';
import ItemDetailPage from './pages/ItemDetailPage';

// Layout component with Header and Footer
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: () => <Layout><GameSearchPage /></Layout>,
});

// Game search route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Layout><GameSearchPage /></Layout>,
});

// Game detail route
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId',
  component: () => <Layout><GameDetailPage /></Layout>,
});

// Item detail route
const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game/$gameId/item/$itemId',
  component: () => <Layout><ItemDetailPage /></Layout>,
});

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, gameRoute, itemRoute]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
