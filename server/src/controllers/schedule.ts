/**
 * @module schedule.cpp
 * @author Benedict R. Gaster
 * @copyright Benedict R. Gaster 2017
 *
 *
 * @license See LICENSE
 */
import { Router, Request, Response } from 'express';
import * as mongoose from "mongoose";

// Assign router to the express.Router() instance
const router: Router = Router();

export interface ISchedule{
    event: string;
    onDate: Date;
}

interface IScheduleModel extends ISchedule, mongoose.Document{};
var scheduleSchema = new mongoose.Schema({
    event: String,
    onDate: Date,
}, { collection: 'schedule' });

var schedule = mongoose.model<IScheduleModel>("schedule", scheduleSchema);

export const Schedule = schedule;

router.get('/current-schedule', (req: Request, res: Response) => {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  var query = {onDate: {
    "$gte": yesterday,
    "$lt": tomorrow
  }};

  schedule.find(query, (err, Schedules) => {
    if (err) {
      res.json({info: 'error during find Schedules', error: err});
    }
    res.json({info: 'Schedules.. found successfully', data: Schedules});
  });
});

/* Read all */
router.get('/schedule', (req: Request, res: Response) => {
  schedule.find((err, Schedules) => {
    if (err) {
      res.json({info: 'error during find Schedules', error: err});
    }
    res.json({info: 'Schedules.. found successfully', data: Schedules});
  });
});

router.get('/schedule/:id', (req: Request, res: Response) => {
  var query = { _id: req.params.id };
  schedule.findOne(query, (err, Schedule) => {
    if (err) {
      res.json({info: 'error during find Schedule', error: err});
    }

    if (Schedule) {
      res.json({info: 'Schedule found successfully', data: Schedule});
    } else {
      res.json({info: 'Schedule not found with tag: '+ req.params.id});
    }
  });
});

export function findScheduleById(sessionId: string): Promise<ISchedule> {
  var p: Promise<ISchedule> = new Promise((resolve, reject)=> {
    schedule.findById(sessionId, function (err, ischedule: ISchedule) {
      if (err) {
        reject("error reading schedule from schedule table with session ID");
      };
      resolve(ischedule);
    });
  });

  return p.then(s => Promise.resolve(s));
}

export const ScheduleRouter: Router = router;