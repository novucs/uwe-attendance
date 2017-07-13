import * as express from "express";
import {Application} from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as WebSocket from "ws";
import * as mongoose from "mongoose";
import {attendanceRouter, scheduleRouter, studentRouter} from "./controllers";
import * as nfc from "nfc";
import * as util from "util";

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
    // ws.send("123456");
});

console.log("nfc.version(): " + util.inspect(nfc.nfc.version(), {depth: null}));
console.log("nfc.scan(): " + util.inspect(nfc.nfc.scan(), {depth: null}));
const device = new nfc.nfc.NFC();
device.on("read", tag => {
    if ((!!tag.data) && (!!tag.offset)) {
        console.log(util.inspect(nfc.nfc.parse(tag.data.slice(tag.offset)), {depth: null}));
    }
}).on("error", error => {
    console.log("An error occurred while reading the NFC device: ", error);
}).start();
