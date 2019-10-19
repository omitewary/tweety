const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3001;
const app = express();
connectDB
connectDB();
require('dotenv').config({ path: '../../.env' });

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());  

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


// the __dirname is the current directory from where the script is running
/*app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
 return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('./server/routes/tweets')(app, io);

server.listen(port, () => {
    console.log('server is up');
})