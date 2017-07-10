import {Request, Response, Router} from "express";
import {Document, model, Schema} from "mongoose";

export interface Session {
    _id: Schema.Types.ObjectId;
    event: string;
    onDate: Date;
}

export interface SessionModel extends Session, Document {
}

export const scheduleSchema = new Schema({
    event: String,
    onDate: Date,
}, {collection: "schedule"});

export const scheduleModel = model<SessionModel>("schedule", scheduleSchema);
export const scheduleRouter: Router = Router();

scheduleRouter.get("/schedule/all", (request: Request, response: Response) => findAllSessions()
    .then(data => response.json({info: "All sessions found successfully", data: data}))
    .catch(error => response.json({info: "Error during find all sessions", error: error})));

scheduleRouter.get("/schedule/today", (request: Request, response: Response) => findSessionsToday()
    .then(data => response.json({info: "Today's sessions found successfully", data: data}))
    .catch(error => response.json({info: "Error during find today's sessions", error: error})));

scheduleRouter.get("/schedule/id/:id", (request: Request, response: Response) => findSessionById(request.params.id)
    .then(data => response.json({info: "Session found successfully", data: data}))
    .catch(error => response.json({info: "Error during find session by ID", error: error})));

/**
 * Finds all sessions.
 * @returns {Promise<Session[]>} the promised sessions.
 */
export function findAllSessions(): Promise<Session[]> {
    return new Promise<Session[]>((fulfill, reject) => {
        scheduleModel.find((error, sessions) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(sessions);
        });
    });
}

/**
 * Finds all sessions within 24 hours of the current time.
 * @returns {Promise<Session[]>} the promised sessions.
 */
export function findSessionsToday(): Promise<Session[]> {
    return new Promise<Session[]>((fulfill, reject) => {
        const yesterday = new Date();
        const tomorrow = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const query = {onDate: {"$gt": yesterday, "$lt": tomorrow}};

        scheduleModel.find(query, (error, sessions) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(sessions);
            return;
        });
    });
}

/**
 * Finds a session by the provided session ID.
 * @param sessionId the session ID.
 * @returns {Promise<Session>} the promised session.
 */
export function findSessionById(sessionId: string): Promise<Session> {
    return new Promise<Session>((fulfill, reject) => {
        if (!sessionId) {
            reject("No session ID provided");
            return;
        }

        const query = {_id: sessionId};

        scheduleModel.findOne(query, (error, session) => {
            if (error) {
                reject(error);
                return;
            }

            if (!session) {
                reject("No session found with ID: " + sessionId);
                return;
            }

            fulfill(session);
        });
    });
}
