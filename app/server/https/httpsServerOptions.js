/**
 * config the https server options
 */

 // -> Depedencies
const $fs = require('fs');


// End Dependencies


//HTTPS options
 const httpsServerOptions = {
      key: $fs.readFileSync('./app/server/https/key.pem'),
      cert: $fs.readFileSync('./app/server/https/cert.pem')

 }

 // Export https option
 module.exports = httpsServerOptions;