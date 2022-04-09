
var usersRouter = require('./routes/users');

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

const controller = require('./authController')

const host = '127.0.0.1'
const port = 7000

const {body, check, validationResult} = require("express-validator")

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

app.use(express.static(__dirname + "/public")); //

app.use(express.json())



// ...
app.use('/users', usersRouter);




app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)