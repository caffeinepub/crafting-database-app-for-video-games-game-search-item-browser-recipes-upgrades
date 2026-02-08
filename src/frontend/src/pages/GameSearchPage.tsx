import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetGames } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EmptyState from '../components/EmptyState';
import { Search, AlertCircle, Gamepad2 } from 'lucide-react';

export default function GameSearchPage() {
  const navigate = useNavigate();
  const { data: games, isLoading, error } = useGetGames();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (!searchTerm.trim()) return games;
    
    const term = searchTerm.toLowerCase();
    return games.filter(game => 
      game.name.toLowerCase().includes(term) || 
      game.description.toLowerCase().includes(term)
    );
  }, [games, searchTerm]);

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load games. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/50 to-background">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/assets/generated/hero-banner.dim_1600x900.png" 
            alt="" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Crafting Compendium
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Your comprehensive reference for crafting recipes, materials, and upgrades across your favorite games
            </p>
            
            {/* Search Bar */}
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 pr-4 text-base shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container py-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <EmptyState
            title={searchTerm ? 'No games found' : 'No games available'}
            description={searchTerm ? 'Try a different search term' : 'Games will appear here once added'}
            icon={<Gamepad2 className="h-8 w-8 text-muted-foreground" />}
          />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                {searchTerm ? `Found ${filteredGames.length} game${filteredGames.length !== 1 ? 's' : ''}` : 'Available Games'}
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <Card 
                  key={game.id} 
                  className="group transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                      {game.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => navigate({ to: '/game/$gameId', params: { gameId: game.id } })}
                      className="w-full"
                    >
                      Browse Items
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
