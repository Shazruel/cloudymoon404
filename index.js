const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const TARGET_URL = 'https://cloudmoonapp.pages.dev';

app.use('/', createProxyMiddleware({ 
    target: TARGET_URL, 
    changeOrigin: true,
    followRedirects: true, // Forces redirects to stay inside your URL
    autoRewrite: true,     // Rewrites the location headers automatically
    headers: {
        'Referer': TARGET_URL,
        'Origin': TARGET_URL
    },
    onProxyRes: (proxyRes, req, res) => {
        // Remove security headers that prevent the site from loading in frames/popups
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['x-frame-options'];
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy live on port ${port}`));
