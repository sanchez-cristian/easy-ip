const express = require('express');
var cors = require('cors')
const path = require('path');

const app = express();
app.use(cors()); 
const port = process.env.PORT || 5001;

// sendFile will go here
app.get('/', function(req, res) {
    const getIP = (req) => {
        const conRemoteAddress = req.connection?.remoteAddress; // deprecated
        
        const sockRemoteAddress = req.socket?.remoteAddress; // replacement for req.connection

        const xRealIP = req.headers['x-real-ip']; // some platforms use x-real-ip

        const xForwardedForIP = (() => {
          const xForwardedFor = req.headers['x-forwarded-for']; // most proxies use x-forwarded-for
          if (xForwardedFor) {
            // The x-forwarded-for header can contain a comma-separated list of IP's
            // Further, some are comma separated with spaces, so whitespace is trimmed.
            const ips = xForwardedFor.split(',').map(ip => ip.trim()); 
            console.log(ips); 
            return ips[0]; 
          }
        })()

        return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress // prefer x-forwarded-for and fallback to the others
    }

    res.json({ ip:getIP(req)});
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
