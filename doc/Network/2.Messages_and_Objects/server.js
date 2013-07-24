var app = require('http').createServer(handler), 
    io = require('socket.io').listen(app), 
    fs = require('fs')

    app.listen(1337);

    function handler (req, res) {
        fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
    }

    io.sockets.on('connection', function (socket) {
        // When a client is connected

        // When a client sends a message of the 'blob' type, brodcast the message to the other clients
        socket.on('blob', function (data) {
            socket.broadcast.emit('blob', data);
        });

        socket.on('disconnect', function() {
            // When a client is deconnected
        });
    });
