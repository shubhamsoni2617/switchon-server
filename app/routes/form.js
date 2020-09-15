const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");
const formController = require("../controllers/formController");
const formRoute = new express.Router();
const auth = require("../middlewares/auth");

formRoute.post("/form", auth, catchErrors(formController.postform));
formRoute.patch("/form", auth, catchErrors(formController.updateForm));
module.exports = formRoute;
