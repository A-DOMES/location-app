import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// ✅ WMS 프록시
app.use('/api/vworld/req/wms', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wms',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wms': '' },
}));

// ✅ WMTS 프록시
app.use('/api/vworld/req/wmts', createProxyMiddleware({
  target: 'https://api.vworld.kr/req/wmts',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld/req/wmts': '' },
}));

export default app;
