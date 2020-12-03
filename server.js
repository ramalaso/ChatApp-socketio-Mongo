var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');


app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var dbUrl = " mongodb://localhost:27017/chat";

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// var messages = [
//     { name: 'Ramalaso', message: "Hello Judith" },
//     { name: 'Judith', message: "Hello Ramalaso" }
// ];

app.get('/messages', (req, res) => {
    Message.find({}, (error, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((error) => {
        if (error) {
            sendStatus(500);
        }
        io.emit('message', req.body);
        res.sendStatus(200);

    });
    console.log(req.body);
});

io.on('connection', (socket) => {
    console.log('User connected...');
});

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    console.log('Mongo DB connection: ');
});

var server = http.listen(3000, () => {
    console.log('App listening on port ' + server.address().port);
});

