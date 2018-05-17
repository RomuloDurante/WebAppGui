/**
 * checks for organize the methods
 * 
 */

const checks = {
  post: require('./_post'),

  get: require('./_get'),

  put: require('./_put'),

  delete: require('./_delete'),

  // chosen the method
  startService: (payload, callback) => {
    // chosen the method
    var methods = ['post', 'get', 'put', 'delete'];
    if (methods.indexOf(payload.method) > -1) {

      //if get the method call the function
      checks[payload.method](payload, callback);

    } else {
      callback(405);
    }
  }

}

module.exports = checks;