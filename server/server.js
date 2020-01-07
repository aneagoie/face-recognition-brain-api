const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
var bcrypt = require('bcrypt-nodejs');

/*
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT --> user
*/

const database = {
  users: [{
      id: '123',
      name: 'Andrei',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Juan',
      password: 'wghhh',
      email: 'juan@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  secrets: {
    users_id: '123',
    hash: 'wghhh'
  }
}

app.use(cors());
app.use(bodyParser.json());
//app.get('/', (req, res) => res.send('Hello World!'));

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {

  // let hash = '$2a$10$vDN2ER18wfa3rbZmOH5s2uF4D6CH5RM7tAAjA8O1aVT/dlF.FUguG'

  // // Load hash from your password DB.
  // bcrypt.compare("apples", hash, function(err, res) {
  //   console.log('First guess', res)
  // });
  // bcrypt.compare("veggies", hash, function(err, res) {
  //   console.log('Second guess', res)
  // });

  //Convert JSON into a javascript object
  //var a = JSON.parse(req.body);
  console.log("JSON Response: ", req.body)
  if (req.body.username === database.users[1].email && req.body.password === database.secrets.hash) {
    //res.json('signed in');
    res.send(database.users[1])
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

  const { email, name, password } = req.body;

  //A hash function takes a string a jungles it up ($2a$10$vDN2ER18wfa3rbZmOH5s2uF4D6CH5RM7tAAjA8O1aVT/dlF.FUguG)
  bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:userId', (req, res) => {

  const { userId } = req.params;
  let found = false;

  database.users.forEach(user => {
    if (user.id === userId) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(404).json('no user')
  }

})

app.put('/image', (req, res) => {

  const { id } = req.body;
  
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      //console.log("User: ", user);
      return res.json(user.entries);
    }
  })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

/* Notes:
*********
 *  Always use important infromation to the backend with https, POST and encripting the information
 * 
*/

//Using bcrypt-nodejs
/********************/
// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });