import {readFile} from "fs";
import {connect, model, Schema} from "mongoose";

interface Student {
    _id: Schema.Types.ObjectId;
    tag: string;
    name: string;
    groups: string[];
}

export interface Session {
    _id: Schema.Types.ObjectId;
    event: string;
    onDate: Date;
    groups: string[];
}

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

function updateStudent(name: string, groups: string[]): Promise<Student> {
    const query = {"name": name};
    const update = {"tag": '', "groups": groups};
    const options = {upsert: true};

    return new Promise<Student>((fulfill, reject) => {
        model("students", studentSchema).findOneAndUpdate(query, update, options, (error, student) => {
            if (error) {
                reject(error);
                return;
            }

            console.log("Created student: " + name);
            fulfill(student);
        });
    });
}

function updateStudents(): Promise<[Student]> {
    return new Promise<[Student]>((fulfill, reject) => {
        readFile("students.csv", "utf8", (error, data) => {
            if (error) {
                throw reject(error);
            }

            const lines = data.toString().split('\n');
            const promises = [];

            lines.forEach((line) => {
                if (!line || line.substring(0, 1) == '#') {
                    return;
                }

                const studentData = line.split(',');
                const name = studentData[0];
                const groups = studentData.slice(1, studentData.length);
                promises.push(updateStudent(name, groups));
            });

            fulfill(Promise.all(promises));
        });
    });
}

function updateSession(event: string, onDate: Date, groups: string[]): Promise<Session> {
    const query = {"event": event};
    const update = {"onDate": onDate, "groups": groups};
    const options = {upsert: true};

    return new Promise<Session>((fulfill, reject) => {
        model("schedule", scheduleSchema).findOneAndUpdate(query, update, options, (error, session) => {
            if (error) {
                reject(error);
                return;
            }

            console.log("Created schedule: " + event + " on " + onDate);
            fulfill(session);
        });
    });
}

function updateSchedule(): Promise<[Session]> {
    return new Promise<[Session]>((fulfill, reject) => {
        readFile("schedule.csv", "utf8", (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            const lines = data.toString().split("\n");
            const promises = [];

            lines.forEach((line) => {
                if (!line || line.substring(0, 1) == '#') {
                    return;
                }

                const sessionData = line.split(',');
                const event = sessionData[0];
                const onDate = new Date(sessionData[1]);
                const groups = sessionData.slice(2, sessionData.length);

                promises.push(updateSession(event, onDate, groups));
            });

            fulfill(Promise.all(promises));
        });
    });
}

connect("mongodb://localhost/attendance", {
    useMongoClient: true
});

const studentPromise = updateStudents();
const schedulePromise = updateSchedule();

Promise.all([studentPromise, schedulePromise]).then(([students, schedules]) => {
    console.log("Successfully updated " + students.length + " students, and " + schedules.length + " schedules");
    process.exit();
});
