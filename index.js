'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/test';


app.use(bodyParser.json());


app.post('/users/', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');
      collection.insert({fName: 'Aleksey', lName: 'Alekseev', phone: '+79212858585'});
      collection.insert({fName: 'Tanya', lName: 'Andreeva', phone: '+79113114141'});
      collection.insert({fName: 'Nastya', lName: 'Kulikova', phone: '+79021300909'});
      collection.insert({fName: 'Anya', lName: 'Sergeeva', phone: '+79600258989'});

      collection.insert(req.body, (err, result) => {
        if (err) {
          res.status(404).send('Bad request...');  
        } else {
          res.send(result.ops);
        }
      });

      // collection.remove();

      db.close();

    }
  });  
});



app.get('/users/', (req, res) => { 

  if (req.query.q) {

    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
      } else {

        console.log('Соединение установлено для', url);

        const collection = db.collection('test');

        collection.find({$or: [{fName: req.query.q}, {lName: req.query.q}, {phone: req.query.q}]}).toArray((err, result) => {
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



app.put('/users/:userName', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');

      collection.update({fName: req.params.userName}, {$set: {fName: req.body.fName}}, {multi: true});

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



app.delete('/users/:userName', (req, res) => {

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу MongoDB. Ошибка:', err);
    } else {

      console.log('Соединение установлено для', url);

      const collection = db.collection('test');

      collection.remove({fName: req.params.userName});      

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

