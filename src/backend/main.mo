import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  public type UpdateStatus = {
    status : {
      #idle;
      #inProgress;
      #success;
      #failed : { error : Text };
    };
    lastUpdated : ?Time.Time;
  };

  public type RemoteDataSource = {
    id : Text;
    url : Text;
    description : Text;
  };

  public type ItemCategory = {
    #food;
    #tools;
    #buildingMaterials;
    #weapons;
    #armor;
    #decorations;
  };

  public type Supply = {
    id : Text;
    name : Text;
    quantity : Nat;
    category : ItemCategory;
  };

  public type Upgrade = {
    id : Text;
    name : Text;
    requiredSupplies : [Supply];
    level : Nat;
    cost : Nat;
  };

  public type Values = {
    durability : ?Nat;
    sellValue : ?Nat;
    stats : ?Text;
  };

  public type CraftableItem = {
    id : Text;
    name : Text;
    category : ItemCategory;
    requiredSupplies : [Supply];
    upgrades : [Upgrade];
    values : Values;
  };

  public type Game = {
    id : Text;
    name : Text;
    description : Text;
    remoteDataSources : [RemoteDataSource];
  };

  public type CatalogGame = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type CraftingGame = {
    game : Game;
    items : [CraftableItem];
    updateStatus : UpdateStatus;
  };

  module CraftableItem {
    public func compare(a : CraftableItem, b : CraftableItem) : Order.Order {
      compareByName(a, b);
    };
    public func compareByName(a : CraftableItem, b : CraftableItem) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let craftingGames = Map.empty<Text, CraftingGame>();
  let catalogGames = Map.empty<Text, CatalogGame>();

  func getPattern(gameId : Text, gameMap : Map.Map<Text, CraftableItem>) : ?CraftableItem {
    gameMap.get(gameId);
  };

  public query ({ caller }) func getGames() : async [Game] {
    craftingGames.values().map(func(cg) { cg.game }).toArray();
  };

  public query ({ caller }) func getGame(gameId : Text) : async ?Game {
    switch (craftingGames.get(gameId)) {
      case (?game) { ?game.game };
      case (null) { null };
    };
  };

  public query ({ caller }) func getItems(gameId : Text) : async [CraftableItem] {
    switch (craftingGames.get(gameId)) {
      case (?game) { game.items };
      case (null) { [] };
    };
  };

  public query ({ caller }) func searchItems(searchTerm : Text) : async [CraftableItem] {
    let results = craftingGames.values().flatMap(
      func(cg) {
        cg.items.filter(func(item) { item.name.contains(#text searchTerm) }).values();
      }
    );
    results.toArray();
  };

  public query ({ caller }) func getItem(gameId : Text, itemId : Text) : async ?CraftableItem {
    switch (craftingGames.get(gameId)) {
      case (?game) {
        game.items.find(func(item) { item.id == itemId });
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getItemsByCategory(gameId : Text, category : ItemCategory) : async [CraftableItem] {
    switch (craftingGames.get(gameId)) {
      case (?game) {
        game.items.filter(func(item) { item.category == category });
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getUpdateStatus(gameId : Text) : async ?UpdateStatus {
    switch (craftingGames.get(gameId)) {
      case (?game) { ?game.updateStatus };
      case (null) { null };
    };
  };

  public query ({ caller }) func getCatalogGames() : async [CatalogGame] {
    catalogGames.values().toArray();
  };

  public query ({ caller }) func getCatalogGame(gameId : Text) : async ?CatalogGame {
    catalogGames.get(gameId);
  };

  public shared ({ caller }) func addCatalogGame(game : CatalogGame) : async () {
    if (catalogGames.containsKey(game.id)) {
      Runtime.trap("Game with id " # game.id # " already exists in the catalog");
    };
    catalogGames.add(game.id, game);
  };
};
