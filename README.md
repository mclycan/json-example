# UDP client/server communication

## Install

```
npm install
```

## Usage

Start the server:

```
node server.js
```

Start some clients with:

```
node client.js
```

Each time a client join or leave the server,
the new client list is send to all clients by the server.

You can send a message to a specific client by sending the following message:

```
[client_id]Message
```

You can stop the clients with `Ctrl+C`.

## Demo

![demo](https://raw.github.com/MiLk/node-udp-communication/master/screenshot.png)

