var http = require('http');

http.createServer((req, res)=>{

  var test = req.url.replace('/','');

  console.log(test);
  res.end('hello');
}).listen(3000, console.log('Server start on port 3000'));


