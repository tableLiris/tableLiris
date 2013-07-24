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

        //broadcast the dimension message
        socket.on('dim', function (data) {
            socket.broadcast.emit('dim', data);
        });

        //broadcast the circle message
        socket.on('circle', function (data) {
            socket.broadcast.emit('circle', data);
        });

        socket.on('disconnect', function() {
        });
    });
