var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/attendance", {
  useMongoClient: true
});

var studentSchema = new mongoose.Schema({
    tag: String,
    name: String,
}, { collection: 'students' });

var scheduleSchema = new mongoose.Schema({
    event: String,
    onDate: Date,
}, { collection: 'schedule' });

fs = require('fs');
fs.readFile('./students.csv', 'utf8', function (err, data) {
  if (err) throw err;

  var names = data.toString().split("\n");

  for (i in names) {
    const name = names[i];

    if (name == "") {
      continue;
    }

    mongoose.model("students", studentSchema).findOneAndUpdate(
      {'name': name},
      {'tag': 'unknown'},
      {upsert:true},
      (err, Student) => {
        if (err) throw err;
        console.log('Created student: ' + name);
    });
  }
});

fs = require('fs');
fs.readFile('./schedule.csv', 'utf8', function (err, data) {
  if (err) throw err;

  var schedules = data.toString().split("\n");

  for (i in schedules) {
    const schedule = schedules[i];

    if (schedule == "") {
      continue;
    }

    var parts = schedule.split(',');
    var dateParts = parts[1].split('-');
    var year = dateParts[0];
    var month = dateParts[1] - 1;
    var day = dateParts[2];

    const onDate = new Date(year, month, day);
    const event = parts[0];

    mongoose.model("schedule", scheduleSchema).findOneAndUpdate(
      {'event': event},
      {'onDate': onDate},
      {upsert:true},
      (err, Schedule) => {
        if (err) throw err;
        console.log('Created schedule: ' + event + ' on ' + onDate);
    });
  }
});
