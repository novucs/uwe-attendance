import * as mongoose from "mongoose";
import * as fs from "fs";

mongoose.connect("mongodb://localhost/attendance", {
    useMongoClient: true
});

const studentSchema = new mongoose.Schema({
    tag: String,
    name: String
}, {collection: 'students'});

const scheduleSchema = new mongoose.Schema({
    event: String,
    onDate: Date
}, {collection: 'schedule'});

fs.readFile('../students.csv', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }

    const names = data.toString().split("\n");

    for (let i in names) {
        const name = names[i];

        if (name === "") {
            continue;
        }

        mongoose.model("students", studentSchema).findOneAndUpdate(
            {'name': name},
            {'tag': 'unknown'},
            {upsert: true},
            (err) => {
                if (err) {
                    throw err;
                }

                console.log('Created student: ' + name);
            });
    }
});

fs.readFile('../schedule.csv', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }

    const schedules = data.toString().split("\n");

    for (let i in schedules) {
        const schedule = schedules[i];

        if (schedule === "") {
            continue;
        }

        const parts = schedule.split(',');
        const event = parts[0];
        const onDate = new Date(parts[1]);

        mongoose.model("schedule", scheduleSchema).findOneAndUpdate(
            {'event': event},
            {'onDate': onDate},
            {upsert: true},
            (err) => {
                if (err) {
                    throw err;
                }

                console.log('Created schedule: ' + event + ' on ' + onDate);
            });
    }
});
