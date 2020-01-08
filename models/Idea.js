const mongoose = require('mongoose');

//Schema
const ideaSchema = {
  title: {
    type: String,
    require: true
  },
  details: {
    type: String,
    require: true
  },

  userId: {
    type: String,
    require: true
  },

  userName: {
    type: String,
    require: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
};

//Model(Table)
mongoose.model("Idea",ideaSchema);
