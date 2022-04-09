const User = require("./User");
const express = require("express");
var router = express.Router();
//const router = new express();
const jwt = require("jsonwebtoken");
//const { validationResult } = require('express-validator');
const signinMiddleware = require('./signinMiddleware');
const signupMiddleware = require('./signupMiddleware');
require("dotenv").config();
const tokenKey = "1a2b-3c4d-5e6f-7g8h";


/**
 * @openapi
 * /users/signin:
 *   post:
 *     description: signin
 *     responses:
 *       200:
 *         description: signin ok
 */


router.post("/signin", signinMiddleware, async function (req, res) {
  try {
    console.log("work");
    const userLogin = req.body.login;
    const userPassword = req.body.password;
    let user = null;
    user = await User.find({
      $and: [{ login: userLogin }, { password: userPassword }],
    });
    if (isEmpty(user)) {
      console.log("ErrorUser1");
      throw new Error(404);
      //return res.status(404);
    } else {
      try {
        return res.status(200).json({
          login: req.body.login,
          password: req.body.password,
          token: jwt.sign(
            { login: user.login, password: user.password },
            tokenKey,
            { expiresIn: "1h" }
          ),
        });
      } catch (err) {
        //res.status(404).send();
        console.log("ErrorUser2", err);
        throw new Error(404);
      }
    }
  } catch (error) {
    console.log("no work", error);
    res.status(404).send();
  }
});

/**
 * @openapi
 * /users/signup:
 *   post:
 *     description: signup
 *     responses:
 *       200:
 *         description: signup ok
 */

router.post("/signup", signupMiddleware, async function (req, res) {
  try {
    console.log("work");
    let user = null;
    user = await User.find({
      $or: [{ login: req.body.login }, { password: req.body.password }],
    });
    if (!isEmpty(user)) {
      console.log("ErrorUser1");
      throw new Error(404);
      //return res.status(404);
    } else {
      try {
        const userBase = new User({
          login: req.body.login,
          password: req.body.password,
        });

        userBase.save();
        return res.status(200).json({
          login: req.body.login,
          password: req.body.password,
          //token: jwt.sign({ id: user.id }, tokenKey, { expiresIn: '120s' })
        });
      } catch (err) {
        //res.status(404).send();
        console.log("ErrorUser2", err);
        throw new Error(404);
      }
    }
  } catch (error) {
    console.log("no work", error);
    res.status(404).send();
  }
});

/**
 * @openapi
 * /users/me:
 *   post:
 *     description: me
 *     responses:
 *       200:
 *         description: me ok
 */


router.get("/me", function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
  //jwt.verify(token, secret)
  try {
    const decodedData = jwt.verify(token, "1a2b-3c4d-5e6f-7g8h");

    console.log("get work");
    return res.status(200).json({
      decodedData,
    });
  } catch {
    return res.status(404).json({ message: "User not found" });
  }
});

/**
 * @openapi
 * /users/users:
 *   get:
 *     description: users
 *     responses:
 *       200:
 *         description: users ok
 */

router.get("/users", function (req, res) {
  let user = null;

  User.find({}, function (err, doc) {
    //mongoose.disconnect();

    if (err) return console.log(err);

    user = doc;
    //console.log(user);
    console.log(doc.login);

    // отправляем пользователя
    if (user) {
      //res.send(user);
      return res.status(200).json({
        //login: req.body.login,
        //password: req.body.password
        user,
      });
    } else {
      return res.status(404);
      //res.status(404).send();
    }
  });
});

/**
 * @openapi
 * /users/user:
 *   get:
 *     description: user
 *     responses:
 *       200:
 *         description: user ok
 */

router.get("/user", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
  //jwt.verify(token, secret)
  try {
    const decodedData = jwt.verify(token, "1a2b-3c4d-5e6f-7g8h");

    console.log("get work");
    return res.status(200).json({
      decodedData,
    });
  } catch {
    return res.status(404).json({ message: "User not found" });
  }
});

function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}

module.exports = router;
