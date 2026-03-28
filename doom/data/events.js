const DoomEventsData = {
  eventPool: [
    {
      icon: '🧟',
      title: '丧尸来袭！',
      desc: '一群丧尸正在接近营地，你需要做出决策',
      choices: [
        {
          text: '⚔️ 战斗抵御 (消耗 5 发弹药)',
          fn: D => {
            if (D.vanUpgrades.find(u => u.id === 'turret')?.bought) {
              window.DoomUtils.addLog('🔫 炮塔自动击退丧尸！无需弹药', 'lok')
            } else if (D.resources.ammo >= 5) {
              D.resources.ammo -= Math.max(1, 5 - D.survivors.reduce((a, s) => a + s.skills.combat, 0))
              window.DoomUtils.addLog('⚔️ 战斗胜利！击退丧尸', 'lok')
            } else {
              const armorMult = D.vanUpgrades.find(u => u.id === 'armor')?.bought ? 0.5 : 1
              D.vanHp -= Math.floor(20 * armorMult)
              window.DoomUtils.addLog('💀 无弹药！房车受损', 'lbad')
            }
          }
        },
        {
          text: '🚗 驾车逃跑 (消耗 10L 燃料)',
          fn: D => {
            if (D.resources.fuel >= 10) {
              D.resources.fuel -= 10
              window.DoomUtils.addLog('🚗 成功逃脱！', 'lok')
            } else {
              const armorMult2 = D.vanUpgrades.find(u => u.id === 'armor')?.bought ? 0.5 : 1
              D.vanHp -= Math.floor(30 * armorMult2)
              window.DoomUtils.addLog('💀 燃料不足！严重损坏', 'lbad')
            }
          }
        },
        {
          text: '🔒 躲藏等待 (失去一天)',
          fn: D => {
            window.DoomUtils.addLog('🔒 躲过了这波丧尸...', 'linfo')
          }
        }
      ]
    },
    {
      icon: '🌧️',
      title: '暴雨来临',
      desc: '大雨将至，这是收集雨水的好机会！',
      choices: [
        {
          text: '💧 收集雨水 (+20 水)',
          fn: D => {
            D.resources.water = Math.min(D.maxRes.water, D.resources.water + 20)
            window.DoomUtils.addLog('💧 收集了 20L 雨水', 'lok')
          }
        },
        {
          text: '🏠 留在车内休息',
          fn: D => {
            D.survivors.forEach(s => s.morale = Math.min(100, s.morale + 5))
            window.DoomUtils.addLog('😊 休息恢复了士气', 'lok')
          }
        }
      ]
    },
    {
      icon: '👤',
      title: '陌生人求助',
      desc: '一个受伤的陌生人敲了你的车窗...',
      choices: [
        {
          text: '💊 给予医疗救助 (-3 医药)',
          fn: D => {
            if (D.resources.medicine >= 3) {
              D.resources.medicine -= 3
              if (Math.random() > 0.3) {
                const sv = window.DoomSystems?.createSurvivor()
                if (sv) {
                  D.survivors.push(sv)
                  window.DoomUtils.addLog('✅ 陌生人加入了队伍！', 'lok')
                }
              } else {
                window.DoomUtils.addLog('🙏 陌生人感激离去', 'linfo')
              }
            } else {
              window.DoomUtils.addLog('💊 医药不足，无法救助', 'lbad')
            }
          }
        },
        {
          text: '🍞 给予食物 (-5 食物)',
          fn: D => {
            if (D.resources.food >= 5) {
              D.resources.food -= 5
              window.DoomUtils.addLog('🍞 给予了食物，获得了好感', 'lok')
            } else {
              window.DoomUtils.addLog('😞 食物不足', 'lbad')
            }
          }
        },
        {
          text: '🚫 拒绝',
          fn: D => {
            D.morale -= 5
            window.DoomUtils.addLog('😔 拒绝了求助，士气下降', 'lbad')
          }
        }
      ]
    },
    {
      icon: '⚡',
      title: '设备故障',
      desc: '房车发电机出现故障，需要立即修复',
      choices: [
        {
          text: '🔧 自行修复 (-10 废料)',
          fn: D => {
            if (D.resources.scrap >= 10) {
              D.resources.scrap -= 10
              window.DoomUtils.addLog('🔧 成功修复发电机', 'lok')
            } else {
              D.vanHp -= 15
              window.DoomUtils.addLog('💀 修复失败，房车受损', 'lbad')
            }
          }
        },
        {
          text: '💰 消耗医药暂时维持 (-5 医药)',
          fn: D => {
            if (D.resources.medicine >= 5) {
              D.resources.medicine -= 5
              window.DoomUtils.addLog('⚠️ 临时维修，后续仍需修复', 'linfo')
            } else {
              window.DoomUtils.addLog('💀 无法维持！', 'lbad')
            }
          }
        }
      ]
    },
    {
      icon: '🔫',
      title: '武装劫匪',
      desc: '一伙武装劫匪拦截了你们的路！',
      choices: [
        {
          text: '💥 武力对抗 (消耗 10 弹药)',
          fn: D => {
            if (D.resources.ammo >= 10) {
              D.resources.ammo -= 10
              window.DoomUtils.addLog('💥 击退了劫匪！缴获部分物资', 'lok')
              D.resources.scrap += Math.floor(Math.random() * 15 + 5)
            } else {
              const loss = Math.floor(Math.random() * 20 + 10)
              D.resources.food = Math.max(0, D.resources.food - loss)
              window.DoomUtils.addLog(`💀 无法对抗，损失${loss}食物`, 'lbad')
            }
          }
        },
        {
          text: '🤝 谈判交涉 (-15 食物)',
          fn: D => {
            if (D.resources.food >= 15) {
              D.resources.food -= 15
              window.DoomUtils.addLog('🤝 成功谈判，付出食物换取通行', 'linfo')
            } else {
              window.DoomUtils.addLog('😰 无筹码谈判，被迫逃跑', 'lbad')
            }
          }
        },
        {
          text: '🏃 快速逃跑 (-8 燃料)',
          fn: D => {
            if (D.resources.fuel >= 8) {
              D.resources.fuel -= 8
              window.DoomUtils.addLog('🏃 全速逃跑成功！', 'lok')
            } else {
              D.vanHp -= 25
              window.DoomUtils.addLog('💀 燃料不足，房车撞毁', 'lbad')
            }
          }
        }
      ]
    },
    {
      icon: '🌡️',
      title: '疾病爆发',
      desc: '营地内出现了不明感染症状！',
      choices: [
        {
          text: '💊 使用医药治疗 (-8 医药)',
          fn: D => {
            if (D.resources.medicine >= 8) {
              D.resources.medicine -= 8
              D.infection = Math.max(0, D.infection - 30)
              window.DoomUtils.addLog('💊 成功控制疫情', 'lok')
            } else {
              D.infection += 20
              D.survivors.forEach(s => s.hp = Math.max(1, s.hp - 15))
              window.DoomUtils.addLog('☠️ 疫情蔓延！', 'lbad')
            }
          }
        },
        {
          text: '🔒 隔离感染者',
          fn: D => {
            D.morale -= 10
            window.DoomUtils.addLog('⚠️ 隔离措施降低了士气但控制了扩散', 'linfo')
          }
        }
      ]
    }
  ]
}

window.DoomEventsData = DoomEventsData
