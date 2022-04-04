const express = require('express'),
  app = express(),
  jwt = require('jsonwebtoken'),
  users = require('./users')

  const router = new express()
  const appMiddleware = require('./Middleware/appMiddleware')
  const cb0Middleware = require('./Middleware/cb0')

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

router.post('/api/auth', cb0Middleware, function(req, res){
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

router.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)