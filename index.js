const express = require('express');

const server = express();

server.get('/', (request, response) => {
  response.send('Hello World ' + new Date());
});

server.listen(3000, () => {
  console.log('Running at localhost 3000');
});