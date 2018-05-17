
 // Dependencies
 const path = require('path'),
 https = require('https'),
 http = require('http'),
 url = require('url'),
 processCheckOutcome = require('./processCheckOutcome'),
 util = require('util');
 debug = util.debuglog('workers');
 /*** */


 // Perfom the check, send the validate check and outcome the check process  to the next step
 var performCheck = (validCheck)=> {
        // Prepare the initial check outcome
        const checkOutcome = {
          error : false,
          responseCode: false
        };

        // Mark that the outcome has not been sent yet
        var outcomeSent = false;

        // Parse the url and the path out the original check data
        var parsedUrl = url.parse(validCheck.protocol+'://'+ validCheck.url, true);
        var hostName = parsedUrl.hostname;
        var path = parsedUrl.path; 

        // construct the request
        const requestDetails = {
          protocol : validCheck.protocol+':',
          hostname : hostName,
          method : validCheck.method.toUpperCase(),
          path : path,
          timeout : validCheck.timeOutSeconds * 1000
        };

        // Instantiate the request object (http or https)
        var _moduleToUse = validCheck.protocol === 'http' ? http : https;
        var req = _moduleToUse.request(requestDetails, (res)=>{
          // Grab the status of the sent request
          var status = res.statusCode;
          // Update the check outcome and pass the data along
          checkOutcome.responseCode = status;
          if(!outcomeSent) {
            processCheckOutcome(validCheck, checkOutcome);
            outcomeSent = true;
          }
        });

        // Bind the error
        req.on('error', (err)=>{
          // // If ERROR update the checkPutcome outcome and pass the data along
          checkOutcome.error = {
            'error': true,
            'value': err
          };
          if(!outcomeSent) {
            processCheckOutcome(validCheck, checkOutcome);
            outcomeSent = true;
          }        
        });

        //Bind the timeout 
        req.on('timeout', (err)=>{
          // //If ERROR update the checkOutcome outcome and pass the data along
          checkOutcome.error = {
            'error': true,
            'value': timeout
          };
          if(!outcomeSent) {
            processCheckOutcome(validCheck, checkOutcome);
            outcomeSent = true;
          }        
        });

        // End the request
        req.end();
}


//export module
module.exports = performCheck;