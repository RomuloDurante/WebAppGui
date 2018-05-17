/**
 * PUT METHOD FOR USERS
 * 
 */
// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data'),
  _tokensVerify = require('../token/tokens').verify;
// End Dependencies

const put = (payload, callback) => {
   // payload object
   var _payload = helpers.valid(payload);

    // validation for data update
    var dataToUpdate = _payload.body; // the body
    
  // Verify the If the token exists and if the ID match, so allow the user acess the service
  _tokensVerify(_payload.headers.token, _payload.queryString.phone, (tokenIsValid)=> {
    if(tokenIsValid) {

  /***************************GET PUT SERVICE**************************************/   
      if (dataToUpdate.phone) {
        if (dataToUpdate.firstName || dataToUpdate.lastName || dataToUpdate.password) {
          // Lookup the user
          _data.read('users', dataToUpdate.phone, (err, userData) => {

            if (!err && userData) {
              //parse the data
              var update = helpers.parseJson(userData);

              dataToUpdate.firstName ? update.firstName = dataToUpdate.firstName : '';
              dataToUpdate.lastName ? update.lastName = dataToUpdate.lastName : '';
              dataToUpdate.password ? update.password = helpers.hashPass(dataToUpdate.firstName) : '';

              // store the data
              _data.update('users', dataToUpdate.phone, update, (err) => {
                if (!err) {
                  callback(200, { OK: 'User was update' });
                } else {
                  callback(500, { "Error": 'Could not update the user' });
                }
              });
            } else {
              callback(400, { 'Error': 'The especified users does not exists' });
            }
          });
        } else {
          callback(400, { 'Error': 'Missing fields to update' });
        }
      } else {
        callback(400, { 'Error': 'Missing required fields' });
      }
  /************************************************************************************ */

    }else {
      callback(403, {Error: 'Missing require token and header'});
    }
  });

}

module.exports = put;

