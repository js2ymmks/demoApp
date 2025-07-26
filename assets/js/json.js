const ecoHeater = {
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
    }
  }


  // ecoHeater オブジェクトを JSON 文字列に変換して保存
sessionStorage.setItem("ecoHeater", JSON.stringify(ecoHeater));