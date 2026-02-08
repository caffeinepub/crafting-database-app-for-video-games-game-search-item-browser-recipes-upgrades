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
      return actor.getGames();
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
      return actor.getGame(gameId);
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
      return actor.getCatalogGames();
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
      return actor.getCatalogGame(gameId);
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
      return actor.getItems(gameId);
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
      if (!category) {
        return actor.getItems(gameId);
      }
      return actor.getItemsByCategory(gameId, category);
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
      return actor.getItem(gameId, itemId);
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
      return actor.getUpdateStatus(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}
