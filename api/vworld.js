import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/': '' },
}));

export default app;
