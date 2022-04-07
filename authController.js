const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
require('dotenv').config();


class authController {
    async signin(req, res){
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
    }

    async me(req, res){

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
    }
}

module.exports = new authController()