/****
 * 
 *  Load the publics assets
 */

//Dependencies
const fs = require('fs'),
      path = require('path'),
      config = require('../lib/config');

//end dependencies

//Paths
var staticsDir = path.join(__dirname,'/statics/' );
var imagesDir = path.join(__dirname,'/images/' );


 const public = {
  jpg: (payload, callback, file)=>{

    var dir = imagesDir + file;
    public.loadFile(dir, 'jpg', callback);
  },

  css: (payload, callback, file)=>{

     var dir = staticsDir + file;
     public.loadFile(dir, 'css', callback);
  },

  js: (payload, callback, file)=>{

    var dir = staticsDir + file;
    public.loadFile(dir, 'js', callback);
  },

  png: (payload, callback, file)=>{

     var dir = imagesDir + file;
     public.loadFile(dir, 'png', callback);
  },

  ico: (payload, callback, file)=>{

    var dir = imagesDir + file;
    public.loadFile(dir, 'ico', callback);
  },
  


    // read the file and load it
  loadFile: (dir, mime, callback)=>{
      
      fs.readFile(dir, (err, staticFile)=>{         
        if(!err && staticFile){         
          callback(200, staticFile, mime);
        } else {
          callback(400, { Error: 'Could not find the static file'}, undefined);
        }
      });
    },

// chosen the method
startService: (payload, callback) => {
  var file = payload.path.replace('public/','').trim();
  var splitFile = file.split('.');
  // chosen the method
  var staticFiles = ['jpg', 'css', 'js', 'png', 'ico'];
  if (staticFiles.indexOf(splitFile[1]) > -1) {

    //if get the file call the function
    public[splitFile[1]](payload, callback, file);

  } else {
    callback(405);
  }
} 
 }

 module.exports = public;