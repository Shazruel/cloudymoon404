const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('accept-encoding', 'identity');
    },
    onProxyRes: (proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'] || '';
        
        // ONLY intercept and edit if it's an HTML page
        if (contentType.includes('text/html')) {
            let body = [];
            proxyRes.on('data', (chunk) => body.push(chunk));
            proxyRes.on('end', () => {
                let html = Buffer.concat(body).toString();
                
                const techMetadata = `
                    <title>Enterprise Cloud Infrastructure | Tech Solutions</title>
                    <meta name="description" content="Professional cloud computing and business technology services.">
                `;
                
                if (html.includes('<head>')) {
                    html = html.replace('<head>', '<head>' + techMetadata);
                }
                
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            });
        } else {
            // For CSS, JS, and Images, just pipe them through directly
            // This prevents the "White Screen" issue
            proxyRes.pipe(res);
        }
    }
}));

const port = process.env.PORT || 3000;
app.listen(port);
