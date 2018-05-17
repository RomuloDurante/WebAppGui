 /**
  *  Start the servers
  */
 // -> Depedencies
 
 const startServer = require('./server/startServer'),
             config = require('./lib/config');
            workers = require('./lib/services/workers/workers');
 // End Dependencies


const app = {
  init: ()=> {
    // Start HTTP server
    startServer.http(config);
    // Start HTTPS server
    startServer.https(config);

    // Start workers
    workers.init();


  }
}

app.init();


// Exports app
module.exports = app;

