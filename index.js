const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
    target: 'https://cloudmoonapp.pages.dev', 
    changeOrigin: true,
    followRedirects: true,
    // This helps keep popups and login sessions working
    cookieDomainRewrite: "" 
}));

// Railway automatically provides a PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Mirror running on port ${port}`);
});
