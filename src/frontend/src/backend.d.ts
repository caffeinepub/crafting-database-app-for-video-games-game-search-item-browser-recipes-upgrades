import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Game {
    id: string;
    remoteDataSources: Array<RemoteDataSource>;
    name: string;
    description: string;
}
export type Time = bigint;
export interface RemoteDataSource {
    id: string;
    url: string;
    description: string;
}
export interface UpdateStatus {
    status: {
        __kind__: "idle";
        idle: null;
    } | {
        __kind__: "success";
        success: null;
    } | {
        __kind__: "inProgress";
        inProgress: null;
    } | {
        __kind__: "failed";
        failed: {
            error: string;
        };
    };
    lastUpdated?: Time;
}
export interface Upgrade {
    id: string;
    requiredSupplies: Array<Supply>;
    cost: bigint;
    name: string;
    level: bigint;
}
export interface Supply {
    id: string;
    name: string;
    quantity: bigint;
    category: ItemCategory;
}
export interface CraftableItem {
    id: string;
    requiredSupplies: Array<Supply>;
    name: string;
    values: Values;
    upgrades: Array<Upgrade>;
    category: ItemCategory;
}
export interface Values {
    stats?: string;
    durability?: bigint;
    sellValue?: bigint;
}
export interface CatalogGame {
    id: string;
    name: string;
    description: string;
}
export enum ItemCategory {
    tools = "tools",
    armor = "armor",
    food = "food",
    buildingMaterials = "buildingMaterials",
    weapons = "weapons",
    decorations = "decorations"
}
export interface backendInterface {
    addCatalogGame(game: CatalogGame): Promise<void>;
    getCatalogGame(gameId: string): Promise<CatalogGame | null>;
    getCatalogGames(): Promise<Array<CatalogGame>>;
    getGame(gameId: string): Promise<Game | null>;
    getGames(): Promise<Array<Game>>;
    getItem(gameId: string, itemId: string): Promise<CraftableItem | null>;
    getItems(gameId: string): Promise<Array<CraftableItem>>;
    getItemsByCategory(gameId: string, category: ItemCategory): Promise<Array<CraftableItem>>;
    getUpdateStatus(gameId: string): Promise<UpdateStatus | null>;
    searchItems(searchTerm: string): Promise<Array<CraftableItem>>;
}
