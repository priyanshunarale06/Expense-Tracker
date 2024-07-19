var express = require("express")
var exe = require("./connection")
var route = express.Router()

route.get("/",function(req,res){
    res.render("admin/login.ejs")
})

module.exports = route;