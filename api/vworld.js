import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';

const app = express();

// ✅ WMS 프록시
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '/req/wms' },
  onProxyReq(proxyReq) {
    // APIKEY 자동 추가
    const url = proxyReq.path;
    if (!url.includes('APIKEY')) {
      if (url.includes('?')) {
        proxyReq.path += `&APIKEY=${config.API_KEY}`;
      } else {
        proxyReq.path += `?APIKEY=${config.API_KEY}`;
      }
    }
  },
  onProxyRes(proxyRes) {
    // 응답 헤더 보정
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'image/png';
    }
  }
}));

// ✅ WMTS 프록시 (필요 없다면 제거 가능)
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '/req/wmts' },
}));

export default app;
