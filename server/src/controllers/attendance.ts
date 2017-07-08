/**
 * File: attendance.ts
 * Author: Benedict R. Gaster
 * Description:
 */
import { Router, Request, Response } from 'express';
import * as mongoose from "mongoose";

import { findStudentbyTag } from './student';
import { findScheduleById, ISchedule } from './schedule';

// Assign router to the express.Router() instance
const router: Router = Router();

interface IAttendance {
    student: mongoose.Types.ObjectId;
    schedule: mongoose.Types.ObjectId;
}

interface IAttendanceModel extends IAttendance, mongoose.Document{};
var attendanceSchema = new mongoose.Schema({
    student: mongoose.Schema.Types.ObjectId, //mongoose.Types.ObjectId,
    schedule: mongoose.Schema.Types.ObjectId, //mongoose.Types.ObjectId,
}, { collection: 'attendance' });

var attendance =
  mongoose.model<IAttendanceModel>("attendance", attendanceSchema);

export const Attendance = attendance;

/* Read all */
router.get('/attendance', (req: Request, res: Response) => {
  attendance.find((err, Attendances) => {
      if (err) {
          res.json({info: 'error during find Attendances', error: err});
      };
      res.json({info: 'Attendances found successfully', data: Attendances});
  });
});

router.get('/session-attendance/:sessionId', (req: Request, res: Response) => {
  var query = { sessionId: req.params.sessionId };
  attendance.find(query, (err, Attendances) => {
      if (err) {
          res.json({info: 'error during find Attendances', error: err});
      };
      res.json({info: 'Attendances found successfully', data: Attendances});
  });
});

router.put('/attendance', function (req: Request, res: Response) {
  //console.log("booo " + JSON.stringify(req.body))
    if (req.body.tag && req.body.sessionId) {
      (async () => {
          var studentId:mongoose.Types.ObjectId =
                            await findStudentbyTag(req.body.tag);
          if (studentId) {
            var schedule: ISchedule =
                            await findScheduleById(req.body.sessionId);
            if (schedule) {

              var scheduleId = new mongoose.mongo.ObjectId(req.body.sessionId);

              var query = {'student': studentId, 'schedule': scheduleId};

              // we allow update to itself (this is the case when student
              // swipes id more than once), but normally it will insert a
              // new row for attendance for a given session.
              attendance.findOneAndUpdate(
                query,
                {'student': studentId, 'schedule': scheduleId},
                {upsert:true},
                (err, attendance) => {
                  if (err) {
                    res.json(
                      {
                        info: 'error during attendance insertion',
                        error: err
                      });
                  }
                  else {
                    res.json(
                      {
                        info: 'attendance added successfully',
                        data: attendance
                      });
                  }
              });

            } else {
              // the system is designed for this not really to happen, see docs
              res.json({
                info: 'Session not found with Id:'+ req.body.sessionId,
                found: false});
            }

          } else {
              res.json({
                info: 'Student not found with tag:'+ req.body.tag,
                found: false});
          }
      })(); // async () =>
    }
    else {
      res.json(
        { info: 'error during attendance submissison',
          error: "tag and/or session not defined" });
    }
});

export const AttendanceRouter: Router = router;
