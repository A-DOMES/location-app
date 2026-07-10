import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CONFIG } from './config.js';   // ✅ 대문자 CONFIG로 불러오기

const app = express();

/**
 * ✅ WMS 프록시 설정
 * - VWorld WMS 요청을 프록시로 중계
 * - API Key를 자동으로 붙여줌
 */
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wms',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '' },
  onProxyReq(proxyReq) {
    // 요청 URL에 key 파라미터가 없으면 추가
    if (!proxyReq.path.includes('key=')) {
      proxyReq.path += `&key=${CONFIG.API_KEY}`;
    }
  },
  onProxyRes(proxyRes) {
    // 응답이 HTML로 내려올 경우 content-type을 이미지로 교체
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'image/png';
    }
  }
}));

/**
 * ✅ WMTS 프록시 설정
 * - WMTS 요청은 API Key를 경로에 붙여야 함
 */
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wmts',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '' },
  onProxyReq(proxyReq) {
    // 요청 경로에 API Key가 없으면 추가
    if (!proxyReq.path.includes(CONFIG.API_KEY)) {
      proxyReq.path += `/${CONFIG.API_KEY}`;
    }
  }
}));

/**
 * ✅ WFS 프록시 설정
 * - WFS 요청을 프록시로 중계
 * - 반드시 key 파라미터 필요
 */
app.use('/api/vworld/req/wfs', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wfs',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wfs': '' },
  onProxyReq(proxyReq) {
    // 요청 URL에 key 파라미터가 없으면 추가
    if (!proxyReq.path.includes('key=')) {
      proxyReq.path += `&key=${CONFIG.API_KEY}`;
    }
  }
}));

export default app;
