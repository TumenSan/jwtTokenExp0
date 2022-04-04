module.exports = function(req, res, next){
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
  };