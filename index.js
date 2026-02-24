const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    followRedirects: true,
    cookieDomainRewrite: "",
    onProxyReq: (proxyReq, req, res) => {
        // Remove headers that identify this as a proxy
        proxyReq.removeHeader('x-forwarded-for');
        proxyReq.removeHeader('x-forwarded-proto');
        proxyReq.removeHeader('x-forwarded-host');
        proxyReq.removeHeader('via');
    },
    onProxyRes: (proxyRes, req, res) => {
        // Security filters often block sites that allow 'iframes' or 'sniffing'
        // We delete these so the filter doesn't see "proxy-like" security settings
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
    }
}));

const port = process.env.PORT || 3000;
app.listen(port);
