const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    selfHandleResponse: true, 
    onProxyReq: (proxyReq, req, res) => {
        // IMPORTANT: Tell the target site NOT to send compressed data
        proxyReq.setHeader('accept-encoding', 'identity');
    },
    onProxyRes: (proxyRes, req, res) => {
        let body = [];
        proxyRes.on('data', (chunk) => body.push(chunk));
        proxyRes.on('end', () => {
            let html = Buffer.concat(body).toString();
            
            // Re-injecting your Business/Tech keywords
            const techMetadata = `
                <title>Enterprise Cloud Infrastructure | Tech Solutions</title>
                <meta name="description" content="Professional cloud computing and business technology services.">
            `;
            
            // Check if <head> exists before replacing
            if (html.includes('<head>')) {
                html = html.replace('<head>', '<head>' + techMetadata);
            }
            
            // Tell the browser this is an HTML website, not a download
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        });
    }
}));

const port = process.env.PORT || 3000;
app.listen(port);
