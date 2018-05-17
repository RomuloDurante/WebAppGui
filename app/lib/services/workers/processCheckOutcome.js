 // Dependencies
 const _data = require('../data'),
       alertUser = require('./alertUser'),
       log = require('./logs/log'),
       util = require('util');
 debug = util.debuglog('workers');
 /*** */

 const processCheckOutcome = (validCheck, checkOutcome)=>{
      
      // // Decide if the check is UP or DOWN
      var state = !checkOutcome.error && checkOutcome.responseCode && validCheck.sucessCode.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

      // Decide if the alert is wanted
      var alertWanted = validCheck.lastChecked && validCheck.state !== state ? true : false;

      // Update the check data
      var newCheckData = validCheck;
      newCheckData.state = state;
      var timeNow = Date.now();
      newCheckData.lastChecked = timeNow;

      /****************** */
      // save the log files wit gzip
        log.logData(validCheck, checkOutcome, state, alertWanted, timeNow);
      /***************** */

      // save the update
      _data.update('checks', newCheckData.id, newCheckData, (err)=>{
        if(!err) {
          // Send the data to the next phase in the process if needed
          if(alertWanted) {
             alertUser(newCheckData);
          } else {
            debug('Check outcome has not changed, no alert needed');
          }
        } else {
          debug('Error try to save the updates checks');
        }
      });
}

// Export module
module.exports = processCheckOutcome;