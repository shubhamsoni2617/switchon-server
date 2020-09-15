const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/usercontroller");
const userRoute = new express.Router();
const auth = require("../middlewares/auth");

userRoute.post("/login", catchErrors(userController.login));
userRoute.post("/register", catchErrors(userController.register));
userRoute.get("/userdata", auth, catchErrors(userController.userData));

module.exports = userRoute;
