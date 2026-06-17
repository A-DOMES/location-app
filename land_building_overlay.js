// 브이월드 API 키 입력
// land_building_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

// 버튼 클릭 시 토지·건축물 오버레이
function showLandBuilding() {
  // 토지 지적도 레이어
  var landLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      // http → https로 수정 (보안상 권장)
      url: `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Cadastre/{z}/{y}/{x}.png`
    })
  });

  // 건축물 레이어
  var buildingLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      // 동일하게 https로 수정
      url: `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Building/{z}/{y}/{x}.png`
    })
  });

  map.addLayer(landLayer);
  map.addLayer(buildingLayer);

  // 클릭 이벤트 → 팝업 표시
  map.on('click', function(evt) {
    var coord = ol.proj.toLonLat(evt.coordinate);
    var lon = coord[0];
    var lat = coord[1];

    // 브이월드 데이터 API 호출 (http → https로 수정)
    fetch(`https://api.vworld.kr/req/data?service=data&request=GetFeature&key=${API_KEY}&geometry=POINT(${lon} ${lat})&size=10&data=LT_C_ADSIDO,LT_C_ADEMD,LT_C_ADEDO,LT_P_BULD`)
      .then(response => response.json())
      .then(data => {
        // JSON 전체 출력 대신 주요 속성만 추려서 표시하도록 수정
        const features = data.response?.result?.featureCollection?.features;
        if (features && features.length > 0) {
          const props = features[0].properties;
          document.getElementById("landBuildingInfo").innerHTML = `
            <b>필지코드:</b> ${props.PNU || '정보 없음'}<br>
            <b>건물명:</b> ${props.BLD_NM || '정보 없음'}<br>
            <b>용도지역:</b> ${props.USE_ZONE || '정보 없음'}
          `;
        } else {
          document.getElementById("landBuildingInfo").innerHTML = "데이터를 찾을 수 없습니다.";
        }
        document.getElementById("landBuildingPopup").style.display = "block";
      })
      .catch(error => {
        // 에러 처리 추가
        console.error("브이월드 API 호출 실패:", error);
        document.getElementById("landBuildingInfo").innerHTML = "데이터를 불러오지 못했습니다.";
        document.getElementById("landBuildingPopup").style.display = "block";
      });
  });
}

// 팝업 닫기
function closeLandBuildingPopup() {
  document.getElementById("landBuildingPopup").style.display = "none";
}
