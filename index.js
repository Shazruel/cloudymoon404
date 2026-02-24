const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    selfHandleResponse: true, // This allows us to edit the HTML
    onProxyRes: (proxyRes, req, res) => {
        let body = [];
        proxyRes.on('data', (chunk) => body.push(chunk));
        proxyRes.on('end', () => {
            let html = Buffer.concat(body).toString();
            
            // Injecting Business/Tech keywords to trick the filters
            const techMetadata = `
                <title>Enterprise Cloud Infrastructure | Tech Solutions</title>
                <meta name="description" content="Professional cloud computing and business technology services.">
            `;
            
            // Put our fake business info at the top of the head
            html = html.replace('<head>', '<head>' + techMetadata);
            
            res.end(html);
        });
    }
}));

const port = process.env.PORT || 3000;
app.listen(port);
