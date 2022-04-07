const express = require('express'),
  app = express(),
  jwt = require('jsonwebtoken'),
  users = require('./users')

const fs = require("fs");
require('dotenv').config();
const mongoose = require("mongoose");

//
mongoose
    .connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error));


const Schema = mongoose.Schema;


// установка схемы
const userScheme = new Schema({
    login: String,
    password: String
});

const User = mongoose.model("users1", userScheme);
//

  const router = new express()
  const appMiddleware = require('./Middleware/appMiddleware')
  const signinMiddleware = require('./Middleware/signinMiddleware')
  const signupMiddleware = require('./Middleware/signupMiddleware')

const host = '127.0.0.1'
const port = 7000

const {body, check, validationResult} = require("express-validator")

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

router.use(express.static(__dirname + "/public")); //

router.use(express.json())
/*
router.use((req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      tokenKey,
      (err, payload) => {
        if (err) next()
        else if (payload) {
          for (let user of users) {
            if (user.id === payload.id) {
              req.user = user
              next()
            }
          }

          if (!req.user) next()
        }
      }
    )
  }

  next()
})
*/

/*
var jwtFunction = function(req, res, next){
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      tokenKey,
      (err, payload) => {
        if (err) next()
        else if (payload) {
          for (let user of users) {
            if (user.id === payload.id) {
              req.user = user
              next()
            }
          }

          if (!req.user) next()
        }
      }
    )
  }

  next();
}
*/

router.post('/api/next', (req, res) => {
  for (let user of users) {
    if (
      req.body.login === user.login &&
      req.body.password === user.password
    ) {
      return res.status(200).json({
        id: user.id,
        login: user.login,
        token: jwt.sign({ id: user.id }, tokenKey),
      })
    }
  }

  return res.status(404).json({ message: 'User not found' })
})


var cb0 = function (req, res, next) {
  console.log('CB0');

  //check(req.body.login, "Имя пользователя не может быть пустым").notEmpty()

  //check('login').isLength({ min: 3 });
  body('login').isLength({ min: 3 });
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('ErrorEmpty')
      // There are errors. Render form again with sanitized values/errors messages.
      // Error messages can be returned in an array using `errors.array()`.
      }
  else {
    console.log('good, not empty')
      // Data from form is valid.
  }

  next();
}

router.post('/signin', signinMiddleware, async function(req, res){
  try{
    console.log('work');
    const userLogin = req.body.login;
    const userPassword = req.body.password;
    let user = null;
    user = await User.find({$and : [{login: userLogin}, {password: userPassword}]});
    if(isEmpty(user)){
      console.log('ErrorUser1');
        throw new Error(404);
        //return res.status(404);
    } else {
      try{
            return res.status(200).json({
              login: req.body.login,
              password: req.body.password,
              token: jwt.sign({ login: user.login, password: user.password}, tokenKey, { expiresIn: '120s' })
            })
      }
      catch(err) {
         //res.status(404).send();
         console.log('ErrorUser2', err);
         throw new Error(404);
      } 
    }

  }
  catch(error) {
      console.log('no work', error);
      res.status(404).send();
  }
})

router.post('/signup', signupMiddleware, async function(req, res){
  try{
    console.log('work');
    let user = null;
    user = await User.find({$or : [{login: req.body.login}, {password: req.body.password}]});
    if(!isEmpty(user)){
      console.log('ErrorUser1');
        throw new Error(404);
        //return res.status(404);
    } else {
      try{
        const userBase = new User({
          login: req.body.login,
          password: req.body.password
      });
    
          userBase.save();
            return res.status(200).json({
              login: req.body.login,
              password: req.body.password
              //token: jwt.sign({ id: user.id }, tokenKey, { expiresIn: '120s' })
            })
      }
      catch(err) {
         //res.status(404).send();
         console.log('ErrorUser2', err);
         throw new Error(404);
      } 
    }

  }
  catch(error) {
      console.log('no work', error);
      res.status(404).send();
  }
})

router.get('/me',  function(req, res){

  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(403).json({message: "Пользователь не авторизован"})
  }
  //jwt.verify(token, secret)

  jwt.verify(token, '1a2b-3c4d-5e6f-7g8h', (err, payload) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    console.log('get work')
    return res.status(404).json({ message: 'User found' })
  })

  return res.status(404).json({ message: 'User not found' })
})

router.post('/api/auth', signinMiddleware, function(req, res){
  for (let user of users) {
    if (
      req.body.login === user.login &&
      req.body.password === user.password
    ) {
      const userBase = new User({
        login: req.body.login,
        password: req.body.password,
        token: ""
    });
    
    userBase.save();
    
      return res.status(200).json({
        id: user.id,
        login: user.login,
        token: jwt.sign({ id: user.id }, tokenKey, { expiresIn: '120s' }),
      })
    }
  }

  return res.status(404).json({ message: 'User not found' })
})

router.get('/api/get', function(req, res){
  for (let user of users) {
    if (
      req.body.login === user.login &&
      req.body.password === user.password
    ) {
      return res.status(200).json({
        id: user.id,
        login: user.login,
        token: jwt.sign({ id: user.id }, tokenKey),
      })
    }
  }

  //const authHeader = req.headers['authorization']
  //const token = authHeader && authHeader.split(' ')[1]

  const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            //jwt.verify(token, secret)

            jwt.verify(token, '1a2b-3c4d-5e6f-7g8h', (err, payload) => {
              console.log(err)
          
              if (err) return res.sendStatus(403)
          
              console.log('get work')
              return res.status(404).json({ message: 'User found' })
            })

  return res.status(404).json({ message: 'User not found' })
})

/*
router.post('/api/next', [
  jwtFunction,
  check('login').isLength({ min: 3 }),
  check('password').isLength({ min: 3 })
], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  for (let user of users) {
    if (
      req.body.login === user.login &&
      req.body.password === user.password
    ) {
      return res.status(200).json({
        id: user.id,
        login: user.login,
        token: jwt.sign({ id: user.id }, tokenKey),
      })
    }
  }

  return res.status(404).json({ message: 'User not found' })
})
*/

router.get('/user', (req, res) => {
  if (req.user) return res.status(200).json(req.user)
  else
    return res
      .status(401)
      .json({ message: 'Not authorized' })
})


function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}


router.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)