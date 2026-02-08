import Map "mo:core/Map";

module {
  type UpdateStatus = {
    status : {
      #idle;
      #inProgress;
      #success;
      #failed : { error : Text };
    };
    lastUpdated : ?Int;
  };

  type RemoteDataSource = {
    id : Text;
    url : Text;
    description : Text;
  };

  type ItemCategory = {
    #food;
    #tools;
    #buildingMaterials;
    #weapons;
    #armor;
    #decorations;
  };

  type Supply = {
    id : Text;
    name : Text;
    quantity : Nat;
    category : ItemCategory;
  };

  type Upgrade = {
    id : Text;
    name : Text;
    requiredSupplies : [Supply];
    level : Nat;
    cost : Nat;
  };

  type Values = {
    durability : ?Nat;
    sellValue : ?Nat;
    stats : ?Text;
  };

  type CraftableItem = {
    id : Text;
    name : Text;
    category : ItemCategory;
    requiredSupplies : [Supply];
    upgrades : [Upgrade];
    values : Values;
  };

  type Game = {
    id : Text;
    name : Text;
    description : Text;
    remoteDataSources : [RemoteDataSource];
  };

  type CraftingGame = {
    game : Game;
    items : [CraftableItem];
    updateStatus : UpdateStatus;
  };

  type CatalogGame = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type OldActor = {
    craftingGames : Map.Map<Text, CraftingGame>;
  };

  public type NewActor = {
    craftingGames : Map.Map<Text, CraftingGame>;
    catalogGames : Map.Map<Text, CatalogGame>;
  };

  public func run(old : OldActor) : NewActor {
    { old with catalogGames = Map.empty<Text, CatalogGame>() };
  };
};
