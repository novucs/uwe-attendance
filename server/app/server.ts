/**
 * @module server.cpp
 * @author Benedict R. Gaster
 * @copyright Benedict R. Gaster 2017
 *
 *
 *
 * @license See LICENSE
 */

// Import everything from express and assign it to the express variable
import * as express from 'express';
import * as bodyParser from "body-parser";

const path = require('path');

//const addon = require('/home/br-gaster/dev/attendance/test/build/build/Release/nfc_reader.node');
//var bindings = require('bindings')('nfc_reader.node')

import WebSocket = require('ws');

import { NFCReader } from './nfc_reader'
let nfcReader = new NFCReader()

// Import WelcomeController from controllers entry point
import {
  StudentRouter,
  ScheduleRouter,
  AttendanceRouter} from './controllers';

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/attendance");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api', ScheduleRouter);
app.use('/api', StudentRouter);
app.use('/api', AttendanceRouter);

// now serve up the Angular app
app.get('*', (req, res) => {
  console.log("in here\n");
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});

// now setup the NFC reader, via WebSocket
const portNFC_ = 3001;

let portNFC = process.env.PORT || portNFC_;
let WebSocketServer = WebSocket.Server;
let server = new WebSocketServer({ port: portNFC });

server.on('connection', ws => {
  console.log("ws conntection made");
});

//nfcReader.hello();
nfcReader.addListener(nfcReader.receivedEvent, msg => {
    // broadcast msg (button press) to all listening sockets
    console.log(msg);
});
