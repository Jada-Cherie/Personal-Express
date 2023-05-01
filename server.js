const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://studioghibli:studioghibli@studioghibli.qynnsao.mongodb.net/?retryWrites=true&w=majority";
const dbName = "studioghibli";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('ghibli').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('ghibli').insertOne({
    name: req.body.name, 
    quote: req.body.quote, 
    }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('ghibli')
  .findOneAndUpdate({
    name: req.body.name, 
    movie: req.body.movie,
    quote: req.body.quote}, {
    $set: {
      heart:req.body.heart
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('ghibli').findOneAndDelete({
    name: req.body.name, 
    movie: req.body.movie,
    quote: req.body.quote}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
