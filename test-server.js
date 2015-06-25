var dgram = require('dgram');
var util = require('util');
var _ = require('underscore');

var server = dgram.createSocket('udp4');

var clients = [];
var n = 0;

server.on('error', function(err) {
  console.error(err);
  server.close();
});

function updateClientList() {
  clients.forEach(function(client) {
    var message = new Buffer('[list]' + JSON.stringify(_.reject(clients, function(client) { return (client == null) })));
    server.send(message,  0, message.length, client.port, client.address, function(err, bytes) {
      if(err) consoler.error(err);
    });
  });
}

function handleHello(rinfo) {
  clients[n] = { id: n, address: rinfo.address, port: rinfo.port };
  console.log('New client: ID =' + '' + n + ' ' + clients[n].address + ':' + clients[n].port);
  n++;
  console.log('There are ' + n + ' clients!');
  updateClientList();
}

function handleBye(rinfo) {
  var client = _.findWhere(clients, { address: rinfo.address, port: rinfo.port });
  if(!client) return console.error('Unkwown client.');
  console.log('Bye: ' + client.address + ':' + client.port);
  clients.splice(clients.indexOf(client),1);
  updateClientList();
}

function handleMessage(rinfo, msg) {
  //var match = msg.match(/^\[(\d+)\](.*)/);
  //if(!match || !match[1] || !match[2]) return console.error('Invalid message.');
  //var dst = match[1];
  //var message = new Buffer(match[2]);
  var message = new Buffer(msg);
  //if(!clients[dst]) return console.error('Invalid client.');
  console.log('Message received: ' + message);
  //server.send(message,  0, message.length, clients[dst].port, clients[dst].address, function(err, bytes) {
   // if(err) consoler.error(err);
  //});
}

function send(msg) {
  //var msga = new Buffer('[msg]'+msg);
  var match = msg.match(/^\[(\d+)\](.*)/);
  if(!match || !match[1] || !match[2]) return console.error('Invalid message.');
  var dst = match[1];
  var message = new Buffer(match[2]);
  if(!clients[dst]) return console.error('Invalid client.');
  server.send(message,  0, message.length, clients[dst].port, clients[dst].address, function(err, bytes) {
  if(err) consoler.error(err);
  });
}


process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  var msg = chunk.toString();
  send(msg);
});

server.on('message', function(msg, rinfo) {
  if(rinfo.port <= 1024) return;
  if(msg == '[hello]') return handleHello(rinfo);
  if(msg == '[bye]') return handleBye(rinfo);
  if(msg.toString().indexOf('[msg]') == 0) return handleMessage(rinfo,msg.toString().substr(5));
  console.error('Invalid message received!');
});

server.bind(1337);

