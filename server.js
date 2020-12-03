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

app.get('/messages', (req, res) => {
    Message.find({}, (error, messages) => {
        res.send(messages);
    });
});

app.get('/messages/:user', (req, res) => {
    var user = req.params.user;
    Message.find({ name: user }, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body);
        var savedMessage = await message.save();
        console.log('saved');
        var censored = await Message.findOne({ message: 'badword' });
        if (censored)
            await Message.remove({ _id: censored.id });
        else
            io.emit('message', req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.log('message post called');
    }
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

