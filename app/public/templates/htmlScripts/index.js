/**
 * 
 *  render the index page
 */

 // Dependencies
const inject = require('./inject');
 // end dependencies

 const index = (payload, callback)=>{

  // Reject any request that isnt a GET
  if(payload.method === 'get') {
    const data = {
      body_class: 'Butão',
      head_title: ' FirstPagina',
      Main_Title: 'Hello World'
    }
    // Read in a templae as a string
    inject.getTemplate('index', data, (err, str)=>{     
      if(!err && str){
        callback(200, str, 'html');  
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }

 }

 module.exports = index;