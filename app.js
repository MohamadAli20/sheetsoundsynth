const express = require("express");
// const session = require('express-session');
const routes = require("./routes");
const bodyParser = require('body-parser');

const app = express();

// app.use(session({
//     secret: 'keyboardkitteh',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
// }));

app.use(bodyParser.urlencoded({extended: true}));
/*use the routes*/
app.use("/", routes);
app.use("/login", routes);
app.use("/register", routes);

/*serving static content*/
app.use(express.static("assets"));

/*using templates*/
app.set("views", __dirname + "/views")
app.set("view engine", "ejs");

app.listen(8080, () => {
    console.log("Listening on port 8080");
});