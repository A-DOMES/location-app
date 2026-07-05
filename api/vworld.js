import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const app = express();

// /api/vworld 로 들어오는 요청만 프록시
app.use('/api/vworld', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld': '' }, // 여기서만 잘라냄
}));

export default app;
