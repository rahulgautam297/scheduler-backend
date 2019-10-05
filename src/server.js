import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';

const url = "mongodb://localhost:27017/scheduler";
let mongoDb = null;
mongodb.connect(url, (err, db) => {
  if (err) throw err;
  mongoDb = db.db("scheduler");
});

let express = require('express'),
app = express();
app.use(express.json());
const port = 4000;
app.listen(port, () => {
});

app.post('/user-tasks', (req, res) => {
  mongoDb.collection('users').find({ userName: req.body.userName }).toArray(function(err, results) {
    if (results.length === 0) {
      mongoDb.collection('users').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        res.sendStatus(200);
      });
    } else {
      mongoDb.collection('tasks').find({ userName: req.body.userName, timeStamp: req.body.timeStamp }).toArray(function(err, results) {
        // console.log(ObjectId(results[0]._id).getTimestamp());
        if (err) return console.log(err)
        res.status(200).send(results);
      });
    }
  });
});


app.post('/save-task', (req, res) => {
  mongoDb.collection('tasks').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
    res.status(200).send(result);
  });
});

app.put('/update-task', (req, res) => {
  mongoDb.collection('tasks').updateOne({ _id: ObjectId(req.body.taskId) }, {$set:
                        { timerStart: req.body.timerStart, timerEnd: req.body.timerEnd }}, (err, result) => {
    if (err) return console.log(err)
    res.status(200).send(result);
  });
});

app.get('/previous-tasks', (req, res) => {
  mongoDb.collection('tasks').find({ userName: req.body.userName, timeStamp: req.body.timeStamp }).toArray(function(err, results) {
    if (err) return console.log(err)
    res.status(200).send(result);
  });
});