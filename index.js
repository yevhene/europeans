const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();

const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const mongoUrl = 'mongodb://localhost:27017/01-db';
let mongo;
MongoClient
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(function(client) {
    mongo = client.db();
    console.log('MongoDB started')
  });


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  mongo
    .collection('europeans').find().toArray()
    .then(function(europeans) {
      res.render('index', { europeans });
    });
});

app.get('/new', function(req, res) {
  res.render('new');
});

app.post('/', function(req, res) {
  mongo
    .collection('europeans')
    .insertOne(req.body)
    .then(function() {
      res.redirect('/');
    });
});

app.get('/:id/delete', function(req, res) {
  mongo
    .collection('europeans')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(function() {
      res.redirect('/');
    });
});

app.get('/:id', function(req, res) {
  mongo
    .collection('europeans')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(function(european) {
      res.render('show', { european });
    });
});

app.listen(3000, function() {
  console.log('App started at http://localhost:3000');
});
