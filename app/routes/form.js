const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");
const formController = require("../controllers/formController");
const formRoute = new express.Router();
const auth = require("../middlewares/auth");

formRoute.post("/form", auth, catchErrors(formController.postform));
formRoute.patch("/form", auth, catchErrors(formController.updateForm));
// formRoute.get("/form", auth, catchErrors(formController.getForm));
// formRoute.get("/forms", auth, catchErrors(formController.getForms));
// formRoute.get("/pending", auth, catchErrors(formController.getPendingForms));

module.exports = formRoute;
