import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config.js';   // ✅ config.js에서 APIKEY 가져오기

const app = express();

/**
 * ✅ WMS 프록시 설정
 */
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wms',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '' },
  onProxyReq(proxyReq) {
    if (!proxyReq.path.includes('key=')) {
      proxyReq.path += `&key=${config.API_KEY}`;
    }
  },
  onProxyRes(proxyRes) {
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'image/png';
    }
  }
}));

/**
 * ✅ WMTS 프록시 설정
 */
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wmts',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '' },
  onProxyReq(proxyReq) {
    if (!proxyReq.path.includes(config.API_KEY)) {
      proxyReq.path += `/${config.API_KEY}`;
    }
  }
}));

/**
 * ✅ WFS 프록시 설정
 * - 브라우저에서 직접 호출 시 CORS 문제 해결
 * - 반드시 key 파라미터 필요
 */
app.use('/api/vworld/req/wfs', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wfs',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wfs': '' },
  onProxyReq(proxyReq) {
    if (!proxyReq.path.includes('key=')) {
      proxyReq.path += `&key=${config.API_KEY}`;
    }
  }
}));

export default app;
