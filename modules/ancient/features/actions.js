// Actions feature
const AncientActions = {
  actionDone: (key) => {
    return (AncientState.G.actionsThisYear || []).includes(key);
  },
  
  markAction: (key) => {
    if (!AncientState.G.actionsThisYear) AncientState.G.actionsThisYear = [];
    if (!AncientState.G.actionsThisYear.includes(key)) AncientState.G.actionsThisYear.push(key);
  }
};

window.AncientActions = AncientActions;
