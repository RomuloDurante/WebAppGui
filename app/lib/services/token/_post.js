/**
 *  Tokens - POST
 * 
 */

// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data');

// End Dependencies

const _post = (payload, callback) => {
  // payload object
  var _payload = helpers.valid(payload);
  // validate the object and create body
  var body = _payload.body;

  if (body.phone && body.password) {
    _data.read('users', body.phone, (err, userData) => {
      if (!err && userData) {
        // parse the data
        var parseData = helpers.parseJson(userData);

        // compare the password
        var hashedPassword = helpers.hashPass(body.password);
        if (hashedPassword == parseData.password) {

          //if valid create a new token
          var tokenObj = helpers.token(body.phone);

          //store the data
          _data.create('tokens', tokenObj.id, tokenObj, (err) => {
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, { 'Error': 'Could not create a new token' });
            }
          });

        } else {
          callback(400, { 'Error': 'Password did not math' });
        }
      } else {
        callback(400, { 'Error': 'Could not read the user' });
      }
    });

  } else {
    callback(400, { 'Error': 'Could not find the specifild user' });
  }
}


module.exports = _post;