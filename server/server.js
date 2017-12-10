const express = require('express')
const app = express()
var bodyParser = require('body-parser')

let database = {
  users: [{
    id: '123',
    name: 'Andrei',
    email: 'john@gmail.com',
    entries: 0,
    joined: new Date()
  }],
  secrets: {
    users_id: '123',
    hash: 'wghhh'
  }
}

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/signin', (req, res) => {
  if (req.body.email === database.users.email && req.body.password === database.secrets.hash) {
    res.json('signed in');
  } else {
    res.json('access denied');
  }
})

app.post('/findface', (req, res) => {
  database.users.forEach(user => {
    if (user.email === req.body.email) {
      user.entries++
      res.json(user)
    }
  });
  res.json('nope')
})


app.post('/register', (req, res) => {
  database.users.push({
    id: '124',
    name: req.body.name,
    email: req.body.email,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users)
})

app.get('/profile/:userId', (req, res) => {
  res.json(req.params)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))