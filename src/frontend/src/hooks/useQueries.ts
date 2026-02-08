import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Game, CraftableItem, UpdateStatus, ItemCategory, CatalogGame } from '../backend';

// Query keys
export const queryKeys = {
  games: ['games'] as const,
  game: (gameId: string) => ['game', gameId] as const,
  items: (gameId: string) => ['items', gameId] as const,
  itemsByCategory: (gameId: string, category: ItemCategory) => ['items', gameId, category] as const,
  item: (gameId: string, itemId: string) => ['item', gameId, itemId] as const,
  updateStatus: (gameId: string) => ['updateStatus', gameId] as const,
  catalogGames: ['catalogGames'] as const,
  catalogGame: (gameId: string) => ['catalogGame', gameId] as const,
};

// Get all crafting games (games with crafting data)
export function useGetGames() {
  const { actor, isFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: queryKeys.games,
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getGames();
        return result || [];
      } catch (error) {
        console.error('[useGetGames] Error fetching games:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Get single crafting game
export function useGetGame(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Game | null>({
    queryKey: queryKeys.game(gameId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getGame(gameId);
        return result || null;
      } catch (error) {
        console.error(`[useGetGame] Error fetching game ${gameId}:`, error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

// Get all catalog games (library games from internet)
export function useGetCatalogGames() {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogGame[]>({
    queryKey: queryKeys.catalogGames,
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getCatalogGames();
        return result || [];
      } catch (error) {
        console.error('[useGetCatalogGames] Error fetching catalog games:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Get single catalog game
export function useGetCatalogGame(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CatalogGame | null>({
    queryKey: queryKeys.catalogGame(gameId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getCatalogGame(gameId);
        return result || null;
      } catch (error) {
        console.error(`[useGetCatalogGame] Error fetching catalog game ${gameId}:`, error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

// Get all items for a game
export function useGetItems(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CraftableItem[]>({
    queryKey: queryKeys.items(gameId),
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getItems(gameId);
        return result || [];
      } catch (error) {
        console.error(`[useGetItems] Error fetching items for game ${gameId}:`, error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

// Get items by category
export function useGetItemsByCategory(gameId: string, category: ItemCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CraftableItem[]>({
    queryKey: category ? queryKeys.itemsByCategory(gameId, category) : queryKeys.items(gameId),
    queryFn: async () => {
      if (!actor) return [];
      try {
        if (!category) {
          const result = await actor.getItems(gameId);
          return result || [];
        }
        const result = await actor.getItemsByCategory(gameId, category);
        return result || [];
      } catch (error) {
        console.error(`[useGetItemsByCategory] Error fetching items for game ${gameId}, category ${category}:`, error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

// Get single item
export function useGetItem(gameId: string, itemId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CraftableItem | null>({
    queryKey: queryKeys.item(gameId, itemId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getItem(gameId, itemId);
        return result || null;
      } catch (error) {
        console.error(`[useGetItem] Error fetching item ${itemId} for game ${gameId}:`, error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!gameId && !!itemId,
  });
}

// Get update status
export function useGetUpdateStatus(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UpdateStatus | null>({
    queryKey: queryKeys.updateStatus(gameId),
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getUpdateStatus(gameId);
        return result || null;
      } catch (error) {
        console.error(`[useGetUpdateStatus] Error fetching update status for game ${gameId}:`, error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}
