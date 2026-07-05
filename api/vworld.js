import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';   // ✅ config.js에서 APIKEY 가져오기

const app = express();

// ✅ WMS 프록시
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wms',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '' },
  onProxyReq(proxyReq) {
    // 인증키 자동 추가
    if (!proxyReq.path.includes('APIKEY')) {
      proxyReq.path += `&APIKEY=${config.API_KEY}`;
    }
  },
  onProxyRes(proxyRes) {
    // 응답 헤더 보정 (타일이 HTML로 내려올 경우 방지)
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'image/png';
    }
  }
}));

// ✅ WMTS 프록시
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wmts',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '' },
  onProxyReq(proxyReq) {
    if (!proxyReq.path.includes('APIKEY')) {
      proxyReq.path += `/${config.API_KEY}`;
    }
  }
}));

export default app;
