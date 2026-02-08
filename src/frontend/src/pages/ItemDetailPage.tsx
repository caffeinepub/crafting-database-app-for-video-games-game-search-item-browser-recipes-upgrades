import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetItem, useGetGame } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, 
  AlertCircle, 
  Package, 
  Hammer, 
  Home as HomeIcon,
  Sword,
  Shield,
  Sparkles,
  TrendingUp,
  Coins,
  Heart,
  BarChart3
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Package className="h-5 w-5" />,
  tools: <Hammer className="h-5 w-5" />,
  buildingMaterials: <HomeIcon className="h-5 w-5" />,
  weapons: <Sword className="h-5 w-5" />,
  armor: <Shield className="h-5 w-5" />,
  decorations: <Sparkles className="h-5 w-5" />,
};

const categoryLabels: Record<string, string> = {
  food: 'Food',
  tools: 'Tools',
  buildingMaterials: 'Building Materials',
  weapons: 'Weapons',
  armor: 'Armor',
  decorations: 'Decorations',
};

export default function ItemDetailPage() {
  const { gameId, itemId } = useParams({ strict: false }) as { gameId: string; itemId: string };
  const navigate = useNavigate();

  const { data: game } = useGetGame(gameId);
  const { data: item, isLoading, error } = useGetItem(gameId, itemId);

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load item details. Please try again later.
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
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Item not found.
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
        onClick={() => navigate({ to: '/game/$gameId', params: { gameId } })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {game?.name || 'Game'}
      </Button>

      {/* Item Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            {categoryIcons[item.category]}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <Badge variant="outline" className="mt-1">
              {categoryLabels[item.category]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Required Supplies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Required Materials
            </CardTitle>
            <CardDescription>
              Materials needed to craft this item
            </CardDescription>
          </CardHeader>
          <CardContent>
            {item.requiredSupplies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No materials required</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.requiredSupplies.map((supply) => (
                    <TableRow key={supply.id}>
                      <TableCell className="font-medium">{supply.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[supply.category]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(supply.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Item Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Item Properties
            </CardTitle>
            <CardDescription>
              Stats and values for this item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.values.sellValue !== undefined && item.values.sellValue !== null && (
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Sell Value</span>
                  </div>
                  <span className="text-lg font-bold">{Number(item.values.sellValue)}</span>
                </div>
              )}
              
              {item.values.durability !== undefined && item.values.durability !== null && (
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Durability</span>
                  </div>
                  <span className="text-lg font-bold">{Number(item.values.durability)}</span>
                </div>
              )}
              
              {item.values.stats && (
                <div className="rounded-lg border border-border/50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Stats</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.values.stats}</p>
                </div>
              )}

              {!item.values.sellValue && !item.values.durability && !item.values.stats && (
                <p className="text-sm text-muted-foreground">No properties available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrades */}
      {item.upgrades.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Available Upgrades
            </CardTitle>
            <CardDescription>
              Upgrade paths and their requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.upgrades.map((upgrade) => (
                <div key={upgrade.id} className="rounded-lg border border-border/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{upgrade.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Level {Number(upgrade.level)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Cost: {Number(upgrade.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {upgrade.requiredSupplies.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          Required Materials:
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {upgrade.requiredSupplies.map((supply) => (
                            <div 
                              key={supply.id}
                              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                            >
                              <span>{supply.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {Number(supply.quantity)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
