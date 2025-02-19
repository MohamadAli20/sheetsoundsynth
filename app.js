const express = require("express");
const routes = require("./routes");
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');
const axios = require('axios');
const multer  = require('multer')

/*Session data*/
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(bodyParser.urlencoded({extended: true}));

/*new*/
app.use("/", routes);
app.use("/playground", routes);
app.use("/register", routes);

/*serving static content*/
app.use(express.static("assets"));
app.use(express.static("flask_server"))
app.use(express.static("uploads"));

/*using templates*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('images'), async (req, res) => {
    let imagePath = req.file.destination + req.file.filename;
    try{
        const flaskServerURL = 'http://127.0.0.1:5000/process-image'; // Replace with the Flask server URL and port

        /*make HTTP POST request to Flask server*/
        const response = await axios.post(flaskServerURL, { imagePath });

        let midiPath = response.data;
        imagePath = "/" + req.file.filename;
        // let midiPath = "/midi/images-1713781922800.mid";
        
        res.send({imagePath, midiPath});
    }
    catch(error){
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
    console.log("http://localhost:8080")
});
