import {readFile} from "fs";
import {connect, model, Schema} from "mongoose";

connect("mongodb://localhost/attendance", {
    useMongoClient: true
});

const studentSchema = new Schema({
    tag: String,
    name: String,
    groups: [String]
}, {collection: "students"});

const scheduleSchema = new Schema({
    event: String,
    onDate: Date,
    groups: [String]
}, {collection: "schedule"});

readFile("students.csv", "utf8", (error, data) => {
    if (error) {
        throw error;
    }

    const lines = data.toString().split('\n');

    lines.forEach((line) => {
        if (!line || line.substring(0, 1) == '#') {
            return;
        }

        const studentData = line.split(',');
        const name = studentData[0];
        const groups = studentData.slice(1, studentData.length);

        const query = {"name": name};
        const update = {"tag": '', "groups": groups};
        const options = {upsert: true};

        model("students", studentSchema).findOneAndUpdate(query, update, options, (error, student) => {
            if (error) {
                throw error;
            }

            console.log("Created student: " + name);
        });
    });
});

readFile("schedule.csv", "utf8", (error, data) => {
    if (error) {
        throw error;
    }

    const lines = data.toString().split("\n");

    lines.forEach((line) => {
        if (!line || line.substring(0, 1) == '#') {
            return;
        }

        const sessionData = line.split(',');
        const event = sessionData[0];
        const onDate = new Date(sessionData[1]);
        const groups = sessionData.slice(2, sessionData.length);

        const query = {"event": event};
        const update = {"onDate": onDate, "groups": groups};
        const options = {upsert: true};

        model("schedule", scheduleSchema).findOneAndUpdate(query, update, options, (error, session) => {
            if (error) {
                throw error;
            }

            console.log("Created schedule: " + event + " on " + onDate);
        });
    });
});
