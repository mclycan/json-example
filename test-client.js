var dgram = require('dgram');

var client = dgram.createSocket("udp4");
var clients = [];

function hello(cb) {
  var message = new Buffer("[hello]");
  client.send(message, 0, message.length, 1337, "localhost", cb);
}

function send(msg) {
  var message = new Buffer('[msg]'+msg);
  client.send(message, 0, message.length, 1337, "localhost", function(err, bytes) {
    if(err) console.error(err);
  });
}

function bye() {
  var message = new Buffer("[bye]");
  client.send(message, 0, message.length, 1337, "localhost", function(err, bytes) {
    if(err) console.error(err);
    client.close();
    process.exit(0);
  });
}

function displayClientList(msg) {
  clients = JSON.parse(msg);
  console.log('New participant list:');
  for(var i = 0; i < clients.length; ++i)
    console.log('* ' + clients[i].id + ' - ' + clients[i].address + ':' + clients[i].port);
 // console.log('Type your message with the following format: [client_id]message');
}

function onMessage(msg, rinfo) {
  if(msg.toString().indexOf('[list]') == 0)
    return displayClientList(msg.toString().substr(6));
  console.log('Message received: ' + msg);
}

client.on('message', onMessage);

hello(function(err, bytes) {
  if(err) return consoler.error(err);
});

process.on('SIGINT', function() {
  bye();
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  var msg = chunk.toString();
  //var match = msg.match(/^\[(\d+)\](.*)/);
  //if(!match || !match[1] || !match[2]) return console.error('Invalid message.');
  send(msg);
});
