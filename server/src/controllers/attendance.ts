import {Request, Response, Router} from "express";
import {Document, model, ObjectId, Schema} from "mongoose";
import {findSessionById} from "./schedule";
import {findStudentByTag} from "./student";

export interface Attendance {
    _id: ObjectId;
    student: ObjectId;
    schedule: ObjectId;
}

export interface AttendanceModel extends Attendance, Document {
}

export const attendanceSchema = new Schema({
    student: ObjectId,
    schedule: ObjectId,
}, {collection: "attendance"});

export const attendanceModel = model<AttendanceModel>("attendance", attendanceSchema);
export const attendanceRouter: Router = Router();

attendanceRouter.get("/attendance/all", (request: Request, response: Response) => findAllAttendances()
    .then(data => response.json({info: "All attendances found successfully", data: data}))
    .catch(error => response.json({info: "Error during find all attendances", error: error})));

attendanceRouter.get("/attendance/session/:sessionId", (request: Request, response: Response) => findSessionAttendances(request.params.sessionId)
    .then(data => response.json({info: "Session attendances found successfully", data: data}))
    .catch(error => response.json({info: "Error during find session attendances", error: error})));

attendanceRouter.put("/attendance", (request: Request, response: Response) => updateAttendance(request.body.sessionId, request.body.tag)
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
 * Updates or creates an attendance entry.
 * @param sessionId the session ID.
 * @param tag the student tag.
 * @returns {Promise<Attendance>} the promised attendance.
 */
export function updateAttendance(sessionId: string, tag: string): Promise<Attendance> {
    return new Promise<Attendance>((fulfill, reject) => {
        const sessionPromise = findSessionById(sessionId);
        const studentPromise = findStudentByTag(tag);

        Promise.all([sessionPromise, studentPromise]).then(([session, student]) => {
            const query = {"session": session._id, "student": student._id};
            const update = {"session": session._id, "student": student._id};
            const options = {upsert: true};

            attendanceModel.findOneAndUpdate(query, update, options, (error, attendance) => {
                if (error) {
                    reject(error);
                    return;
                }

                fulfill(attendance);
            });
        }).catch(error => reject(error));
    });
}
