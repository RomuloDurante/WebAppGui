
   var fs = require('fs');


  //  var test = fs.readFileSync('test.css');

  fs.readFile('test.css', (err, data)=>{
    if(!err && data){
      console.log(data.toString());
    } else {
      console.log(err);
    }
  });
   