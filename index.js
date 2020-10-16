require('dotenv').config()

const cors = require('cors')
const http = require('http')
const logger = require('morgan')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || '3000'

app.set('port', port)

app.use(cors())
app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms'))

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
    useFindAndModify: false
})
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        debug(err);
        process.exit(1);
    });

// Routes
var UserRoutes = require('./Routes/UserRoutes'), ProductRoutes = require('./Routes/ProductRoutes')
app.use('/user', UserRoutes)
app.use('/product', ProductRoutes)