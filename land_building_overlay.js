// 브이월드 API 키 입력
const API_KEY = "YOUR_API_KEY";

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Base/{z}/{y}/{x}.png`
      })
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([127.0, 37.5]), // 대한민국 중심 좌표
    zoom: 7
  })
});

// 버튼 클릭 시 토지·건축물 오버레이
function showLandBuilding() {
  // 토지 지적도 레이어
  var landLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Cadastre/{z}/{y}/{x}.png`
    })
  });

  // 건축물 레이어 (예시: 건물 위치 마커)
  var buildingLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Building/{z}/{y}/{x}.png`
    })
  });

  map.addLayer(landLayer);
  map.addLayer(buildingLayer);
}
