// Ancient Life Simulator - Main Entry
// All modules loaded via global objects in HTML

// Theme switcher
function st(t){ localStorage.setItem('moyu-theme',t); document.documentElement.setAttribute('data-theme',t); }

function confirmRestart(){
  showModal('⟳ 重开此生','万般皆是命，半点不由人。\n确定要放弃此生，重入轮回吗？',
    [{label:'🔄 放弃此生，重入轮回',sub:'所有数据清空',cost:'',id:'yes'},{label:'↩ 再活一阵',sub:'',cost:'',id:'no'}],
    (id)=>{ closeModal(); if(id==='yes'){ localStorage.removeItem('ancient'); location.reload(); } });
}

// Settings modal
function openSettings(){
  document.getElementById('settings-modal').classList.add('show');
}

function closeSettings(){
  document.getElementById('settings-modal').classList.remove('show');
}

function settingsModalBgClick(e){
  if (e.target === document.getElementById('settings-modal')) closeSettings();
}

// Escape key
document.addEventListener('keydown', e => { 
  if (e.key==='Escape') {
    closeModal();
    closeSettings();
  }
});

// Expose all to window (for onclick= in HTML)
Object.assign(window, {
  // core
  nextYear: window.AncientLoop ? window.AncientLoop.nextYear : null,
  initGame: inheritFrom => AncientState.initGame(inheritFrom),
  render: window.AncientRender ? window.AncientRender.render : null,
  renderObituary: window.AncientRender ? window.AncientRender.renderObituary : null,
  viewLog: window.AncientRender ? window.AncientRender.viewLog : null,
  confirmRestart,
  // ui
  switchTab: window.AncientTabs ? window.AncientTabs.switchTab : null,
  restoreTab: window.AncientTabs ? window.AncientTabs.restoreTab : null,
  st,
  openSettings,
  closeSettings,
  settingsModalBgClick,
  // systems
  openClinicTreatment: window.AncientDiseases ? window.AncientDiseases.openClinicTreatment : null,
  buyItemVenue: window.AncientShop ? window.AncientShop.buyItemVenue : null,
  useItem: window.AncientShop ? window.AncientShop.useItem : null,
  openJobModal: window.AncientCareer ? window.AncientCareer.openJobModal : null,
  doWorkTask: window.AncientCareer ? window.AncientCareer.doWorkTask : null,
  toggleSchool: window.AncientSchool ? window.AncientSchool.toggleSchool : null,
  toggleWuguan: window.AncientSchool ? window.AncientSchool.toggleWuguan : null,
  studyAtSchool: window.AncientSchool ? window.AncientSchool.studyAtSchool : null,
  trainAtWuguan: window.AncientSchool ? window.AncientSchool.trainAtWuguan : null,
  openCivilExam: window.AncientSchool ? window.AncientSchool.openCivilExam : null,
  openMilitaryExam: window.AncientSchool ? window.AncientSchool.openMilitaryExam : null,
  openExamModal: window.AncientSchool ? window.AncientSchool.openExamModal : null,
  selfStudy: window.AncientSchool ? window.AncientSchool.selfStudy : null,
  takeExam: window.AncientSchool ? window.AncientSchool.takeExam : null,
  openJobPlay: window.AncientJobPlay ? window.AncientJobPlay.open : null,
  openVenue: window.AncientVenue ? window.AncientVenue.openVenue : null,
  closeVenue: window.AncientVenue ? window.AncientVenue.closeVenue : null,
  enterSpot: window.AncientVenue ? window.AncientVenue.enterSpot : null,
  restStamina: window.AncientVenue ? window.AncientVenue.restStamina : null,
  refreshVenueBody: window.AncientVenue ? window.AncientVenue.refreshVenueBody : null,
  // features
  exercise: window.AncientHealth ? window.AncientHealth.exercise : null,
  healSelf: window.AncientHealth ? window.AncientHealth.healSelf : null,
  meditate: window.AncientHealth ? window.AncientHealth.meditate : null,
  visitNeighbor: window.AncientHealth ? window.AncientHealth.visitNeighbor : null,
  openNPCInteract: window.AncientSocial ? window.AncientSocial.openNPCInteract : null,
  doNPCChat: window.AncientSocial ? window.AncientSocial.doNPCChat : null,
  doNPCGiftFromBag: window.AncientSocial ? window.AncientSocial.doNPCGiftFromBag : null,
  doNPCGiveMoney: window.AncientSocial ? window.AncientSocial.doNPCGiveMoney : null,
  doNPCBestFriend: window.AncientSocial ? window.AncientSocial.doNPCBestFriend : null,
  removeNPC: window.AncientSocial ? window.AncientSocial.removeNPC : null,
  proposeToNPC: window.AncientMarriage ? window.AncientMarriage.proposeToNPC : null,
  blindDate: window.AncientMarriage ? window.AncientMarriage.blindDate : null,
  haveChild: window.AncientMarriage ? window.AncientMarriage.haveChild : null,
  interactParent: window.AncientFamily ? window.AncientFamily.interactParent : null,
  doParentChat: window.AncientFamily ? window.AncientFamily.doParentChat : null,
  doGiftParent: window.AncientFamily ? window.AncientFamily.doGiftParent : null,
  doAskParent: window.AncientFamily ? window.AncientFamily.doAskParent : null,
  openSpouseInteract: window.AncientFamily ? window.AncientFamily.openSpouseInteract : null,
  giftSpouse: window.AncientFamily ? window.AncientFamily.giftSpouse : null,
  divorceSpouse: window.AncientFamily ? window.AncientFamily.divorceSpouse : null,
  offerConcubine: window.AncientFamily ? window.AncientFamily.offerConcubine : null,
  openConcubineInteract: window.AncientFamily ? window.AncientFamily.openConcubineInteract : null,
  dismissConcubine: window.AncientFamily ? window.AncientFamily.dismissConcubine : null,
  openChildInteract: window.AncientFamily ? window.AncientFamily.openChildInteract : null,
  addToEstate: window.AncientEstate ? window.AncientEstate.addToEstate : null,
  removeFromEstate: window.AncientEstate ? window.AncientEstate.removeFromEstate : null,
  buyEstate: window.AncientEstate ? window.AncientEstate.buyEstate : null,
  sellEstate: window.AncientEstate ? window.AncientEstate.sellEstate : null,
  inheritChild: window.AncientInherit ? window.AncientInherit.inheritChild : null,
});

// Boot
const loaded = AncientSave.load();
if (!loaded) AncientState.initGame(null);
if (window.AncientRender) window.AncientRender.render();
