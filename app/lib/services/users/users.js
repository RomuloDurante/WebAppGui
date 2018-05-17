/**
 * Users for organize the methods
 * 
 */


const users = {
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
      users[payload.method](payload, callback);

    } else {
      callback(405);
    }
  }

}

module.exports = users;