/**
 * 
 *  Create object from request url
 */

 // Dependencies
 const $url = require('url');
 // End dependencies

 const _payload = {
  create: (req, buffer) => {
    //Parse the url
    function parsedUrl(req) {
      return $url.parse(req.url, true);
    }
    var parsedUrl = parsedUrl(req);

    //Create the url Object
    return {
      //Get the Path and trimmed it with replace
      path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),

      //Get the HTTP method
      method: req.method.toLowerCase(),

      //Get the queryString Object
      queryString: parsedUrl.query,

      //Get the Headers Object
      headers: req.headers,

      // Get the body
      body: buffer      
    }
  },
 }

 //exports
 module.exports = _payload;