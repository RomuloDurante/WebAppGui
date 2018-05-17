/**
 * Define object router requests
 */

 // -> Depedencies
    const  _users = require('./services/users/users'),
           _tokens = require('./services/token/tokens'),
           _checks = require('./services/check/checks');
// End Dependencies

// Public Router requests
const routers = {
  // SERVICES

  // Users service
  users: _users.startService,

  // Tokens Service
  tokens: _tokens.startService,

  // Tokens Service
  checks: _checks.startService,


  /*********************************************** */
  // COMMOM SERVICES

 //check status server
  ping: (payload, callback) => {
    // Callback a http status code and payload
    callback(200, {"Ping": "Ok ->..."});
  },

  // not found path
  notFound: (payload, callback) => {
    callback(404, {"Error": "Routine not found"});
  },

  //choose router
  choose: (payload) => {
      
      if(routers[payload.path] && payload.path !== 'choose') {

        return routers[payload.path];

      } else{
        return routers.notFound;
      }
    }

}

// Export routers
module.exports = routers;