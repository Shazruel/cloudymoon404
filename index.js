const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://web.cloudmoonapp.com',
    changeOrigin: true,
    selfHandleResponse: true, // This allows us to modify the code
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            let html = responseBuffer.toString('utf8');
            // This "breaks" the redirect commands globally
            return html.replace(/window\.open/g, 'console.log')
                       .replace(/window\.top\.location/g, 'window.location')
                       .replace(/target="_blank"/g, 'target="_self"');
        }
        return responseBuffer;
    }),
}));

const port = process.env.PORT || 3000;
app.listen(port);
