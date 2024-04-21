const express = require("express");
const Router = express.Router();

const UserController = require("./controllers/Users");
const User = require("./models/User");

Router.get("/", UserController.index);
Router.get("/login", UserController.login);
Router.get("/register", UserController.register)
Router.get("/music_library", UserController.music_library);
Router.post("/create", UserController.create);
Router.post("/authenticate", UserController.authenticate);
Router.post("/save_music", UserController.save_music);
Router.get("/logout", UserController.logout);
module.exports = Router;