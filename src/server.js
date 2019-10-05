import mongodb from 'mongodb';

let mongoClient = mongodb.mongoClient;
let url = "mongodb://localhost:27017/tasks";
let mongoDb = null;

mongoClient.connect(url, (err, db) => {
  if (err) throw err;
  console.log("Database created!");
  let mongoDb = db.db("tasks");
});

let express = require('express'),
app = express(),
port = process.env.PORT || 4000,
headers = { client: process.env.client, access_token: process.env.key };
app.listen(port, () => {
});

app.post('/user-tasks', (req, res) => {

  db.collection('users').find({ userName: req.body.userName }).toArray(function(err, results) {
    if (results.length === 0) {
      db.collection('user').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.send([ ], 200);
      })
    } else {
      db.collection('tasks').find({ user_id: req.body.userName, timeStamp: req.body.timeStamp }).toArray(function(err, results) {
        if (err) return console.log(err)
        res.send(results, 200);
      });
    }
  });
});


app.post('/save-task', (req, res) => {
    db.collection('tasks').save(req.body).toArray(function(err, results) {
      if (err) return console.log(err)
      res.send(results, 200);
    });
});

app.put('/update-task', (req, res) => {
  db.collection('tasks').update({ _id: req.body._id}, {$set:
                        { timerStart: req.body.timerStart, timerEnd: req.body.timerEnd, }}).toArray(function(err, results) {
    if (err) return console.log(err)
    res.send(results, 200);
  });
});

app.post('/previous-tasks', (req, res) => {
    db.collection('tasks').find({ user_id: req.body.userName, timeStamp: req.body.timeStamp }).toArray(function(err, results) {
      if (err) return console.log(err)
      res.send(results, 200);
    });
});