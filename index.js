const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.github.io', 
    changeOrigin: true,
    followRedirects: true,
    autoRewrite: true, // This is the key: it rewrites the URL in the browser's address bar back to your proxy
    headers: {
        'Referer': 'https://cloudmoonapp.github.io',
        'Origin': 'https://cloudmoonapp.github.io'
    },
    onProxyRes: (proxyRes, req, res) => {
        // Remove security headers that tell the browser "I am a frame"
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['x-frame-options'];
        
        // This ensures the game thinks it's on its own domain
        if (proxyRes.headers['location']) {
            console.log('Redirect blocked and rewritten');
        }
    }
}));

const port = process.env.PORT || 3000;
app.listen(port);
