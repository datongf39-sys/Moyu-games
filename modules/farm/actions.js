const FarmActions = {
  plantSeed: fieldId => {
    if (window.FarmFieldsSystem) window.FarmFieldsSystem.plant(fieldId)
  },
  
  harvestField: fieldId => {
    if (window.FarmFieldsSystem) window.FarmFieldsSystem.harvest(fieldId)
  },
  
  harvestAll: () => {
    if (window.FarmFieldsSystem) window.FarmFieldsSystem.harvestAll()
  },
  
  plantAll: () => {
    if (window.FarmFieldsSystem) window.FarmFieldsSystem.plantAll()
  },
  
  killPest: fieldId => {
    if (window.FarmFieldsSystem) window.FarmFieldsSystem.killPest(fieldId)
  },
  
  buyAnimal: id => {
    if (window.FarmAnimalsSystem) window.FarmAnimalsSystem.buy(id)
  },
  
  feedAnimal: idx => {
    if (window.FarmAnimalsSystem) window.FarmAnimalsSystem.feed(idx)
  },
  
  collectProduct: idx => {
    if (window.FarmAnimalsSystem) window.FarmAnimalsSystem.collect(idx)
  },
  
  sellProduct: item => {
    if (window.FarmAnimalsSystem) window.FarmAnimalsSystem.sell(item)
  },
  
  refreshMarket: () => {
    if (window.FarmMarketSystem) window.FarmMarketSystem.refresh()
  },
  
  sellStock: id => {
    if (window.FarmMarketSystem) window.FarmMarketSystem.sellStock(id)
  },
  
  fillWholesale: i => {
    if (window.FarmMarketSystem) window.FarmMarketSystem.fillWholesale(i)
  },
  
  setupStall: () => {
    if (window.FarmMarketSystem) window.FarmMarketSystem.setupStall()
  },
  
  buyTool: id => {
    if (window.FarmToolsSystem) window.FarmToolsSystem.buyTool(id)
  },
  
  buyUpgrade: id => {
    if (window.FarmToolsSystem) window.FarmToolsSystem.buyUpgrade(id)
  },
  
  hireWorker: i => {
    if (window.FarmWorkersSystem) window.FarmWorkersSystem.hire(i)
  },
  
  startResearch: (a, b) => {
    if (window.FarmResearchSystem) window.FarmResearchSystem.start(a, b)
  },
  
  selectHybridSeed: id => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    if (!window._hybridA) {
      window._hybridA = id
    } else {
      FarmActions.startResearch(window._hybridA, id)
      window._hybridA = null
    }
  }
}

window.FarmActions = FarmActions
