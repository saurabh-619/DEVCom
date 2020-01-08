 const express = require('express');
 const mongoose = require('mongoose');
 const router = express.Router(); //make alias of app = router 
 const bcrypt = require('bcryptjs') //ecrypts password so thaat we can't see it
 const passport = require("passport"); 

 //load Model
require('../models/User');
const User = mongoose.model("User");




//User login page get route
router.get('/login',function(req,res){ 
  res.render('users/login',{errors:[]});
});

//User Register page get route
router.get('/register',function(req,res){
  res.render('users/register', {error:"",errors:[],name:"",email:"",password:"",passwordC:""});
});

//Post login request
router.post('/login',function(req,res,next){
  passport.authenticate('local',{successRedirect:'/ideas',failureRedirect:'/users/login',failureFlash:true})(req,res,next);
});
 

// POST register Form request
router.post('/register',function(req,res){ 
  let errors = [];
  if(req.body.password != req.body.passwordC){
    errors.push({text:"Password do not match 🙄"}); 
  }
  if(req.body.password.length < 4){
    errors.push({text:"Password must be at least 4 characters 😔"}); 
  }
 

  if(errors.length != 0)
  {
    res.render('users/register', {error:"",errors:errors,name:req.body.name,email:req.body.email,password:req.body.password ,passwordC:req.body.passwordC});
  }
  else
  {
    User.findOne({email:req.body.email},function(err,sameUser){
      if(sameUser)
      {
        req.flash('error_msg','Email Id already reistered, Try again 😟');
        res.redirect('/users/register'); 
      }
      else
      {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          passwordC: req.body.passwordC,
        });
      // HAshing of
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) { 
          if(err)
          {
            console.log(err);
          }
          else
          {

            newUser.password = hash;
            console.log(newUser);
            newUser.save(function () {
              req.flash('success_msg', 'You are now registered and can Login');
              res.redirect('/users/login');
            });
          }
        });
      }); 
      }
    });       
  }
});

// LogOut get request
router.get("/logout",function(req,res){
  req.logOut();
  req.flash('success_msg','You are Logged out 😥');
  res.redirect('/users/login')
});



module.exports = router;