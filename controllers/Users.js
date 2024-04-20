const model = require("../models/User");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

class Users{
    /*render view files*/
    index(req, res){
        res.render("index");
    }
    login(req, res){
        res.render("login");
    }
    register(req, res){
        res.render("register");
    }

    /*functions interact with model*/
    create(req, res){
        let result = "";
        /*validate email*/
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = regex.test(req.body.email);

        if(req.body.firstname === "" || req.body.lastname === "" || req.body.email === "" || req.body.password === "" || req.body.confirm_pass === ""){
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
        if(req.body.firstname !== "" && req.body.lastname !== "" && isValidEmail === true && (req.body.password === req.body.confirm_pass)){
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
    authenticate(req, res){
        let result = "";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = regex.test(req.body.email);

        if(req.body.email === "" || req.body.password === ""){
            result += "Fill in all the required information. ";
        }
        if(isValidEmail === false){
            result += "Email is invalid ";
        }
        if(req.body.email !== "" && req.body.password !== ""){
            model.verify_account(req.body, (error, verified, information) => {
                if(error){
                    console.error(error);
                    return;
                }
                if(verified){
                    res.render("index", { information });
                }
                if(!verified){
                    result = "Login Failed";
                    res.render("login", { result });
                }
            });
        }
        else {
            res.render("login", { result }); // Render result without verification
        }
    }
}
module.exports = new Users;

