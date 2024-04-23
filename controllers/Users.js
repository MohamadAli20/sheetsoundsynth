const model = require("../models/User");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

class Users{
    /*render view files*/
    index(req, res){
        res.render("index");
    }
    playground(req, res){
        res.render("conversion");
    }
    register(req, res){
        res.render("register");
    }
    music_list(req, res){
        res.render("savemusic");
    }
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
                    result = "Email is already taken.";
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
                    req.session.userId = information.id;
                    res.send({id: information.id, name: information.username});
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

    /*save, retrieve and delete music*/
    add_music(req, res){
        const id = req.body.id;
        const pathImage = req.body.pathImage;
        const pathMidi = req.body.pathMidi;
        let music_info = {
            userId: id,
            imagePath: pathImage,
            midiPath: pathMidi
        };
        model.insert_music(music_info, (error) => {
            if(error){
                console.error(error);
                return;
            }
        });
    }
    music_library(req, res){
        const userId = req.body.userId;
        console.log(userId);
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

