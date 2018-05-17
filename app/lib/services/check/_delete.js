/**
 * 
 *  Checks DELETE
 */

// Dependencies
const helpers = require('../../helpers'),
      _data = require('../data');
// end dependencies

// Required data : ID
// Optional data None
const _delete = (payload, callback) => {
  //payload object
  var _payload = helpers.valid(payload);
  var id = _payload.queryString.id;
  // llok the check
  _data.read('checks', id, (err, data)=> {
    if(!err && data) {
      // parse the data
      var checkData = helpers.parseJson(data);

      // Verify the If the token exists and if the ID match, so allow the user acess the service
      _tokensVerify(_payload.headers.token, checkData.phone, (tokenIsValid)=> {
        if(tokenIsValid) {

          // delete the check data
          _data.delete('checks', id, (err)=> {
            if(!err) {
                /***************************MODIFY THE USER **************************************/ 
                  // looked the user
                  _data.read('users', checkData.phone, (err, data) => {
                    if (!err && data) {
                      // parse the data
                      var userData = helpers.parseJson(data);
                       // verify if the cheks exists
                       var userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                      // remove the delete check from the list of checks
                      var checkPosition = userChecks.indexOf(id);
                      if(checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        
                        // save the user data
                        _data.update('users', checkData.phone, userData, (err) => {
                          if (!err) {
                            callback(200, { ok: 'User check was deleted on the user' });
                          } else {
                            callback(500, { 'Error': 'Could not update the user' });
                          }
                        });      

                      } else {
                        callback(500, {Error : 'Could not find the position of the check'});
                      }
                    } else {
                      callback(500, { "Error": "Could not find the user who create the check" });
                    }
                  });
              /************************************************************************************ */
            } else {
              callback(500, {Error : 'Could not delete the check data'});
            }
          });
        }else {
          callback(403, {Error: 'Missing require token and header'});
        }
      });

    } else {
      callback(400, {Error : 'Could not read the check'});
    }
  });
}

module.exports = _delete;