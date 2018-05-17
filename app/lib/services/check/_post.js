/**
 * 
 *  Checks POST
 */

// Dependencies
const helpers = require('../../helpers'),
        _data = require('../data'),
        config = require('../../config');
// end dependencies


 // Required data: protocol, url, method, sucessCodes, timeOutSeconds
 //Optional Data : none
 const _post = (payload, callback)=> {
   // payload object
  var _payload = helpers.valid(payload);

  if(_payload.protocol && _payload.url && _payload.method && _payload.sucessCode && _payload.timeOutSeconds) {
    // Get the token from the header
    var token = _payload.headers.token;

    // try to read the token from the user
    _data.read('tokens', token, (err, data)=> { 
      if(!err && data) {
        //parse the tokenData and take the phone
        var tokenData = helpers.parseJson(data);
        var phone = tokenData.phone;

        // look the user data
        _data.read('users', phone, (err, data)=> {
          if(!err && data) {
            //parse the userdata
            var userData = helpers.parseJson(data);
            
            // verufy if the cheks exists, if not create a empty array
            var userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

            // verify if the user has less than the number of max-checks per user
              if(userChecks.length < config.maxChecks) {
                // create an object with the random id for the check
                var checkObj = helpers.token(phone);
                delete checkObj.expires; // this is valid for the token

                // update the checkObj with this values
                checkObj.protocol = _payload.protocol;
                checkObj.url = _payload.url;
                checkObj.method = _payload.method;
                checkObj.sucessCode = _payload.sucessCode;
                checkObj.timeOutSeconds = _payload.timeOutSeconds;

                // save the check object
                _data.create('checks', checkObj.id, checkObj, (err)=> {
                  if(!err) {
                    // Add the check id to the user object
                    userData.checks = userChecks;
                    userData.checks.push(checkObj.id);

                    // save the new user data
                    _data.update('users', phone, userData, (err)=>{
                      if(!err) {
                        // return data about the new check
                        callback(200, checkObj);
                      } else {
                        callback(500, {Error : 'Could not update the user with the new check'});
                      }
                    });
                  } else {
                    callback('checks', {Error : 'Could not create the new check'});
                  }
                });
              }else {
                callback(400, {Error : "User already has the number max of checks"});
              }
          } else {
            callback(403, {Error : 'Could not find the user'});
          }
          
        });

      }else {
        callback(400, {Error : 'Colud not find the token id'});
      }
    });
    
  } else {
    callback(400, {Error : 'Missing require inputs for checks'});
  }
  
 }

 module.exports = _post;