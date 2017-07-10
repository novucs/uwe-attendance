import {Request, Response, Router} from "express";
import {Document, model, Schema} from "mongoose";

export interface Student {
    _id: Schema.Types.ObjectId;
    tag: string;
    name: string;
    groups: string[];
}

export interface StudentModel extends Student, Document {
}

export const studentSchema = new Schema({
    tag: String,
    name: String,
    groups: [String]
}, {collection: "students"});

export const studentModel = model<StudentModel>("students", studentSchema);
export const studentRouter: Router = Router();

studentRouter.get("/student/all", (request: Request, response: Response) => findStudents()
    .then(data => response.json({info: "All students found successfully", data: data}))
    .catch(error => response.json({info: "Error during find all students", error: error})));

studentRouter.get("/student/tag/:tag", (request: Request, response: Response) => findStudentByTag(request.params.tag)
    .then(data => response.json({info: "Student found successfully", data: data}))
    .catch(error => response.json({info: "Error during find student by tag", error: error})));

studentRouter.get("/student/name/:name", (request: Request, response: Response) => findStudentByName(request.params.name)
    .then(data => response.json({info: "Student found successfully", data: data}))
    .catch(error => response.json({info: "Error during find student by name", error: error})));

studentRouter.get("/student/groups/:groups", (request: Request, response: Response) => findStudentsByGroups(request.params.groups.split(','))
    .then(data => response.json({info: "Students found successfully", data: data}))
    .catch(error => response.json({info: "Error during find students by group", error: error})));

studentRouter.post("/student/tag", (request: Request, response: Response) => updateStudent(request.body.name, request.body.tag)
    .then(data => response.json({info: "Student saved successfully", data: data}))
    .catch(error => response.json({info: "Error during student update", error: error})));

/**
 * Finds all students.
 * @returns {Promise<Student[]>} the promised students.
 */
export function findStudents(): Promise<Student[]> {
    return new Promise((fulfill, reject) => {
        studentModel.find((error, students) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(students);
        });
    });
}

/**
 * Finds the student by their tag.
 * @param tag the tag to search.
 * @returns {Promise<Student>} the promised student.
 */
export function findStudentByTag(tag: string): Promise<Student> {
    return new Promise<Student>((fulfill, reject) => {
        if (!tag) {
            reject("No tag provided");
            return;
        }

        const query = {"tag": tag};

        studentModel.findOne(query, (error, student) => {
            if (error) {
                reject(error);
                return;
            }

            if (!student) {
                reject("No student found with tag: " + tag);
                return;
            }

            fulfill(student);
        });
    });
}

/**
 * Finds the student by their name.
 * @param name the name to search.
 * @returns {Promise<Student>} the promised student.
 */
export function findStudentByName(name: string): Promise<Student> {
    return new Promise<Student>((fulfill, reject) => {
        if (!name) {
            reject("No name provided");
            return;
        }

        const query = {name: name};

        studentModel.findOne(query, (error, student) => {
            if (error) {
                reject(error);
                return;
            }

            if (!student) {
                reject("No student found with name: " + name);
                return;
            }

            fulfill(student);
        });
    });
}

/**
 * Finds all students within specific groups.
 * @param groups the groups to search for.
 * @returns {Promise<Student[]>} the promised students.
 */
export function findStudentsByGroups(groups: string[]): Promise<Student[]> {
    return new Promise<Student[]>((fulfill, reject) => {
        if (!groups) {
            reject("No groups provided");
            return;
        }

        const query = {"groups": {$in: groups}};

        studentModel.find(query, (error, students) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(students);
        })
    });
}

/**
 * Updates the students tag.
 * @param name the students name.
 * @param tag the new tag.
 * @returns {Promise<Student>} the promised student.
 */
export function updateStudent(name: string, tag: string): Promise<Student> {
    return new Promise((fulfill, reject) => {
        if (!name) {
            reject("No name provided");
            return;
        }

        if (!tag) {
            reject("No tag provided");
            return;
        }

        const query = {"name": name};
        const update = {"tag": tag};
        const options = {upsert: true};

        studentModel.findOneAndUpdate(query, update, options, (error, student) => {
            if (error) {
                reject(error);
                return;
            }

            fulfill(student);
        });
    });
}
