const FarmBaseData = {
  gold: 200,
  harvested: 0,
  season: 0,
  seasonDay: 0,
  weather: 0,
  weatherTimer: 60,
  selectedSeed: 'wheat',
  stock: {},
  marketPrices: {},
  stall: { active: false, cost: 200, revenue: 0 },
  wholesale: [],
  hybrids: [],
  researchProg: 0,
  researchTarget: null,
  maxAnimals: 3,
  achievements: [],
  pestActive: false,
  pestField: [],
  autoHarvest: false
}

window.FarmBaseData = FarmBaseData
