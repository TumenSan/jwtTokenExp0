const express = require('express'),
  app = express(),
  jwt = require('jsonwebtoken')

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

//const User = require('./models/User')
//const Role = require('./models/Role')

const User = mongoose.model("users1", userScheme);
//

  const router = new express()
  const signinMiddleware = require('./Middleware/signinMiddleware')
  const signupMiddleware = require('./Middleware/signupMiddleware')
  const controller = require('./authController')

const host = '127.0.0.1'
const port = 7000

const {body, check, validationResult} = require("express-validator")

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

router.use(express.static(__dirname + "/public")); //

router.use(express.json())



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
              token: jwt.sign({ login: user.login, password: user.password}, tokenKey, { expiresIn: '1h' })
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
        try{
          const decodedData = jwt.verify(token, '1a2b-3c4d-5e6f-7g8h');

        console.log('get work')
          return res.status(200).json({
            decodedData
          })
        }
        catch{
          return res.status(404).json({ message: 'User not found' })
        }
})

router.get('/users',  function(req, res){
  let user = null;
    
    User.find({}, function(err, doc){
        //mongoose.disconnect();
         
        if(err) return console.log(err);
         
        user = doc;
        //console.log(user);
        console.log(doc.login);

        // отправляем пользователя
        if(user){
            //res.send(user);
            return res.status(200).json({
              //login: req.body.login,
              //password: req.body.password
              user
            })
        }
        else{
            return res.status(404)
            //res.status(404).send();
        }
    });
})


router.get('/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
        if (!token) {
          return res.status(403).json({message: "Пользователь не авторизован"})
        }
        //jwt.verify(token, secret)
        try{
          const decodedData = jwt.verify(token, '1a2b-3c4d-5e6f-7g8h');

        console.log('get work')
          return res.status(200).json({
            decodedData
          })
        }
        catch{
          return res.status(404).json({ message: 'User not found' })
        }
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