import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';   // ✅ config.js에서 APIKEY 가져오기

const app = express();

/**
 * ✅ WMS 프록시 설정
 * - 브라우저에서 직접 호출 시 CORS 문제 해결
 * - 브이월드 WMS는 반드시 `key=발급받은키` 파라미터 필요
 * - 응답이 HTML로 내려올 경우 content-type을 image/png로 보정
 */
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wms',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '' },
  onProxyReq(proxyReq) {
    // ✅ 인증키 자동 추가 (파라미터 이름은 반드시 key)
    if (!proxyReq.path.includes('key=')) {
      proxyReq.path += `&key=${config.API_KEY}`;
    }
  },
  onProxyRes(proxyRes) {
    // ✅ 응답 헤더 보정 (타일이 HTML로 내려올 경우 방지)
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'image/png';
    }
  }
}));

/**
 * ✅ WMTS 프록시 설정
 * - WMTS는 RESTful URL 구조라서 키를 path에 포함시켜야 함
 * - 예: /req/wmts/1.0.0/{API_KEY}/LayerName/{z}/{y}/{x}.png
 */
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wmts',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '' },
  onProxyReq(proxyReq) {
    // ✅ API Key를 path에 자동 추가
    if (!proxyReq.path.includes(config.API_KEY)) {
      proxyReq.path += `/${config.API_KEY}`;
    }
  }
}));

export default app;
