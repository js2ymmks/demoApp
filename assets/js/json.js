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
    "energySaving": {
      "enabled": true,
      "level": "high"
    },
    "baseUrl": "../assets/img/",
    "bath": {
      "autoMode": "ope-button-01-off.svg",
      "reheatMode": "ope-button-02-off.svg",
      "pikariyuMode": "ope-button-03-off.svg"
    },
  }


  // ecoHeater オブジェクトを JSON 文字列に変換して保存
sessionStorage.setItem("ecoCuteData", JSON.stringify(ecoCuteData));