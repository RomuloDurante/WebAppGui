/**
 *  Tokens - GET
 * 
 */

// -> Depedencies
const helpers = require('../../helpers'),
  _data = require('../data');

// End Dependencies

// require data: id
//optional data : none
const _get = (payload, callback) => {
// payload object
  var _payload = helpers.valid(payload);

  if (_payload.queryString.id) {
    // looked the token
    _data.read('tokens', _payload.queryString.id, (err, tokenData) => {
      if (!err && tokenData) {
        //parse the data
        parseData = helpers.parseJson(tokenData);

        callback(200, parseData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { 'Error': 'ID-> does not math !' })
  }
}


module.exports = _get;