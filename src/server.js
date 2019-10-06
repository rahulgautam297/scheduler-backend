import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import cors from 'cors';
require('dotenv').config()

const url = "mongodb://localhost:27017/scheduler";
let mongoDb = null;
mongodb.connect(process.env.MONGODB_URI || url, (err, db) => {
  if (err) throw err;
  mongoDb = db.db("scheduler");
});

let express = require('express'),
app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;
app.listen(port, () => {
});

app.post('/user-tasks', (req, res) => {
  mongoDb.collection('users').findOne({ userName: req.body.userName }, (err, user) => {
    if (err) return console.log(err);
    if (user === null) {
      mongoDb.collection('users').insertOne({ userName: req.body.userName }, (err, createdUser) => {
        if (err) return console.log(err);
        mongoDb.collection('projects').find().toArray((error, projects) => {
          if (error) return console.log(error);
          res.status(200).send({tasks: [ ], projects: projects, user: createdUser});
        });
      });
    } else {
      mongoDb.collection('tasks').find({ userName: req.body.userName, timeStamp: req.body.timeStamp }).toArray((err, results) => {
        // console.log(ObjectId(results[0]._id).getTimestamp());
        if (err) return console.log(err);
        mongoDb.collection('projects').find().toArray((error, projects) => {
          if (error) return console.log(error);
          res.status(200).send({tasks: results, projects: projects, user: user});
        });
      });
    }
  });
});


app.post('/save-task', (req, res) => {
  mongoDb.collection('tasks').insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    res.status(200).send(result);
  });
});

app.post('/add-project', (req, res) => {
  mongoDb.collection('projects').insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    res.status(200).send(result);
  });
});

app.put('/update-task', (req, res) => {
  mongoDb.collection('tasks').updateOne({ _id: ObjectId(req.query.taskId) }, {$set:
                        { timerStart: req.body.timerStart, timerEnd: req.body.timerEnd }}, (err, result) => {
    if (err) return console.log(err);
    res.status(200).send(result);
  });
});

app.get('/previous-tasks', (req, res) => {
  mongoDb.collection('tasks').find({ userName: req.body.userName, timeStamp: req.body.timeStamp }).toArray((err, results) => {
    if (err) return console.log(err);
    res.status(200).send(result);
  });
});