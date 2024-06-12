const jwt = require('jsonwebtoken')
const User = require('../model/user');

exports.authenticate = (req,res,next)=>{
   try{
   const token = req.header('Authorisation')
   console.log(`token ${token}`)
   const user = jwt.verify(token, process.env.secret_key)
   console.log('user inside request', user)
   User.findById(user.userId)
      .then((user) => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
   }
   catch(err){
      console.log(` ${err}`)
   }
   
}
