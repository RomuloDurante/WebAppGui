/**
 *  POST METHOD FOR USERS
 */
// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data');


// End Dependencies

const post = (payload, callback) => {
  // payload object
  var _payload = helpers.valid(payload);

  // validathe the object and create body
  var body = _payload.body;

  // if body exists 
  if (body.firstName && body.lastName && body.password && body.phone && body.toAsgreement) {
    // hash the password
    body.password = helpers.hashPass(body.password);

    // beacuse this validation is for the get method
    delete body.extend;
    delete body.id;

    // create a new user if no exists in .data/users
    _data.create('users', body.phone, body, (err) => {
      if (err) {
        console.log(err);
        // if user already exists send error
        callback(400, err);
      } else {
        // if no erros send status 200 and body to setServer
        callback(200, body);
        console.log('User was create');
      }
    });

  } else {
    // if body return false
    callback(400, { 'Error': 'missing requirements !' });
  }

}

module.exports = post;