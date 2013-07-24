var app = require('http').createServer(handler), 
    io = require('socket.io').listen(app), 
    fs = require('fs'),
    cpt = 0,
    clients = [],
    table = 0

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
        clients[cpt] = socket.id;
        cpt++;
        //var obj = JSON.parse(io.sockets)
        socket.emit('news', { hello: cpt });

        socket.on('my other event', function (data) {
        });
        socket.on('joueur', function (data) {
            id = clients[table - 1];
            var msg = {identifiant: socket.id};
            io.sockets.socket(id).emit('joueur',msg);
        });
        socket.on('distrib', function (data) {
            var obj = JSON.parse(data);
            io.sockets.socket(obj[0].joueur).emit('distrib',data);
        });
        socket.on('placerLettre', function (data) {
            id = clients[table - 1];
            io.sockets.socket(id).emit('placerLettre',data);
        });
        socket.on('table', function (data) {
            var obj = JSON.parse(data);
            table = obj;
        });
        socket.on('lettreOK', function (data) {
            socket.broadcast.emit('lettreOK', data);
        });
        socket.on('motValide', function (data) {
            var obj = JSON.parse(data);
            io.sockets.socket(obj[0].identifiant).emit('motValide', data);
        });
        socket.on('motAnnule', function (data) {
            socket.broadcast.emit('motAnnule', data);
        });
        socket.on('changeLetters', function (data) {
            var id = clients[table - 1];
            var obj = JSON.parse(data);
            var msg = {l: obj[0].l, identifiant: socket.id};
            io.sockets.socket(id).emit('changeLetters',msg);
        });
        socket.on('newLetters', function (data) {
            var obj = JSON.parse(data);
            io.sockets.socket(obj[0].identifiant).emit('newLetters',data);
        });
        socket.on('debutTour', function (data) {
            var obj = JSON.parse(data);
            io.sockets.socket(obj[0].identifiant).emit('debutTour',data);
        });
        socket.on('finTour', function (data) {
            socket.broadcast.emit('finTour', "");
        });
        socket.on('disconnect', function() {
            //cpt--;
        });
    });
