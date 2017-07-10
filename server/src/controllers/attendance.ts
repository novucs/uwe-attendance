import {Request, Response, Router} from "express";
import {Document, model, Schema} from "mongoose";
import {findSessionById} from "./schedule";
import {findStudentByTag} from "./student";

export interface Attendance {
    _id: Schema.Types.ObjectId;
    sessionId: Schema.Types.ObjectId;
    studentTag: string;
}

export interface AttendanceModel extends Attendance, Document {
}

export const attendanceSchema = new Schema({
    sessionId: Schema.Types.ObjectId,
    studentTag: String
}, {collection: "attendance"});

export const attendanceModel = model<AttendanceModel>("attendance", attendanceSchema);
export const attendanceRouter: Router = Router();

attendanceRouter.get("/attendance/all", (request: Request, response: Response) => findAllAttendances()
    .then(data => response.json({info: "All attendances found successfully", data: data}))
    .catch(error => response.json({info: "Error during find all attendances", error: error})));

attendanceRouter.get("/attendance/session/:sessionId", (request: Request, response: Response) => findSessionAttendances(request.params.sessionId)
    .then(data => response.json({info: "Session attendances found successfully", data: data}))
    .catch(error => response.json({info: "Error during find session attendances", error: error})));

attendanceRouter.get("/attendance/student/:studentTag", (request: Request, response: Response) => findStudentAttendances(request.params.studentTag)
    .then(data => response.json({info: "Student attendances found successfully", data: data}))
    .catch(error => response.json({info: "Error during find student attendances", error: error})));

attendanceRouter.put("/attendance", (request: Request, response: Response) => updateAttendance(request.body.sessionId, request.body.studentTag)
    .then(data => response.json({info: "Attendance saved successfully", data: data}))
    .catch(error => response.json({info: "Error during attendance update", error: error})));

/**
 * Finds all attendances.
 * @returns {Promise<Attendance[]>} the promised attendances.
 */
export function findAllAttendances(): Promise<Attendance[]> {
    return new Promise<Attendance[]>((fulfill, reject) => {
        attendanceModel.find((error, attendances) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(attendances);
        });
    });
}

/**
 * Finds all attendances for a specific session.
 * @param sessionId the session to search for.
 * @returns {Promise<Attendance[]>} the promised attendances.
 */
export function findSessionAttendances(sessionId: string): Promise<Attendance[]> {
    return new Promise<Attendance[]>((fulfill, reject) => {
        if (!sessionId) {
            reject("No session ID provided");
            return;
        }

        const query = {sessionId: sessionId};

        attendanceModel.find(query, (error, attendances) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(attendances);
        });
    });
}

/**
 * Finds all attendances for a specific student.
 * @param studentTag the session to search for.
 * @returns {Promise<Attendance[]>} the promised attendances.
 */
export function findStudentAttendances(studentTag: string): Promise<Attendance[]> {
    return new Promise<Attendance[]>((fulfill, reject) => {
        if (!studentTag) {
            reject("No student tag provided");
            return;
        }

        const query = {studentTag: studentTag};

        attendanceModel.find(query, (error, attendances) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(attendances);
        });
    })
}

/**
 * Updates or creates an attendance entry.
 * @param sessionId the session ID.
 * @param tag the student tag.
 * @returns {Promise<Attendance>} the promised attendance.
 */
export function updateAttendance(sessionId: string, tag: string): Promise<Attendance> {
    const sessionPromise = findSessionById(sessionId);
    const studentPromise = findStudentByTag(tag);

    return Promise.all([sessionPromise, studentPromise]).then(([session, student]) => {
        return new Promise<Attendance>((fulfill, reject) => {
            const query = {"sessionId": session._id, "studentTag": student._id};
            const update = {"sessionId": session._id, "studentTag": student._id};
            const options = {upsert: true};

            attendanceModel.findOneAndUpdate(query, update, options, (error, attendance) => {
                if (error) {
                    reject(error);
                    return;
                }

                fulfill(attendance);
            });
        });
    });
}
