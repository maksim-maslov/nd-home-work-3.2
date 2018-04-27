'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/test';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.sendFile(`${__dirname}\\index.html`);
});



app.post('/contacts/', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');

      collection.insert(req.body, (err, result) => {
        if (err) {
          res.status(404).send('Bad request...');  
        } else {
          res.sendFile(`${__dirname}\\index.html`);
        }
      });

      db.close();

    }
  });  
});



app.get('/contacts/', (req, res) => { 

  if (req.query.q) {

    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
      } else {

        console.log('Соединение установлено для', url);

        const collection = db.collection('test');

        const regex = `.*${req.query.q}.*`;

        collection.find({$or: [{_id: {$regex: regex}}, {fName: {$regex: regex}}, {lName: {$regex: regex}}, {phone: {$regex: regex}}]}).toArray((err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            res.json(result);
          } else {
            res.send('Нет документов с данным условием поиска');
          }
        });
        
        db.close();

      }
    });

  } else {

    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
      } else {

        console.log('Соединение установлено для', url);

        const collection = db.collection('test');

        collection.find().toArray((err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });      

        db.close();

      }
    });
  }    
});



app.put('/contacts/:id', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');

      const ObjectId = mongodb.ObjectID;
      const id = new ObjectId(req.params.id);     

      collection.update({_id: id}, {$set: {fName: req.body.fName, lName: req.body.lName, phone: req.body.phone}});

      collection.find().toArray((err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
          res.json(result);
        } else {
          res.send('Нет документов с данным условием поиска');
        }
      });   

      db.close();

    }
  });
});



app.delete('/contacts/:id', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');

      const ObjectId = mongodb.ObjectID;
      const id = new ObjectId(req.params.id); 

      collection.remove({_id: id});      

      collection.find().toArray((err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
          res.json(result);
        } else {
          res.send('Нет документов с данным условием поиска');
        }
      });   

      db.close();

    }
  });  
});



app.listen(3000, () => console.log('App started on 3000 port'));

