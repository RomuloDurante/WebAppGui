/**
 * GET METHOD FOR USERS
 * 
 */
// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data');
  _tokensVerify = require('../token/tokens').verify;

// End Dependencies
const get = (payload, callback) => {

  // payload object
  var _payload = helpers.valid(payload);

  // Verify the If the token exists and if the ID match, so allow the user acess the service
 _tokensVerify(_payload.headers.token, _payload.queryString.phone, (tokenIsValid)=> {
    if(tokenIsValid) {

     /***************************GET USER SERVICE**************************************/ 
      if (_payload.queryString.phone) {
        // looked the user
        _data.read('users', _payload.queryString.phone, (err, data) => {
          if (!err && data) {
            //parse the data
            data = helpers.parseJson(data);
    
            // remove the password
            delete data.password;
    
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(400, { 'Error': 'phone does not exists' })
      }
    /************************************************************************************ */

    }else {
      callback(403, {Error: 'Missing require token and header'});
    }
 });

};


module.exports = get;