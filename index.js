var express = require("express")
var bodyparser = require("body-parser")
var session = require("express-session")
var userRoute = require("./routes/user")
var app = express()

app.use(bodyparser.urlencoded({extended:true}))
app.use(session({secret:"jerry",resave:true,saveUninitialized:true}))
app.use(express.static("public/"))

app.use("/",userRoute)

const PORT = 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });