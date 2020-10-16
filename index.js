require('dotenv').config()

const http = require('http')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || '3000'
app.set('port', port)
app.use(express.json());


var server = http.createServer(app)
server.listen(port)

server.on('error', () => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
})

server.on('listening', () => {
    console.log(`Listening on ${port}`);
})

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        debug(err);
        process.exit(1);
    });
// Routes
var UserRoutes = require('./Routes/UserRoutes')
app.use('/user', UserRoutes)