import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/api/vworld', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/api/vworld': '' },
}));

export default app;
