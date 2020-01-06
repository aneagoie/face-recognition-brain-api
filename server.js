const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

//Get this from knext documentation
const db = knex({
  client: 'pg',
  connection: {
    //This is localhost address
    host : '127.0.0.1',
    user : 'juan.gomez',
    //We don't need password for now
    password : '',
    database : 'smart-brain'
  }
});

//console.log(db.select('*').from('users'));

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  //console.log("Email: ", req.body.email);
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.username)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.username)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials test'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

// Transaction is used to make sure that all the procedure was successful. If something fails, then all the other process will fail
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        //We add here trx to be sure that it is part of the transaction
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      //We need to commit the transaction to make it works
      .then(trx.commit)
      //If there is an error then it will rollback
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  //where({id:id}) it is equal to .where({id})
  //You search for this in knox documentation
  db.select('*').from('users').where({id})
    .then(user => {
      //console.log(user);
      //If length 
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  //'users' is the table name
  db('users').where('id', '=', id)
  //increment(columns, amount)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  //Incase something fail
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
