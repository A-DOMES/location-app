const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/vworld', createProxyMiddleware({
  target: 'https://api.vworld.kr',
  changeOrigin: true,
  pathRewrite: { '^/vworld': '' }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
