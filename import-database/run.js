var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/attendance", {
  useMongoClient: true
});

var studentSchema = new mongoose.Schema({
    tag: String,
    name: String,
}, { collection: 'students' });

fs = require('fs');
fs.readFile('./students.txt', 'utf8', function (err, data) {
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
