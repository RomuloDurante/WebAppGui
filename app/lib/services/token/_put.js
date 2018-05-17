/**
 *  Tokens - PUT
 * 
 */

// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data');

// End Dependencies


//require fields: ID and EXTEND
//Optional data : node
const _put = (payload, callback) => {
  // payload object
   var _payload = helpers.valid(payload);

  // validate the phone send for query string
  var body = _payload.body;


  if(body.id && body.extend){
     // looked the token
     _data.read('tokens', body.id, (err, tokenData) => {
      if (!err && tokenData) {
        //parse the data
        parseData = helpers.parseJson(tokenData);
        // check if the token is not expired
        if(parseData.expires > Date.now()) {
          // Set the expiration an hour from now
          parseData.expires = Date.now() + 1000 * 60 * 60;

          // store the new updates
          _data.update('tokens', parseData.id, parseData, ()=>{
            if(!err) {
              callback(200, {Token : 'Was Update'})
            }else {
              callback(500, {Error : 'Could not update the token'});
            }
          });

        } else {
          callback(400, {Error : 'The tpken is already expired'});
        }
      } else {
        callback(404, {Error : 'Specified token does not exist'});
      }
    });
  } else {
    callback(400, {Error : 'Missing invalid fields or invalid'});
  }
 
}


module.exports = _put;