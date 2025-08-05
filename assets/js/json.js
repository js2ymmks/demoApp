const ecoCuteData = {
    "operationMode": "auto",
    "tankTemperature": 65,
    "bathMode": "reheat",
    "scheduledHeating": true,
    "circulationPump": "on",
    "hotWaterSupply": {
      "status": "ready",
      "priority": "bath"
    },
    "baseUrl": "../assets/img/",
    "tank": {
      "enabled": true,
      "level": "high"
    },
    "bath": {
      "btnAutoOn": "btn-bath-auto_on.png",
      "btnAutoOff": "btn-bath-auto_off.png",
      "bathAutoBtn": "btn-bath-auto_on.png",
      "reheatMode": "ope-button-02-off.svg",
      "kirariyuMode": "ope-button-03-off.svg"
    },
  }


  // ecoHeater オブジェクトを JSON 文字列に変換して保存
sessionStorage.setItem("demoAppData", JSON.stringify(ecoCuteData));