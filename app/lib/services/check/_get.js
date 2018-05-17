/**
 * 
 *  Checks GET
 */

 // Dependencies
 
const helpers = require('../../helpers'),
      _data = require('../data'),
      _tokensVerify = require('../token/tokens').verify;
// end dependencies


// Required data: id
// Optional data: none
const _get = (payload, callback) => {
  // payload object
    var _payload = helpers.valid(payload);

  // look the check
    _data.read('checks', _payload.queryString.id, (err, data)=>{
      if(!err && data) {
          //parse the data
          var checkData = helpers.parseJson(data);
        
        //verify the token and belongs to the user who create the check
        _tokensVerify(_payload.headers.token, checkData.phone, (tokenIsValid)=> {         
          if(tokenIsValid) {
          // return the check data
            callback(200, checkData);
          }else {
            callback(403);
          }
        });
        
      }else{
        callback(404, {Error : "Could not read the check"});
      }
    });
  }
module.exports = _get;