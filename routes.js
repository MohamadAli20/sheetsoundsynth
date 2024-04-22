const express = require("express");
const Router = express.Router();

const UserController = require("./controllers/Users");
const User = require("./models/User");

/*New*/
Router.get("/", UserController.index);
Router.get("/playground", UserController.playground);
Router.get("/register_account", UserController.register);

// Router.get("/", UserController.index);
// Router.get("/login", UserController.login);
// Router.get("/register", UserController.register)
Router.get("/music_library", UserController.music_library);
Router.post("/create", UserController.create);
Router.post("/authenticate", UserController.authenticate);
Router.post("/save_music", UserController.save_music);
Router.get("/logout", UserController.logout);
Router.post("/delete_music/:musicId", UserController.delete_music);



module.exports = Router;