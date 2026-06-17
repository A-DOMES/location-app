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

// ✅ 내 위치 추적 기능
function trackMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // 내 위치 마커 표시
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "내 위치",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#1976d2",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2
        }
      });

      // 지도 중심 이동
      map.setCenter({ lat, lng });
      map.setZoom(15);

      // 좌표창 업데이트
      document.getElementById("latBox").innerText = "위도: " + lat.toFixed(6);
      document.getElementById("lngBox").innerText = "경도: " + lng.toFixed(6);

      // 내 위치에서 모든 정보 조회
      handleMapClick(lat, lng);
    });
  } else {
    alert("이 브라우저에서는 위치 추적을 지원하지 않습니다.");
  }
}

// ✅ 팝업 닫기
function closeInfoPopup() {
  document.getElementById("infoPopup").style.display = "none";
}

// ✅ 버튼 이벤트 연결 (client.html에서 호출)
function showLandBuilding() {
  // 예시: 현재 위치 주변에 원형 오버레이 표시
  if (currentLat && currentLng) {
    new google.maps.Circle({
      center: { lat: currentLat, lng: currentLng },
      radius: 200,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.25,
      map: map
    });
  }
}
