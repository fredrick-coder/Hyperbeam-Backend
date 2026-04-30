const cors_proxy = require('cors-anywhere');
const host = '0.0.0.0';
const port = process.env.PORT || 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    // ADD THIS LINE TO DISABLE RATE LIMITING:
    checkRateLimit: (status) => null 
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
