const express = require("express");
const Router = express.Router();

const UserController = require("./controllers/Users");
const User = require("./models/User");

Router.get("/", UserController.index);
Router.get("/login", UserController.login);
Router.get("/register", UserController.register)
Router.post("/create", UserController.create);
Router.post("/authenticate", UserController.authenticate);
module.exports = Router;