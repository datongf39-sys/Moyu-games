const FarmWeatherData = {
  seasons: ['春', '夏', '秋', '冬'],
  weathers: [
    { name: '晴天', icon: '☀️', desc: '生长速度正常', mult: 1.0 },
    { name: '多云', icon: '⛅', desc: '生长速度 -10%', mult: 0.9 },
    { name: '大雨', icon: '🌧️', desc: '水分充足 +20%', mult: 1.2 },
    { name: '暴风雨', icon: '⛈️', desc: '生长暂停！触发病虫害', mult: 0 },
    { name: '大雾', icon: '🌫️', desc: '采收效率 -30%', mult: 0.7 },
    { name: '寒潮', icon: '❄️', desc: '部分作物受损', mult: 0.5 }
  ]
}

window.FarmWeatherData = FarmWeatherData
