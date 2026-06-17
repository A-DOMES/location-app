// landuse_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

function showLandUseInfo() {
  // 지도 클릭 이벤트 → 브이월드 토지이용계획 API 호출
  map.addListener("click", (e) => {
    const lat = e.latLng.lat();
    const lon = e.latLng.lng();

    fetch(`https://api.vworld.kr/req/data?service=data&request=GetFeature&key=${API_KEY}&geometry=POINT(${lon} ${lat})&size=10&data=LT_L_USEZONE`)
      .then(response => response.json())
      .then(data => {
        const features = data.response?.result?.featureCollection?.features;
        if (features && features.length > 0) {
          const props = features[0].properties;
          document.getElementById("landUseInfo").innerHTML = `
            <b>용도지역:</b> ${props.USE_ZONE || '정보 없음'}<br>
            <b>세부지역:</b> ${props.DETAIL_ZONE || '정보 없음'}
          `;
        } else {
          document.getElementById("landUseInfo").innerHTML = "토지이용계획 데이터를 찾을 수 없습니다.";
        }

        // ✅ 통합 팝업 열기
        document.getElementById("infoPopup").style.display = "block";
      })
      .catch(error => {
        console.error("토지이용계획 API 호출 실패:", error);
        document.getElementById("landUseInfo").innerHTML = "데이터를 불러오지 못했습니다.";
        document.getElementById("infoPopup").style.display = "block";
      });
  });
}
