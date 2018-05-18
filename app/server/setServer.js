/**
 *  Configure the http and https server
 */

// -> Depedencies
const stringDecoder = require('string_decoder').StringDecoder,
            routers = require('../lib/routers'),
            payload = require('./_payload'),
            util = require('util');
            var debug = util.debuglog('server');

// End Dependencies

// config and configServers
const setServer= (req, res) => {
    //create decoder
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    
    //request data for buffer and decoder it
    req.on('data', (data) => {
      
       buffer += decoder.write(data);
      
      });

    //end decoder
    req.on('end', () => {
          buffer += decoder.end();

          // create the payload object 
          var _payload = payload.create(req, buffer);
          
          //choose the router( if router do not exists use notfound)
          var chosenRouter = '';

          if(_payload.path.split('/').indexOf('public') > -1){
            chosenRouter = routers.choose('public');
          } else {
            chosenRouter = routers.choose(_payload);
          }

          //call the choosed handler
          chosenRouter(_payload, (statusCode, payload, contentType)=> {
              // determine the type of response (fallback to JSON)
              contentType = typeof(contentType) === 'string' ? contentType : 'json';

              // use the status code back by handler, or default 200
              statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

              //send the response parts that are content-specific

              var payloadString = '';

              if(contentType === 'json') {
                res.setHeader('Content-Type', 'application/json');//response Json format
                payload = typeof(payload) === 'object' ? payload : {};
                payloadString = JSON.stringify(payload);

              } else if(contentType === 'html') {
                res.setHeader('Content-Type', 'text/html');//response html
                payloadString = typeof(payload) === 'string' ? payload : '';

              } else if(contentType === 'css') {
                res.setHeader('Content-Type', 'text/css');//static css
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
                
              } else if(contentType === 'js') {
                res.setHeader('Content-Type', 'text/javascript');//static javascript
                payloadString = typeof(payload) !== 'undefined' ? payload : '';

              } else if(contentType === 'ico') {
                res.setHeader('Content-Type', 'image/x-icon');//static javascript
                payloadString = typeof(payload) !== 'undefined' ? payload : '';

              } else if(contentType === 'png') {
                res.setHeader('Content-Type', 'image/png');//static javascript
                payloadString = typeof(payload) !== 'undefined' ? payload : '';

              }else if(contentType === 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');//static javascript
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }


              // return the response parts common
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
