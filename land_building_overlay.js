// land_building_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

let landOverlay = null;
let buildingOverlay = null;

function showLandBuilding() {
  // 대한민국 전체 범위 예시 (실제 서비스에 맞게 조정 필요)
  const bounds = {
    north: 38.5,
    south: 34.0,
    east: 129.5,
    west: 125.0
  };

  // 토지 지적도 오버레이
  landOverlay = new google.maps.GroundOverlay(
    `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Cadastre/{z}/{y}/{x}.png`,
    bounds
  );
  landOverlay.setMap(map);

  // 건축물 오버레이
  buildingOverlay = new google.maps.GroundOverlay(
    `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Building/{z}/{y}/{x}.png`,
    bounds
  );
  buildingOverlay.setMap(map);

  // 지도 클릭 이벤트 → 브이월드 데이터 API 호출
  map.addListener("click", (e) => {
    const lat = e.latLng.lat();
    const lon = e.latLng.lng();

    fetch(`https://api.vworld.kr/req/data?service=data&request=GetFeature&key=${API_KEY}&geometry=POINT(${lon} ${lat})&size=10&data=LT_C_ADSIDO,LT_C_ADEMD,LT_C_ADEDO,LT_P_BULD`)
      .then(response => response.json())
      .then(data => {
        const features = data.response?.result?.featureCollection?.features;
        if (features && features.length > 0) {
          const props = features[0].properties;
          document.getElementById("landBuildingInfo").innerHTML = `
            <b>필지코드:</b> ${props.PNU || '정보 없음'}<br>
            <b>건물명:</b> ${props.BLD_NM || '정보 없음'}<br>
            <b>용도지역:</b> ${props.USE_ZONE || '정보 없음'}
          `;
        } else {
          document.getElementById("landBuildingInfo").innerHTML = "토지·건축물 데이터를 찾을 수 없습니다.";
        }

        // ✅ 통합 팝업 열기
        document.getElementById("infoPopup").style.display = "block";
      })
      .catch(error => {
        console.error("브이월드 API 호출 실패:", error);
        document.getElementById("landBuildingInfo").innerHTML = "데이터를 불러오지 못했습니다.";
        document.getElementById("infoPopup").style.display = "block";
      });
  });
}
