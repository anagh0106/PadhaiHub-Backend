const mongoose = require("mongoose");

const FacultyLoginSchema = new mongoose.Schema({
  facultyInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FacultyData",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Faculty"
  }
});

module.exports = mongoose.model("FacultyLogin", FacultyLoginSchema);
