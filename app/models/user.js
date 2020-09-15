const { model, Schema } = require("mongoose");
const departments = require("../constants");
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: "username is required!",
    unique: "This username is already taken",
  },
  email: {
    type: String,
    required: "Email is required!",
    trim: true,
    unique: "This email is already registered",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: "Password is required!",
    select: false,
  },
  department: {
    type: String,
    required: "Department is required!",
    enum: departments,
  },
});

const user = model("User", userSchema);

module.exports = user;
