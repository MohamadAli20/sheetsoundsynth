const model = require("../models/User");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

class Users{
    /*render view files*/
    // index(req, res){
    //     res.render("index", { username: req.session.name });                
    // }
    index(req, res){
        res.render("index");
    }
    playground(req, res){
        res.render("conversion");
    }
    register(req, res){
        res.render("register");
    }
    
    // music_library(req, res){
    //     let data = this.retrieve_music(req, res);
    //     console.log(req.session.userId);
    //     console.log(req.session.name)
    //     res.render("savemusic", { username: req.session.name });
    // }

    /*create and retrieve user account*/
    create(req, res){
        let result = "";
        /*validate email*/
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = regex.test(req.body.email);

        if(req.body.username === "" || req.body.email === "" || req.body.password === "" || req.body.confirm_pass === ""){
            result += "Fill in all the required information. ";
        }
        if(isValidEmail === false){
            result += "Email is invalid ";
        }
        if(req.body.password !== req.body.confirm_pass){
            result += "Passwords do not match!";
        }
        if(req.body.password.length < 8 || req.body.password.length > 20){
            result += "Password length should be between 8 and 20 characters. "
        }
        if(req.body.username !== "" && isValidEmail === true && (req.body.password === req.body.confirm_pass)){
            model.register_account(req.body, (found) => {
                if(found){
                    result = "Email is already taken. ";
                }
                else{ /*not found*/
                    result = "success";
                }
                res.render("register", { result });
            });
            
        }
        else{
            res.render("register", { result });
        }
        
    }
    login(req, res){
        let result = "";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = regex.test(req.body.email);

        if(req.body.login_email === "" || req.body.login_password === ""){
            result += "Fill in all the required information. ";
        }
        if(isValidEmail === false){
            result += "Email is invalid ";
        }
        if(req.body.login_email !== "" && req.body.login_password !== ""){
            model.verify_account(req.body, (error, verified, information) => {
                if(error){
                    console.error(error);
                    return;
                }
                if(verified){
                    console.log(information);
                    req.session.userId = information.id;
                    req.session.name = information.username;
                    res.send({name: req.session.name});
                }
                if(!verified){
                    result = "Login Failed";
                    res.send(result);
                }
            });
        }
        else {
            res.send(result); // Render result without verification
        }
    }
    logout(req, res){
        console.log("Remove session data");
        req.session.destroy(); /*destroy the session*/
        res.redirect("login");
    }

    /*save, retrieve and delete music*/
    save_music(req, res){
        let music_info = {
            userId: req.session.userId,
            imagePath: req.body.pathImage,
            midiPath: req.body.pathMidi
        };
        model.insert_music(music_info, (error) => {
            if(error){
                console.error(error);
                return;
            }
        });
    }
    music_library(req, res){
        let userId = req.session.userId;
        model.select_music(userId, (error, data) => {
            if(error){
                console.error(error);
                return;
            }
            if(data){
                console.log(data);
                // res.render("savemusic", { username: req.session.name, music: data });                                
                res.status(200).json(data);
            }
        })
    }
    delete_music(req, res){
        const musicId = req.params.musicId;
        model.delete_music(musicId, (error) => {
            
        });
    }
}
module.exports = new Users;

