import * as express from "express";
import {Application} from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as WebSocket from "ws";
import * as mongoose from "mongoose";
import {attendanceRouter, scheduleRouter, studentRouter} from "./controllers";
import {nfc} from "nfc";
import * as util from "util";

const app: Application = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/attendance");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, "../../public/dist")));

app.use("/api", scheduleRouter);
app.use("/api", studentRouter);
app.use("/api", attendanceRouter);

// Serve up the Angular app.
app.get('*', (req, res) => {
    console.log("Serving client");
    res.sendFile(path.join(__dirname, "../../public/dist/index.html"));
});

// Serve the application at the given port.
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

// Setup the NFC reader via WebSocket.
const portNFC = process.env.PORT || 3001;
const server = new WebSocket.Server({port: portNFC});
const clients = [];

server.on("connection", ws => {
    console.log("WebSocket connection made");
    clients.push(ws);

    ws.on("close", ws => {
        const index = clients.indexOf(ws, 0);

        if (index > -1) {
            clients.splice(index, 1);
        }
    });
    // ws.send("123456");
});

const device = new nfc.NFC();
let shouldSend = true;

device.on("read", tag => {
    if (!shouldSend) {
        return;
    }

    shouldSend = false;

    setTimeout(() => {
        shouldSend = true;
    }, 1500);

    clients.forEach(client => {
        if (client.readyState == WebSocket.OPEN) {
            client.send(tag.uid);
        }
    });
}).on("error", error => {
    console.log("An error occurred while reading the NFC device: ", error);
}).start();
