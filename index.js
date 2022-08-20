const express = require('express');
var cors = require('cors')

const app = express();
app.use(cors()); 

// use port 3000 unless there exists a preconfigured port on a server (e.g. Heroku)
const port = process.env.PORT || 3017;
 
app.get('/', function(req, res) {
    const getIP = (req) => {
        const conRemoteAddress = req.connection?.remoteAddress; // deprecated
        
        const sockRemoteAddress = req.socket?.remoteAddress; // replacement for req.connection -> on localhost this is the correct one

        const xRealIP = req.headers['x-real-ip']; // some platforms use x-real-ip

        const xForwardedForIP = (() => { 
          const xForwardedFor = req.headers['x-forwarded-for']; // most proxies use x-forwarded-for
          if (xForwardedFor) { 
            // The x-forwarded-for header can contain a comma-separated list of IP's
            // Further, some are comma separated with spaces, so whitespace is trimmed.
            const ips = xForwardedFor.split(',').map(ip => ip.trim()); 
            return ips[0]; 
          } 
        })

        return xForwardedForIP() || xRealIP || sockRemoteAddress || conRemoteAddress // prefer x-forwarded-for and fallback to the others
    }

    //returning and JSON object with the IP
    res.json(
      { 
        ip: getIP(req) 
      }  
    );
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
