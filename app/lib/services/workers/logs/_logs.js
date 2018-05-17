/****
 * Library for store and rotating logs
 * 
 * 
 */

  // Dependencies
const path = require('path'),
      zlib = require('zlib'),
      fs = require('fs'),
      util = require('util');
 debug = util.debuglog('workers');
/*** */

 // create a base directory
 const baseDir = path.join(__dirname, '/../../../../.log/');

 // container for logs

 const _logs = {
      // append the string to a file. Create the file if it does not exists
      append: (data, callback)=>{          
          // Covert data to a string
          const dataString = JSON.stringify(data);

          // determine the name of the log file
          var fileName = data.check.id;

          // Open the file for appending
          fs.open(baseDir + fileName+'.log', 'a', (err, fileDescriptor)=>{
                  if(!err && fileDescriptor) {
                  // Append to the file and close it
                  fs.appendFile(fileDescriptor, dataString + '\n', (err)=>{
                  if(!err) {
                        fs.close(fileDescriptor, (err)=>{
                        if(!err) {
                        callback(false);
                        } else {
                        callback('Error close the file was being appended');
                        }
                        });
                  } else {
                  callback('Error appendign the file');    
                  }
                  });
            } else {
              callback('Could not open the file to appending');
            }
          });

      },

      rotateLogs: ()=>{
        // Listem all the non compress the log files
        _logs.list(false, (err, logs)=>{
           
           if(!err && logs) {
            logs.forEach((logName)=>{
               // compress the data to a diferent file
               var logId = logName.replace('.log',''); 
               var newFileId = logId+'-'+Date.now();
              _logs.compress(logId, newFileId, (err)=>{
                 if(!err) {
                  // truncate the log
                  _logs.truncate(logId, (err)=>{
                   if(!err) {
                     debug(" Sucess truncate the log file");
                   } else {
                     debug("Error truncate the lof file");
                   }
                  });
                 } else {
                  debug('Erro compressing one of the log files', err);
                 }
              });
            });
           } else {
            debug('Error could not find any logs to rotate');
           }
        });
      },

      // list all the logs, and optionally include the compressed logs
      list: (includeCompressedLogs, callback)=>{
        fs.readdir(baseDir, (err, data)=>{
          if(!err && data && data.length > 0){
            var trimmedFilesNames = [];
            data.forEach(filename =>{
               // Add the .log files
               if(filename.indexOf('.log') > -1){
                  trimmedFilesNames.push(filename.replace('.log',''));
               }

               // Add on the .gz files
               if(filename.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                  trimmedFilesNames.push(filename.replace('.gz.b64'),'');
               }
            });
            callback(false, trimmedFilesNames);
          }else {
            callback(err, data);
          }
        });
      },

      // compress the constents of on .log file into a gz.b64 file with the same directory
      compress: (logId, newFileId, callback)=>{
        var sourceFile = logId+'.log';
        var destFile = newFileId+'.gz.b64';

        //read the source file
        fs.readFile(baseDir+sourceFile,'utf8',(err, inputString)=>{
          if(!err && inputString){
            //compress the data using gzip
            zlib.gzip(inputString, (err, buffer)=>{
              if(!err && buffer) {
                  // Send the data to destination file
                  fs.open(baseDir+destFile, 'wx', (err, fileDescriptor)=>{
                     if(!err, fileDescriptor) {
                        // Write to the destination file
                        fs.writeFile(fileDescriptor, buffer.toString('base64'), (err)=>{
                           if(!err) {
                              // close the destination file
                              fs.close(fileDescriptor, (err)=>{
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback(err);
                                }
                              });
                           }else {
                              callback(err);
                           }
                        });
                     } else {
                        callback(err);
                     }
                  });
              } else {
               callback(err);
              }
            });
          } else {
            callback(err);
          }
        });
      },

      // truncate
      truncate: (logId,callback)=> {
            fs.truncate(baseDir+logId+'.log', 0, function(err){
              if(!err){
                callback(false);
              } else {
                callback(err);
              }
            });
          },

      // decompressed the contents of a gz.b64
      decompress: (fileId,callback)=> {
            var fileName = fileId+'.gz.b64';
            fs.readFile(baseDir+fileName, 'utf8', function(err,str){
              if(!err && str){
                // Inflate the data
                var inputBuffer = Buffer.from(str, 'base64');
                zlib.unzip(inputBuffer,function(err,outputBuffer){
                  if(!err && outputBuffer){
                    // Callback
                    var str = outputBuffer.toString();
                    callback(false,str);
                  } else {
                    callback(err);
                  }
                });
              } else {
                callback(err);
              }
            });
          }
 }


//Export the module
module.exports = _logs;