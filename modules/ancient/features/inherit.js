const AncientInherit = {
  inheritChild: (idx) => {
    const child = AncientState.G.children[idx];
    if (!child || child.age < 18){ AncientModal.showToast('子嗣尚未成年！'); return; }
    const prev = {name:AncientState.G.name, emoji:AncientState.G.emoji, age:AncientState.G.age, money:AncientState.G.money};
    const newAncestors = [...AncientState.G.ancestors, {name:AncientState.G.name, emoji:AncientState.G.emoji, age:AncientState.G.age, rel:'先祖'}];
    const inheritMoney = Math.floor(AncientState.G.money * 0.4);
    AncientState.initGame(prev);
    AncientState.G.name=child.name; AncientState.G.given=child.name.slice(1); AncientState.G.surname=child.name[0];
    AncientState.G.gender=child.gender; AncientState.G.emoji=child.emoji; AncientState.G.age=child.age;
    AncientState.G.money=inheritMoney+50; AncientState.G.ancestors=newAncestors; AncientState.G.log=[];
    AncientSave.addLog(`🌅 承继 ${newAncestors[newAncestors.length-1].name} 之遗志，${child.name} 开始书写自己的人生。`, 'event');
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientInherit = AncientInherit;
window.inheritChild = AncientInherit.inheritChild;
