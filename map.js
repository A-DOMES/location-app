// map.js
// Google Maps 오버레이 제어 파일
// 전역 변수 map은 client.html의 initMap()에서 이미 생성됨

// ✅ 지도 클릭 이벤트 → 클릭한 좌표의 모든 정보 조회 후 통합 팝업 표시
function handleMapClick(lat, lng) {
  if (typeof showLandBuildingInfo === 'function') {
    showLandBuildingInfo(lng, lat);
  }
  if (typeof showRealEstateInfo === 'function') {
    showRealEstateInfo(lng, lat);
  }
  if (typeof showLandUseInfo === 'function') {
    showLandUseInfo(lng, lat);
  }

  // 통합 팝업 열기
  document.getElementById("infoPopup").style.display = "block";
}

// ✅ 팝업 닫기
function closeInfoPopup() {
  document.getElementById("infoPopup").style.display = "none";
}

// ✅ 버튼 이벤트 연결 (client.html에서 호출)
function showLandBuilding() {
  // 단순히 오버레이 모듈 호출
  if (typeof showLandBuildingInfo === 'function') {
    // 현재 지도 중심 좌표를 가져와서 조회
    const center = map.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    showLandBuildingInfo(lng, lat);
  }
}
