const User = require("../models/user");
const Form = require("../models/form");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");
const departments = require("../constants");
const Notification = require("../models/notification");

exports.register = async (req, res) => {
  const { username, email, password, department } = req.body;

  // const userExists = await User.findOne({
  //   email,
  // });

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists && userExists.email === email)
    throw "User with same email already exists.";
  if (userExists) throw "This username is already taken";

  const user = new User({
    username,
    email,
    department,
    password: sha256(password + process.env.SALT),
  });

  const response = await user.save();

  res.json({
    message: "User [" + username + "] registered successfully!",
    approverId: response._id,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Email and Password did not match.";

  const token = await jwt.sign(
    { id: user.id, username: user.username, department: user.department },
    process.env.SECRET
  );

  const usersOfOtherDepartment = await User.find({
    department: { $ne: user.department },
  }).select("username");

  const allUserForms = await Form.find({ requestorId: user.id });

  const userForms = {
    pending: allUserForms.filter((form) => form.state === "pending"),
    approved: allUserForms.filter((form) => form.state === "approved"),
    rejected: allUserForms.filter((form) => form.state === "rejected"),
  };

  const approvalRequest = await Form.find({
    approvalDepartment: user.department,
    state: "pending",
  });

  const notifications = await Notification.find({});

  res.json({
    message: "User logged in successfully!",
    token,
    user,
    departments,
    usersOfOtherDepartment: usersOfOtherDepartment.map(({ _id, username }) => ({
      username,
      approverId: _id,
    })),
    userForms,
    approvalRequest,
    notifications,
  });
};

exports.userData = async (req, res) => {
  const usersOfOtherDepartment = await User.find({
    department: { $ne: req.payload.department },
  }).select("username");

  const allUserForms = await Form.find({ requestorId: req.payload.id });

  const userForms = {
    pending: allUserForms.filter((form) => form.state === "pending"),
    approved: allUserForms.filter((form) => form.state === "approved"),
    rejected: allUserForms.filter((form) => form.state === "rejected"),
  };

  const approvalRequest = await Form.find({
    approvalDepartment: req.payload.department,
    state: "pending",
  });

  const notifications = await Notification.find({});

  res.json({
    user: {
      department: req.payload.department,
      username: req.payload.username,
      _id: req.payload.id,
    },
    departments,
    usersOfOtherDepartment: usersOfOtherDepartment.map(({ _id, username }) => ({
      username,
      approverId: _id,
    })),
    userForms,
    approvalRequest,
    notifications,
  });
};
