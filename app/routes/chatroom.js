const express = require("express");
require("./mongoose");
require("./models/chatroom");

const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");
const chatroomRoutes = new express.Router();

const auth = require("../middlewares/auth");

chatroomRoutes.get("/", auth, catchErrors(chatroomController.getAllChatrooms));

chatroomRoutes.post("/", auth, catchErrors(chatroomController.createChatroom));

module.exports = chatroomRoutes;
