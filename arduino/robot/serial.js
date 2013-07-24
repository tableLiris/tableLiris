var SerialPort = require('serialport2').SerialPort;
var port = new SerialPort();
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

    // Send a welcome message to the new client
    socket.emit('hello', "Hello World !");

    // When a client sends a message of the 'color' type, brodcast the message to the other clients
    socket.on('F', function (data) {
        console.log("F");
        port.write("F");
    });

    socket.on('B', function (data) {
        console.log("B");
        port.write("B");
    });

    socket.on('R', function (data) {
        console.log("R");
        port.write("R");
    });

    socket.on('L', function (data) {
        console.log("L");
        port.write("L");
    });

    socket.on('S', function (data) {
        console.log("S");
        port.write("S");
    });

    socket.on('disconnect', function() {
        // When a client is deconnected
    });
});

port.on('data', function(data) {
  console.log(data.toString());
});

port.on('error', function(err) {
  console.log(err);
});

port.open('COM5', {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
}, function(err) {
  port.write("F");
  //port.close();
});

