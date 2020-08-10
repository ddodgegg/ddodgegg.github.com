const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;

const server = app.listen(port, function(){
  console.log('DDODGE.GG download server has started on port', port);
});

app.get('/', function(req, res){
  const file = __dirname + '/DDODGE.zip';

  res.download(file);
  // res.send('Welcome DDODGE.GG download page');
});

app.get('/riot.txt', function(req, res){
  const file = __dirname + '/riot.txt';

  const filestream = fs.createReadStream(file);
  filestream.pipe(res);

  res.download(file);
  // res.send(filestream);
});