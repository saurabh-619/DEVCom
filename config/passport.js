const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Load User model
const User = mongoose.model('User');

module.exports = function(passport){
  passport.use(new localStrategy({usernameField:'email'},function(email,password,done){ 
    User.findOne({email:email},function(err,matchedUser){
      if(!matchedUser)
      {
        return done(null,false,{message: "No User found 😭"});
      }
      else
      {
        //cheak password
        bcrypt.compare(password,matchedUser.password,function(err,isMatch){
          if(isMatch){
             return done(null,matchedUser);
          }else{
            return done(null,false,{message: "Password Incorrect 🤨"});
          }
        })
      }
    })
  }))



  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

