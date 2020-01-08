const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); //helps to create other file for all routes and make alias of app = router 
const {ensureAuthenticated} = require('../helpers/auth')
//Load Models
require('../models/Idea');
const Idea = mongoose.model("Idea");


// From now / = /ideas          so no need to write /ideas
//All  Ideas of User route
router.get('/',ensureAuthenticated ,function(req,res){ 
  Idea.find({userId:req.user.id}).sort({date:"desc"}).exec(function(err,ideas){
    res.render('ideas/allideas',{ideas:ideas});
  });
});

//All Ideas route
router.get('/all',ensureAuthenticated ,function(req,res){
  Idea.find({}).sort({date:"desc"}).exec(function(err,ideas){
    res.render('ideas/all',{ideas:ideas});
  });
});

//All Ideas route
router.get('/all/single/:id',ensureAuthenticated ,function(req,res){ 
  Idea.findOne({_id:req.params.id},function(err,idea){
    res.render('ideas/singlePost',{idea:idea});
  });
});

//Add Ideas route
router.get("/add",ensureAuthenticated , function (req, res) {
  res.render('ideas/add', {errors:[]});
});

//Edit Ideas route
router.get("/edit/:id",ensureAuthenticated , function (req, res) {
  Idea.findOne({ _id: req.params.id }, function (err, idea) {
    if(idea.userId != req.user.id){
      req.flash('error_msg','Not Authorized 😡');
      res.redirect('/ideas');
    }else{
      res.render('ideas/edit', { idea: idea });
    }    
  });  
});

//Post route /ideas
router.post('/',ensureAuthenticated ,function(req,res){
  let errors = []; //for validation
  const submitedTitle = req.body.title;
  const submitedDetails = req.body.details;
  
  if (!submitedTitle)
  {
    errors.push({
      text:"Please add a title!!!"
    });
  }
  if (!submitedDetails)
  {
    errors.push({
      text: "Please add some details!!!"
    });
  }

  //cheack for errors
  if(errors.length > 0){
    res.render('ideas/add',{errors:errors});                                
  }
  else{
    const idea = new Idea({
      title:submitedTitle,
      details:submitedDetails,
      userName:req.user.name,  //user = logged in user
      userId:req.user.id,
    });
    idea.save();
    req.flash('success_msg', 'Web-Idea Added...');
    res.redirect('/ideas');
  } 
});

// // Post request for editing ideas
// app.post("/ideas/edit/:id" , function(req,res){ 
//   Idea.findByIdAndUpdate({ _id: req.params.id }, { title: req.body.title, details: req.body.details,date:Date.now()}, function (err, idea) {
//     res.redirect("/ideas");
//   });
// }) 

//OR

// Edit (PUT) request
router.put("/edit/:id",ensureAuthenticated ,function (req, res) {
  Idea.findByIdAndUpdate({ _id: req.params.id }, { title: req.body.title, details: req.body.details, date: Date.now()}, function (err, idea) {
    req.flash("success_msg","Web-Idea Updated...",);
    res.redirect("/ideas");
  });
}); 

//Delete idea
router.delete('/delete/:id',ensureAuthenticated ,function(req,res){ 
  Idea.findByIdAndDelete({_id:req.params.id},function(err){
    req.flash('success_msg','Web-Idea removed!!!');
    res.redirect('/ideas');
  });
});

module.exports = router; //export router so it that can be used from another files
