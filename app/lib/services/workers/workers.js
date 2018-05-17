/**
 * 
 *  Worker realted tasks
 */

 // Dependencies
const gatherAllChecks = require('./gatherAllChecks');
      rotateLogs = require('./logs/_logs').rotateLogs;
 // end dependencies
 

 // Worker object
 const worker = {
   // init script
   init: ()=> { 
     // msg the works started
      console.log('\x1b[33m%s\x1b[0m','Background Workers is running->...');
      // call the loop the checks will execute later on
      worker.loop(gatherAllChecks);

      //compress all the logs imediately
      rotateLogs();

      // call the compression loop so logs will be compressed later on
      worker.loopRotation(rotateLogs);

   },

    // Timer to execulte the worker process once per minute
    loop: (fn)=>{
      setInterval(()=>{
       fn();
      },1000 * 5);
    },

    // Timer to execulte log-rotation process one time per day
    loopRotation: (fn)=>{
      setInterval(()=>{
       fn();
      },1000 * 60 * 60 * 24); 
    },

 }

 // export
 module.exports = worker;