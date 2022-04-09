const {body, check, validationResult} = require("express-validator")

module.exports = function (req, res, next) {
    console.log('CB1');
  
    //check(req.body.login, "Имя пользователя не может быть пустым").notEmpty()
  
    //check('login').isLength({ min: 3 });

    if ((req.body.login).length > 0){
        console.log('Length > 0');
    } else {
        console.log('Length < 1');
        return res.status(403).json({message: "логин должен быть заполнен"})
    }

    if ((req.body.password).length > 0){
      console.log('Length > 0');
  } else {
      console.log('Length < 1');
      return res.status(403).json({message: "пароль должен быть заполнен"})
  }

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