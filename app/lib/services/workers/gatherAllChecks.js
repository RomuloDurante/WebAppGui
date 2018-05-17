/**
 * 
 *  Gather the checks
 */

 // Dependencies
 const _data = require('../data'),
 helpers = require('../../helpers'),
 performCheck = require('./performCheck'),
 util = require('util');
 debug = util.debuglog('workers');
// end dependencies

const gatherChecks = {
        //lookup all checks, get their data, send to a validator
        getherAllChecks: ()=> {
          // Get all the checks
          _data.list('checks', (err, checks)=>{
          
            if(!err && checks && checks.length > 0) {
                checks.forEach(check => {
                  // Read in the check data
                  _data.read('checks', check, (err, data)=>{
                      if(!err && data) {
                        //parse the data
                        var checkData = helpers.parseJson(data);
                        
                        // Pass the data to check validator, and let that function continue or not
                        gatherChecks.validateCheckData(checkData);
                      } else {
                        debug('Error reading the checks');
                      }
                  });   
                });

            } else {
              debug('Error, could not find any check to process');
            }
          });
        },

        // Sanity check the check data
        validateCheckData: (checkData)=>{
          // validate the checks
              var validCheck = helpers.validateChecks(checkData);

              if(validCheck) {
                performCheck(validCheck);
              } else {
                debug('Error: One of the checks is not properly formatted.');
              }
          
        },      
}
   
// Export 
module.exports = gatherChecks.getherAllChecks;