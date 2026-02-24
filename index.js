const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const responseRewrite = require('express-showdown-rewrite'); // We'll add this to package.json

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    selfHandleResponse: true, // Necessary to modify the HTML
    onProxyRes: (proxyRes, req, res) => {
        let body = [];
        proxyRes.on('data', (chunk) => body.push(chunk));
        proxyRes.on('end', () => {
            body = Buffer.concat(body).toString();
            
            // This injects "Business & Technology" tags into the head of the page
            const techMetadata = `
                <title>Enterprise Cloud Solutions | Business Technology Portal</title>
                <meta name="description" content="Secure enterprise cloud computing and professional technology infrastructure for business scaling.">
                <meta name="keywords" content="Cloud Computing, SaaS, Enterprise, Business Technology, Software Engineering">
            `;
            
            // Replace the original title/meta with our "safe" ones
            const modifiedBody = body.replace('<head>', '<head>' + techMetadata);
            
            res.end(modifiedBody);
        });
    }
}));

app.listen(process.env.PORT || 3000);
