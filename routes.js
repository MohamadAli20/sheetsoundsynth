const express = require("express");
const Router = express.Router();

const UserController = require("./controllers/Users");

Router.get("/", UserController.index);
Router.get("/playground", UserController.playground);
Router.get("/register_account", UserController.register);
Router.post("/create", UserController.create);
Router.get("/save_music_page", UserController.music_list);
Router.post("/login_account", UserController.login);
Router.post("/save_music", UserController.add_music);
Router.post("/music_library", UserController.music_library);
Router.post("/delete_music/:musicId", UserController.delete_music);

module.exports = Router;