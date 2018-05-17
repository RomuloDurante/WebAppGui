/**
 *  Configure the http and https server
 */

// -> Depedencies
const $stringDecoder = require('string_decoder').StringDecoder,
            routers = require('../lib/routers'),
            payload = require('./_payload'),
            util = require('util');
            var debug = util.debuglog('server');

// End Dependencies

// config and configServers
const setServer= (req, res) => {
    //create decoder
    var decoder = new $stringDecoder('utf-8');
    var buffer = '';
    
    //request data for buffer and decoder it
    req.on('data', (data) => {
      
       buffer += decoder.write(data)
      
      });

    //end decoder
    req.on('end', () => {
          buffer += decoder.end();

          // create the payload object 
          var _payload = payload.create(req, buffer);
          
          //choose the router( if router do not exists use notfound)
          var chosenRouter = routers.choose(_payload);
          //call the choosed handler
          chosenRouter(_payload, (statusCode, body)=> {

            // use the status code back by handler, or default 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            //check of body exists
            body = typeof(body) === 'object' ? body : {};

            //convert the paylod(body) to a string
            var payloadString = JSON.stringify(body);

            //send the response
            res.setHeader('Content-Type', 'application/json')//response Json format
            res.writeHead(statusCode);
            res.end(payloadString);

            //if the response is 200(print green) otherwise print red
            if(statusCode == 200){
              debug('\x1b[32m%s\x1b[0m',_payload.method.toUpperCase()+' /'+_payload.path+' '+statusCode);
            } else {
              debug('\x1b[31m%s\x1b[0m',_payload.method.toUpperCase()+' /'+_payload.path+' '+statusCode);
            }
      });
    });
}

// exports 
module.exports = setServer;
