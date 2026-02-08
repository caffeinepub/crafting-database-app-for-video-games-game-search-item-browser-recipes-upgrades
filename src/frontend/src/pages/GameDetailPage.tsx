import { useState, useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCatalogGame, useGetGame, useGetItems, useGetUpdateStatus } from '../hooks/useQueries';
import { ItemCategory } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import EmptyState from '../components/EmptyState';
import { 
  Search, 
  AlertCircle, 
  Package, 
  Hammer, 
  Home as HomeIcon,
  Sword,
  Shield,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Info
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Package className="h-4 w-4" />,
  tools: <Hammer className="h-4 w-4" />,
  buildingMaterials: <HomeIcon className="h-4 w-4" />,
  weapons: <Sword className="h-4 w-4" />,
  armor: <Shield className="h-4 w-4" />,
  decorations: <Sparkles className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  food: 'Food',
  tools: 'Tools',
  buildingMaterials: 'Building Materials',
  weapons: 'Weapons',
  armor: 'Armor',
  decorations: 'Decorations',
};

export default function GameDetailPage() {
  const { gameId } = useParams({ strict: false }) as { gameId: string };
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Try to get catalog game (library game)
  const { data: catalogGame, isLoading: catalogLoading, error: catalogError } = useGetCatalogGame(gameId);
  
  // Try to get crafting game (game with crafting data)
  const { data: craftingGame, isLoading: craftingGameLoading } = useGetGame(gameId);
  
  // Get items only if crafting game exists
  const { data: items, isLoading: itemsLoading, error: itemsError } = useGetItems(gameId);
  const { data: updateStatus } = useGetUpdateStatus(gameId);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    
    let filtered = items;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [items, selectedCategory, searchTerm]);

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    if (!items) return [];
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories);
  }, [items]);

  const isLoading = catalogLoading || craftingGameLoading;
  const game = catalogGame;
  const hasCraftingData = !!craftingGame && !!items && items.length > 0;

  if (catalogError) {
    return (
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load game details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="mb-8 h-6 w-96" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Game not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Games
      </Button>

      {/* Game Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{game.name}</h1>
        <p className="text-muted-foreground">{game.description}</p>
      </div>

      {/* Crafting Data Availability Notice */}
      {!hasCraftingData && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Crafting Data Not Available</AlertTitle>
          <AlertDescription>
            This game is in our library, but crafting recipes and item data are not yet available. 
            Check back later for updates.
          </AlertDescription>
        </Alert>
      )}

      {/* Update Status - only show if crafting data exists */}
      {hasCraftingData && updateStatus && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Crafting Data Status</CardTitle>
              {updateStatus.status.__kind__ === 'idle' && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Idle
                </Badge>
              )}
              {updateStatus.status.__kind__ === 'success' && (
                <Badge variant="default" className="gap-1 bg-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Success
                </Badge>
              )}
              {updateStatus.status.__kind__ === 'inProgress' && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating...
                </Badge>
              )}
              {updateStatus.status.__kind__ === 'failed' && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Failed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {updateStatus.lastUpdated 
                  ? `Last updated: ${new Date(Number(updateStatus.lastUpdated) / 1000000).toLocaleString()}`
                  : 'Never updated'}
              </span>
            </div>
            {updateStatus.status.__kind__ === 'failed' && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {updateStatus.status.failed.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {hasCraftingData && (
        <>
          <Separator className="mb-6" />

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all" className="gap-2">
                All Items
                {items && <Badge variant="secondary">{items.length}</Badge>}
              </TabsTrigger>
              {availableCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="gap-2">
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                  <Badge variant="secondary">
                    {items?.filter(item => item.category === category).length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Items Grid */}
          {itemsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : itemsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load items. Please try again later.
              </AlertDescription>
            </Alert>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No items found"
              description={searchTerm ? 'Try a different search term or category' : 'No items available in this category'}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id}
                  className="group transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {categoryIcons[item.category]}
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[item.category]}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Materials:</span>
                        <span className="font-medium">{item.requiredSupplies.length}</span>
                      </div>
                      {item.upgrades.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Upgrades:</span>
                          <span className="font-medium">{item.upgrades.length}</span>
                        </div>
                      )}
                      {item.values.sellValue !== undefined && item.values.sellValue !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-medium">{Number(item.values.sellValue)}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate({ 
                        to: '/game/$gameId/item/$itemId', 
                        params: { gameId, itemId: item.id } 
                      })}
                      variant="outline"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
