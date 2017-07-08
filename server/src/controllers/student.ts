import { Router, Request, Response } from 'express';
import * as mongoose from "mongoose";

// Assign router to the express.Router() instance
const router: Router = Router();

interface IStudent {
    tagid:string;
    name:string;
}

interface IStudentModel extends IStudent, mongoose.Document{};
var studentSchema = new mongoose.Schema({
    tag: String,
    name: String,
}, { collection: 'students' });

var student = mongoose.model<IStudentModel>("students", studentSchema);
export const Student = student;

router.post('/student', function (req: Request, res: Response) {
    if (req.body.name && req.body.tag) {
      //console.log("hello" + req.body.name);
      //res.json({info: 'did it...'});

      var query = {'name': req.body.name};

      student.findOneAndUpdate(
        query,
        {'tag': req.body.tag},
        {upsert:true},
        (err, Student) => {
          if (err) {
            res.json({info: 'error during Student update', error: err});
          }
          else {
            res.json({info: 'Student saved successfully', data: Student});
          }
      });

    }
    else { // fields not present
      res.json(
        { info: 'error during Student update',
          error: "name and/or tag not defined" });
    }
});

/* Read all */
router.get('/student', (req: Request, res: Response) => {
  student.find((err, Students) => {
      if (err) {
          res.json({info: 'error during find Students', error: err});
      };
      res.json({info: 'Students found successfully', data: Students});
  });
});

// find by tag
router.get('/student/:tag', (req: Request, res: Response) => {
    var query = { tag: req.params.tag };
    student.findOne(query, (err, Student) => {
        if (err) {
            res.json({info: 'error during find User', error: err});
        }

        if (Student) {
            res.json({info: 'Student found successfully', data: Student});
        } else {
            res.json({info: 'Student not found with tag: '+ req.params.tag});
        }
    });
});

/**
 * [studentID description]
 * @param  {string}          tag [description]
 * @return {Promise<string>}     [description]
 */
// export function findStudentbyTag(tag: string): Promise<mongoose.Types.ObjectId> {
//     return new Promise((resolve, reject)=> {
//           var query = { tag: tag};
//           student.findOne(query, (err, Student) => {
//           if (err) {
//               reject("error reading ID from student table wth tag");
//           };
//           if (Student) {
//               resolve(Student._id);
//           } else {
//               resolve(null);
//           }
//       });
//     });
// }

// export async function findStudentbyTag1(tag: string): Promise<mongoose.Types.ObjectId> {
//     return new Promise((resolve, reject)=> {
//           var query = { tag: tag};
//           student.findOne(query, (err, Student) => {
//           if (err) {
//               reject("error reading ID from student table wth tag");
//           };
//           if (Student) {
//               resolve(Student._id);
//           } else {
//               resolve(null);
//           }
//       });
//     });
//
// }

export async function findStudentbyTag(tag: string) : Promise<mongoose.Types.ObjectId> {
  var p: Promise<mongoose.Types.ObjectId> = new Promise((resolve, reject)=> {
            var query = { tag: tag};
            student.findOne(query, (err, Student) => {
            if (err) {
                reject("error reading ID from student table wth tag");
            };
            if (Student) {
                resolve(Student._id);
            } else {
                resolve(null);
            }
        });
      });

  return p.then(id => Promise.resolve(id));
}
// find by name
router.get('/studentByTag/:tag', (req: Request, res: Response) => {

  findStudentbyTag(req.params.tag).then((id:mongoose.Types.ObjectId) => {
    if (id) {
        res.json({info: 'Student found successfully', data: id, found: true});
    } else {
        res.json({info: 'Student not found with tag:'+ req.params.tag, found: false});
    }
  });
});

export const StudentRouter: Router = router;
