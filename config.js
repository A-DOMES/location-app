// config.js

// ✅ 사용자 서버 URL
const CONFIG = {
  USER_URL: "https://script.google.com/macros/s/AKfycbwDuL2cpxeN-4nH980-Y8TDkF-MV3H53Pqe1mru75J5-cOmLtcpC2RcWO52vQga44_Aag/exec",

  // ✅ 관리자 서버 URL
  ADMIN_URL: "https://script.google.com/macros/s/AKfycbwIzDhgf40OiEVf-vRAsCtO-Yyf-0F70wOtwwOL3vVFzLw3Scb5Ur216Bq8C4hco7l5eQ/exec",

  // ✅ client.html (조회용 페이지)
  CLIENT_URL: "client.html",

  // ✅ 브이월드 API 키
  API_KEY: "48BF8F59-D37C-3BA1-916E-1E5B135EC360",

  // ✅ 국토부 실거래가 API 키 (data.go.kr에서 발급받은 서비스키)
  MOLIT_KEY: "c2f4f12f4f248e4805222b988738c8e645bbcb2be5f80573a2a9b0815881ddd5",
    
  // ✅ 구글 지도 Map ID (환경별)
  mapIds: {
    android: "5bd2daaa37ebfc3fe0839614",
    ios: "5bd2daaa37ebfc3faedae42d",
    javascript: "5bd2daaa37ebfc3f6b7ad5e2",
    fixed: "5bd2daaa37ebfc3f466d5e4c"
  },

    // ✅ 기본 좌표 및 간격
  DEFAULT_CENTER: { lat: 36.5, lng: 127.5 }, // 대한민국 중앙 좌표
  DEFAULT_INTERVAL: 60000 // 1분 (밀리초)
};
