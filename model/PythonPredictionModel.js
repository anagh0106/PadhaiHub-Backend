const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  hours: {
    type: Number,
    required: true,
  },
  predictedScore: {
    type: Number,
    required: true,
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stu_Predictions", predictionSchema);
