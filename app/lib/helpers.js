/**
 * Methods for varios tasks
 * 
 */

 // -> Depedencies
 const crypto = require('crypto'),
      config = require('./config');


 // End Dependencies
 
 // container for all the helpers
 const helpers = {

   // Password hash SHA256 
   hashPass: (password)=> {

      var newPass = crypto.createHmac('sha256', config.hashSecret).update(password).digest('hex');

      return newPass;
   },

   /******************************************************* */
   // Parse the JSON file
   parseJson: (jsonFile)=> {
      try {
        var parse = JSON.parse(jsonFile);
        return parse;

      } catch (error) {
        return false;
      }
   },

   /********************************************************* */
   // generate TOKEN
   token: (phone)=> {
    var token = '';
    for (let i = 0; i < 20; i++) {
      var randon1 = Math.floor(Math.random() * 25);
      var randon2 = Math.floor(Math.random() * 25);
      var randon3 = Math.floor(Math.random() * 10);
     // ASCII char 
     if( i % 2 === 0){
      token += String.fromCharCode(97 + randon1) + String.fromCharCode(65 + randon2) + randon3;
     } else {
      token += String.fromCharCode(65 + randon2) + String.fromCharCode(97 + randon1) + randon3;
     }
      
    }
    
    const tokenObj = {
      id: token,
      phone: phone,
      expires: Date.now() + 1000 * 60 * 60
    }
   
    return tokenObj;
   },

   /**************************************************** */

   // validates strings
   valid: (payload)=> {  
    // Parse the body from payload 

      const body =  helpers.parseJson(payload.body);

          // make some verifications
          var dt = {
              //validate the body
              body:{
                firstName: typeof(body.firstName) === 'string' && body.firstName.trim().length > 0 ? body.firstName.trim() : false,
                lastName: typeof(body.lastName) === 'string' && body.lastName.trim().length > 0 ? body.lastName.trim() : false,
                phone: typeof(body.phone) === 'string' && body.phone.trim().length === 10 ? body.phone.trim() : false,
                password: typeof(body.password) === 'string' && body.password.trim().length > 0 ? body.password.trim() : false,
                toAsgreement: typeof(body.toAsgreement) === 'boolean' && body.toAsgreement === true ? true : false,
                // Validation for expires and id
                extend: typeof(body.extend) === 'boolean' && body.extend === true ? true : false,
                id: typeof(body.id) === 'string' && body.id.trim().length === 60 ? body.id.trim() : false,
              },
            
              // validation for the Headers
              headers: {
                token: typeof(payload.headers.token)  === 'string' ? payload.headers.token : false,
              },

              // validation for query strings
              queryString: {
                  phone: typeof(payload.queryString.phone) === 'string' && payload.queryString.phone.trim().length === 10 ?payload.queryString.phone.trim() : false,
                  id: typeof(payload.queryString.id) === 'string' && payload.queryString.id.trim().length === 60 ?payload.queryString.id.trim() : false,
              },

              // verify the protocol
              protocol: typeof(body.protocol)  === 'string'  && ['http', 'https'].indexOf(body.protocol) > -1 ? body.protocol : false,

              // verify the url
              url: typeof(body.url) === 'string' && body.url.trim().length > 0 ? body.url.trim() : false,

              // verify the method
              method: typeof(body.method)  === 'string'  && ['post', 'get', 'put', 'delete'].indexOf(body.method) > -1 ? body.method : false,

              // verify the sucessCode
              sucessCode: typeof(body.sucessCode) === 'object' && body.sucessCode instanceof Array && body.sucessCode.length > 0 ? body.sucessCode : false,

              // verify the url
              timeOutSeconds: typeof(body.timeOutSeconds) === 'number' && body.timeOutSeconds % 1 === 0 && body.timeOutSeconds >=1 && body.timeOutSeconds <= 5 ? body.timeOutSeconds : false,
            
          }
            // return the data object
            return dt;
      },
 
      // validate the data checks
      validateChecks: (checkData)=> {
        // check the check data
         checkData = typeof(checkData) == 'object' && checkData !== null ? checkData : {};

        const dt = {
              id: typeof(checkData.id) === 'string' && checkData.id.trim().length === 60 ? checkData.id.trim() : false,
              phone: typeof(checkData.phone) === 'string' && checkData.phone.trim().length === 10 ? checkData.phone.trim() : false,
              protocol: typeof(checkData.protocol) === 'string' && ['http', 'https'].indexOf(checkData.protocol) > -1 ? checkData.protocol : false,
              url: typeof(checkData.url) === 'string' && checkData.url.trim().length > 0 ? checkData.url.trim() : false,
              method: typeof(checkData.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(checkData.method) > -1 ? checkData.method : false,
              sucessCode: typeof(checkData.sucessCode) === 'object' && checkData.sucessCode instanceof Array && checkData.sucessCode.length > 0 ? checkData.sucessCode : false,
              timeOutSeconds:  typeof(checkData.timeOutSeconds) === 'number' && checkData.timeOutSeconds % 1 === 0 && checkData.timeOutSeconds >=1 && checkData.timeOutSeconds <= 5 ? checkData.timeOutSeconds : false,
              //set the keys that not be set if the workers never seeen this check
              state: typeof(checkData.state) === 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down',
              lastChecked: typeof(checkData.lastChecked) === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false,
        }   

        if(dt.id && 
          dt.method && 
          dt.phone && 
          dt.protocol && 
          dt.sucessCode && 
          dt.timeOutSeconds && 
          dt.url){
            return dt;
            
        } else {
          return false;
        }

      }


 }

 // Export helpers

 module.exports = helpers;