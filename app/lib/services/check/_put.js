/**
 * 
 *  Checks PUT
 */

// Dependencies
const helpers = require('../../helpers'),
        _data = require('../data'),
        _tokensVerify = require('../token/tokens').verify;
// end dependencies

const _put = (payload, callback)=> {
  // payload object
  var _payload = helpers.valid(payload);
  // get the id
  var id = _payload.body.id;

  if(id) {
    // check make sure the optional data has been sent
    if(_payload.protocol || _payload.url || _payload.method || _payload.sucessCode || _payload.timeOutSeconds) {
      // read the checks
      _data.read('checks', id, (err, data)=> {
        if(!err && data) {
          //parse the data
          var checkData = helpers.parseJson(data);

          //verify the token and belongs to the user who create the check
          _tokensVerify(_payload.headers.token, checkData.phone, (tokenIsValid)=> {         
            if(tokenIsValid) {
              // Update the checkObjet
              _payload.protocol ? checkData.protocol = _payload.protocol : '';
              _payload.url ? checkData.url= _payload.url : '';
              _payload.method ? checkData.method = _payload.method : '';
              _payload.sucessCode ? checkData.sucessCode = _payload.sucessCode : '';
              _payload.timeOutSeconds ? checkData.timeOutSeconds = _payload.timeOutSeconds : '';

              // store the updates
              _data.update('checks', id, checkData, (err)=> {
                if(!err) {
                  callback(200);
                } else {
                  callback(500, {Error : "could not update the check"});
                }
              });
            }else {
              callback(403);
            }
          });

        } else {
          callback(400, {Error : 'check ID did not exist'});
        }
      });

    }else {
      callback(400, {Error : 'Missing fields to update'});
    }
  } else {
    callback(400, {Error : "Missing required field"});
  }
}

module.exports = _put;