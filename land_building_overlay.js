// 브이월드 API 키 입력
// land_building_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

// 버튼 클릭 시 토지·건축물 오버레이
function showLandBuilding() {
  // 토지 지적도 레이어
  var landLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Cadastre/{z}/{y}/{x}.png`
    })
  });

  // 건축물 레이어
  var buildingLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Building/{z}/{y}/{x}.png`
    })
  });

  map.addLayer(landLayer);
  map.addLayer(buildingLayer);

  // 클릭 이벤트 → 팝업 표시
  map.on('click', function(evt) {
    var coord = ol.proj.toLonLat(evt.coordinate);
    var lon = coord[0];
    var lat = coord[1];

    fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&key=${API_KEY}&geometry=POINT(${lon} ${lat})&size=10&data=LT_C_ADSIDO,LT_C_ADEMD,LT_C_ADEDO,LT_P_BULD`)
      .then(response => response.json())
      .then(data => {
        document.getElementById("landBuildingInfo").innerHTML = JSON.stringify(data, null, 2);
        document.getElementById("landBuildingPopup").style.display = "block";
      });
  });
}

// 팝업 닫기
function closeLandBuildingPopup() {
  document.getElementById("landBuildingPopup").style.display = "none";
}
