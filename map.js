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

// ✅ 지도 클릭 이벤트 → 클릭한 좌표의 모든 정보 조회 후 통합 팝업 표시
map.on('click', function(evt) {
  var coord = ol.proj.toLonLat(evt.coordinate);
  var lon = coord[0];
  var lat = coord[1];

  // 각 모듈의 조회 함수 호출
  if (typeof showLandBuildingInfo === 'function') {
    showLandBuildingInfo(lon, lat);
  }
  if (typeof showRealEstateInfo === 'function') {
    showRealEstateInfo(lon, lat);
  }
  if (typeof showLandUseInfo === 'function') {
    showLandUseInfo(lon, lat);
  }

  // 통합 팝업 열기
  document.getElementById("infoPopup").style.display = "block";
});

// ✅ 내 위치 추적 기능
function trackMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lon = position.coords.longitude;
      var lat = position.coords.latitude;

      // 내 위치 마커 표시
      var marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
      });

      var vectorSource = new ol.source.Vector({
        features: [marker]
      });

      var markerLayer = new ol.layer.Vector({
        source: vectorSource
      });

      map.addLayer(markerLayer);

      // 지도 중심을 내 위치로 이동
      map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
      map.getView().setZoom(15);

      // 좌표창 업데이트
      document.getElementById("latBox").innerText = "위도: " + lat;
      document.getElementById("lngBox").innerText = "경도: " + lon;

      // 내 위치에서 모든 정보 조회
      if (typeof showLandBuildingInfo === 'function') {
        showLandBuildingInfo(lon, lat);
      }
      if (typeof showRealEstateInfo === 'function') {
        showRealEstateInfo(lon, lat);
      }
      if (typeof showLandUseInfo === 'function') {
        showLandUseInfo(lon, lat);
      }

      // 통합 팝업 열기
      document.getElementById("infoPopup").style.display = "block";
    });
  } else {
    alert("이 브라우저에서는 위치 추적을 지원하지 않습니다.");
  }
}

// ✅ 팝업 닫기
function closeInfoPopup() {
  document.getElementById("infoPopup").style.display = "none";
}
