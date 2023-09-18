const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy requests with '/api' prefix to your backend server.
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000', // Change this to your backend server's URL
      changeOrigin: true,
    })
  );
};
