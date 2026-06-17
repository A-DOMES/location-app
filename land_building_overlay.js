// land_building_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

function showLandBuilding() {
  // 지적도 오버레이
  const cadastreLayer = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      return `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Cadastre/${zoom}/${coord.y}/${coord.x}.png`;
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 19,
    name: "Cadastre"
  });
  map.overlayMapTypes.insertAt(0, cadastreLayer);

  // 건축물 오버레이
  const buildingLayer = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      return `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Building/${zoom}/${coord.y}/${coord.x}.png`;
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 19,
    name: "Building"
  });
  map.overlayMapTypes.insertAt(1, buildingLayer);

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
            <span style="font-size:17px; font-weight:bold;">
              <b>필지코드:</b> ${props.PNU || '정보 없음'}<br>
              <b>건물명:</b> ${props.BLD_NM || '정보 없음'}<br>
              <b>용도지역:</b> ${props.USE_ZONE || '정보 없음'}
            </span>
          `;
        } else {
          document.getElementById("landBuildingInfo").innerHTML = 
            "<span style='font-size:16px; font-weight:bold;'>토지·건축물 데이터를 찾을 수 없습니다.</span>";
        }

        // ✅ 통합 팝업 열기
        document.getElementById("infoPopup").style.display = "block";
      })
      .catch(error => {
        console.error("브이월드 API 호출 실패:", error);
        document.getElementById("landBuildingInfo").innerHTML = 
          "<span style='font-size:16px; font-weight:bold;'>데이터를 불러오지 못했습니다.</span>";
        document.getElementById("infoPopup").style.display = "block";
      });
  });
}
