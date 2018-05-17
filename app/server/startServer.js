/**
 * Configure the server
 */

  // -> Depedencies
  const $http = require('http'),
        $https = require('https'),
        setServer = require('./setServer'),
        httpsServerOptions = require('./https/httpsServerOptions');
  //End Dependencies

  // ->Server Config
  const startServer = {
    //config HTTP server
    http: (config) => {
      return $http.createServer((req, res) => {
        //config HTTP server
        setServer(req, res);        
      }
      ).listen(config.httpPORT, () => console.log('\x1b[36m%s\x1b[0m','HTTP Server Start in ['+config.envName+']-mode : PORT-> '+ config.httpPORT));
    },

    //config HTTPS server
    https: (config) => {
      return $https.createServer( httpsServerOptions, (req, res) => {
        //configServers
        setServer(req, res);        
      }
      ).listen(config.httpsPORT, () => console.log('\x1b[34m%s\x1b[0m','HTTPS Server Start in ['+config.envName+']-mode : PORT-> '+ config.httpsPORT));
    },
  }

//Export server
module.exports = startServer;

