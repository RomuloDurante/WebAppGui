/**
 * 
 *  Manage the token service
 */
// Dependencies
const _data = require('../data');
      helpers = require('../../helpers');
// end dependencies

const tokens = {
  post: require('./_post'),

  get: require('./_get'),

  put: require('./_put'),

  delete: require('./_delete'),

// verify if token and id is corrently valid
verify: (id, phone, callback)=> {
  
  _data.read('tokens', id, (err, tokenData)=> {
     //parse the data
     parseData = helpers.parseJson(tokenData);

    if(!err && parseData) {
      // check is the token is for the given user and has not expired
      if(parseData.phone === phone && parseData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    }else {
      callback(false);
    }
  });
},

 // chosen the method
 startService: (payload, callback) => {
   // chosen the method
   var methods = ['post', 'get', 'put', 'delete'];
   if(methods.indexOf(payload.method) > -1) {

     //if get the method call the function
      tokens[payload.method](payload, callback);

   } else {
     callback(405);
   }
 } 

}

module.exports = tokens;