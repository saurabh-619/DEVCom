const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const methodOverride = require('method-override'); //For handelling PUT requests
const flash = require('connect-flash'); //For flash msg before CRUD oprations i.e warnings
const session = require('express-session'); //For authentication
const passport = require('passport');



mongoose.connect("mongodb+srv://Saurabh:9922676876sb@cluster0-18d6u.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true}); 




//Connect to the Local datebase
// mongoose.connect("mongodb://localhost:27017/devcomDBV2", {useNewUrlParser: true});






const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Load Passport
require('./config/passport')(passport);




//Middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(methodOverride('_method')); //Method override Middleware
app.use(session({saveUninitialized: true, resave: 'true', secret: 'secret'}));
app.use(flash()); //connect flash
app.use(express.static('public'));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  res.locals.user = req.user||null;
  next();
});


//Home route
app.get('/',function(req,res){
  res.render('home',{title: "Welcome 😊"});
});


//About route
app.get("/about",function(req,res){
  res.render('about');
});


 
//Use ideas  routes
app.use('/ideas', ideas); //handles all /ideas routes with ideas.js file

//Use users route
app.use('/users', users);

app.listen( process.env.PORT || 3000 , function(){
  console.log("Server running on the PORT 3000...");
});