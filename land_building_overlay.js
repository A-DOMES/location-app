// 브이월드 API 키 입력
const API_KEY = "48BF8F59-D37C-3BA1-916E-1E5B135EC360";

// 기본 지도 객체는 client.html에서 이미 생성된 map을 사용한다고 가정
// 버튼 클릭 시 토지·건축물 오버레이
function showLandBuilding() {
  // 토지 지적도 레이어
  var landLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${48BF8F59-D37C-3BA1-916E-1E5B135EC360}/Cadastre/{z}/{y}/{x}.png`
    })
  });

  // 건축물 레이어
  var buildingLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `http://api.vworld.kr/req/wmts/1.0.0/${48BF8F59-D37C-3BA1-916E-1E5B135EC360}/Building/{z}/{y}/{x}.png`
    })
  });

  map.addLayer(landLayer);
  map.addLayer(buildingLayer);

  // 클릭 이벤트 → 팝업 표시
  map.on('click', function(evt) {
    var coord = ol.proj.toLonLat(evt.coordinate);
    var lon = coord[0];
    var lat = coord[1];

    // 브이월드 API 호출 (예시: 지번/건축물 정보)
    fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&key=${48BF8F59-D37C-3BA1-916E-1E5B135EC360}&geometry=POINT(${lon} ${lat})&size=10&data=LT_C_ADSIDO,LT_C_ADEMD,LT_C_ADEDO,LT_P_BULD`)
      .then(response => response.json())
      .then(data => {
        // 데이터 파싱 후 팝업에 표시
        document.getElementById("landBuildingInfo").innerHTML = JSON.stringify(data, null, 2);
        document.getElementById("landBuildingPopup").style.display = "block";
      });
  });
}

// 팝업 닫기
function closeLandBuildingPopup() {
  document.getElementById("landBuildingPopup").style.display = "none";
}
