/**
 * Define object router requests
 */

 // -> Depedencies
    const  _users = require('./services/users/users'),
           _tokens = require('./services/token/tokens'),
           _checks = require('./services/check/checks'),
           index = require('../public/templates/htmlScripts/index'),
           public = require('../public/public');
          
// End Dependencies

// Public Router requests
const routers = {
  // SERVICES
 /***************Templates****************** */
  '' : index,
  // 'account/create' : accountCreate,
  // 'account/edit' : accountEdit,
  // 'account/deleted' : accountDeleted,
  // 'session/create' : sessionCreate,
  // 'session/deleted' : sessionDeleted,
  // 'checks/all' : checkList,
  // 'checks/create' : checksCreate,
  // 'checks/edit' : checksEdit,
  'public' : public.startService,
 /****************JSON API************************/ 
  // Users service
  'api/users': _users.startService,
  // Tokens Service
  'api/tokens': _tokens.startService,
  // Tokens Service
  'api/checks': _checks.startService,
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

      } else if(payload === 'public'){
        return routers.public;

      } else{
        return routers.notFound;
      }
    }

}

// Export routers
module.exports = routers;