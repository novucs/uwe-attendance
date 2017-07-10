import * as express from "express";
import {Application} from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as WebSocket from "ws";
import * as mongoose from "mongoose";
import {NFCReader} from "./nfc_reader";
import {attendanceRouter, scheduleRouter, studentRouter} from "./controllers";

const nfcReader = new NFCReader();
const app: Application = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/attendance");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, '../../public/build')));

app.use('/api', scheduleRouter);
app.use('/api', studentRouter);
app.use('/api', attendanceRouter);

// Serve up the Angular app.
app.get('*', (req, res) => {
    console.log("Serving client");
    res.sendFile(path.join(__dirname, '../../public/build/index.html'));
});

// Serve the application at the given port.
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

// Setup the NFC reader via WebSocket.
const portNFC = process.env.PORT || 3001;
const server = new WebSocket.Server({port: portNFC});

server.on('connection', ws => {
    console.log("WebSocket connection made");
});

nfcReader.addListener(nfcReader.receivedEvent, msg => {
    // broadcast msg (button press) to all listening sockets
    console.log(msg);
});
