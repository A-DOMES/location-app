// map.js
// OpenLayers 지도 초기화 파일
// 전역 변수 map을 생성하여 다른 모듈에서 활용 가능

var map = new ol.Map({
  target: 'map', // client.html 안의 <div id="map">에 렌더링
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM() // 기본 배경지도 (OpenStreetMap)
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([127.0, 37.5]), // 대한민국 중심 좌표
    zoom: 7 // 초기 줌 레벨
  })
});

// ✅ 개선 포인트
// 1. 지도 클릭 이벤트를 여기서 정의해두면 다른 모듈에서 재사용 가능
map.on('click', function(evt) {
  var coord = ol.proj.toLonLat(evt.coordinate);
  var lon = coord[0];
  var lat = coord[1];

  // 각 모듈의 조회 함수 호출 (모듈이 로드된 경우에만 실행됨)
  if (typeof showRealEstateInfo === 'function') {
    showRealEstateInfo(lon, lat);
  }
  if (typeof showLandUseInfo === 'function') {
    showLandUseInfo(lon, lat);
  }
  // 토지·건축물 오버레이는 버튼으로 따로 실행되므로 여기서는 제외
});
