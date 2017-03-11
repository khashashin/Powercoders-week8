var fs = require('fs');
var http = require('http');
var WebSocket = require('ws');

// massiv iz klientov
var clients = {};

var host = 'localhost';
var port = 8080;
var socketPath = '/socket';

var httpServer = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync('./index.html'));
});

var wss = new WebSocket.Server({
    server: httpServer,
    path: socketPath
});

wss.on('connection', function(socket) {
    console.log('Got socket connection');

    var id = Math.random();
    clients[id] = socket;
    console.log("New Connection " + id);

    socket.on('message', function(message) {
        console.log('Got message from client: ' + message);

        for (var key in clients) {
            clients[key].send(message);
        }
    });

    wss.on('close', function() {
        delete clients[id];
    });

    socket.send('Hello from server');
});

httpServer.listen(port, function() {
    console.log('Server is listening on http://' + host + ':' + port + '/');
    console.log('WebSocket on http://' + host + ':' + port + socketPath);
});
