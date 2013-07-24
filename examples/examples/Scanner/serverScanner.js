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
        console.log("connected");

        socket.emit('news', "");

        socket.on('loc', function (data) {
            socket.broadcast.emit('loc', data);
        });

        socket.on('disconnect', function() {
        });
    });
