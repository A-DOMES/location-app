// real_estate_overlay.js
// config.js가 먼저 로드되어 있어야 함
const API_KEY = CONFIG.API_KEY;

// 실거래가 조회 함수
function showRealEstateInfo(lon, lat) {
  // 국토부 실거래가 API 호출
  fetch(`https://api.vworld.kr/req/data?service=data&request=GetFeature&key=${API_KEY}&geometry=POINT(${lon} ${lat})&size=10&data=RTMS_OBJS`)
    .then(response => response.json())
    .then(data => {
      const features = data.response?.result?.featureCollection?.features;
      if (features && features.length > 0) {
        const props = features[0].properties;
        document.getElementById("realEstateInfo").innerHTML = `
          <b>거래금액:</b> ${props.DEAL_AMOUNT || '정보 없음'}<br>
          <b>거래일자:</b> ${props.DEAL_YMD || '정보 없음'}<br>
          <b>건물명:</b> ${props.BLD_NM || '정보 없음'}
        `;
      } else {
        document.getElementById("realEstateInfo").innerHTML = "실거래가 데이터를 찾을 수 없습니다.";
      }

      // ✅ 통합 팝업 열기
      document.getElementById("infoPopup").style.display = "block";
    })
    .catch(error => {
      console.error("실거래가 API 호출 실패:", error);
      document.getElementById("realEstateInfo").innerHTML = "데이터를 불러오지 못했습니다.";
      document.getElementById("infoPopup").style.display = "block";
    });
}
