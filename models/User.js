const mongoose = require('mongoose');

//Schema
const userSchema = {
  name: {
    type: String,
    require: true
  },
  email : {
    type: String,
    require: true
  },
  password : {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now()
  } 
};

//Model(Table)
mongoose.model("User",userSchema);
