var express = require("express")
var exe = require("./connection")
var route = express.Router()

//
route.get("/",function(req,res){
    res.render("user/login.ejs")
})
route.post("/user_login",async function(req,res){
    var d = req.body;
    var sql = `SELECT * FROM user_info WHERE user_mail='${d.user_mail}' AND user_pass ='${d.user_pass}'`;
    var data = await exe(sql);
     if(data.length > 0 ){
         req.session.user_id = data[0].user_id;

         var user_id = req.session.user_id;

         var sql1 = `SELECT SUM(exp_cost) AS total FROM exp_info WHERE user_id='${user_id}'`
         var data1 =await exe(sql1);

         var sql2 = `SELECT SUM(exp_cost) AS yeart FROM exp_info WHERE YEAR(exp_date) = YEAR(NOW()) AND user_id='${user_id}'`
         var data2 =await exe(sql2);

         var sql3  = `SELECT SUM(exp_cost) AS thirtyt FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 30 DAY AND user_id='${user_id}'`
         var data3 = await exe(sql3);

         var sql4  = `SELECT SUM(exp_cost) AS sevent FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 7 DAY AND user_id='${user_id}'`
         var data4 = await exe(sql4);

         var sql5  = `SELECT SUM(exp_cost) AS yesterdayt FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 1 DAY AND user_id='${user_id}'`
         var data5 = await exe(sql5);

         var sql6  = `SELECT SUM(exp_cost) AS todayt FROM exp_info WHERE DATE(exp_date) = CURDATE() AND user_id = '${user_id}'`
         var data6 = await exe(sql6);
         res.render("user/dashboard.ejs",{"total":data1,"yeart":data2,"thirtyt":data3,"sevent":data4,"yesterdayt":data5,"todayt":data6})

     }
     else{
        res.redirect("/");
     }
})


// 
route.get("/register",function(req,res){ 
    res.render("user/register.ejs")
})
route.post("/register_user",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO user_info (user_name,user_mail,user_mob,user_pass) VALUES ('${d.user_name}','${d.user_mail}','${d.user_mob}','${d.user_pass}')`;
    await exe(sql);
    res.redirect("/")
})

// 
route.get("/dashboard",async function(req,res){
    if(req.session.user_id == undefined){
        res.redirect("/")
    }
    else{
        var user_id = req.session.user_id;

        var sql1  = `SELECT SUM(exp_cost) AS total FROM exp_info WHERE user_id='${user_id}'`
        var data1 = await exe(sql1);

        var sql2  = `SELECT SUM(exp_cost) AS yeart FROM exp_info WHERE YEAR(exp_date) = YEAR(NOW()) AND user_id='${user_id}'`
        var data2 = await exe(sql2);

        var sql3  = `SELECT SUM(exp_cost) AS thirtyt FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 30 DAY AND user_id='${user_id}'`
        var data3 = await exe(sql3);

        var sql4  = `SELECT SUM(exp_cost) AS sevent FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 7 DAY AND user_id='${user_id}'`
        var data4 = await exe(sql4);

        var sql5  = `SELECT SUM(exp_cost) AS yesterdayt FROM exp_info WHERE DATE(exp_date) >= DATE(NOW()) - INTERVAL 1 DAY AND user_id='${user_id}'`
        var data5 = await exe(sql5);

        var sql6  = `SELECT SUM(exp_cost) AS todayt FROM exp_info WHERE DATE(exp_date) = CURDATE() AND user_id = '${user_id}'`
        var data6 = await exe(sql6);
        res.render("user/dashboard.ejs",{"total":data1,"yeart":data2,"thirtyt":data3,"sevent":data4,"yesterdayt":data5,"todayt":data6})

    }
})

// 
route.get("/add_exp",function(req,res){
    res.render("user/add_exp.ejs")
})
route.post("/save_exp",async function(req,res){
    var user_id = req.session.user_id;
    var d = req.body;
    var sql = `INSERT INTO exp_info(exp_date,user_id,exp_item,exp_cost) VALUES ('${d.exp_date}','${user_id}','${d.exp_item}','${d.exp_cost}')`;
    await exe(sql);
    res.redirect("/add_exp")
})


//
route.get("/manage_exp",async function(req,res){
    var user_id = req.session.user_id;
    var sql = `SELECT *, DATE_FORMAT(exp_date, '%Y-%m-%d') AS date FROM exp_info WHERE user_id = '${user_id}' ORDER BY exp_info.exp_date DESC;`;
    var data = await exe(sql);
    res.render("user/manage_exp.ejs",{"exp":data});
})
route.get("/edit_exp/:id",async function(req,res){
    var exp_id = req.params.id;
    var data = await exe(`SELECT * FROM exp_info WHERE exp_id='${exp_id}'`);
    res.render("user/edit_exp.ejs",{"exp_info":data})
})
route.post("/update_exp/:id",async function(req,res){
    var exp_id = req.params.id;
    var d = req.body;
    var sql = `UPDATE exp_info SET exp_date='${d.exp_date}',exp_item='${d.exp_item}',exp_cost='${d.exp_cost}' WHERE exp_id='${exp_id}'`
    await exe(sql);
    res.redirect("/manage_exp")
})
route.get("/delete_exp/:id",async function(req,res){
    var exp_id = req.params.id;
    await exe(`DELETE FROM exp_info WHERE exp_id='${exp_id}'`);
    res.redirect("/manage_exp")
})


//
route.get("/exp_rep",async function(req,res){
    res.render("user/exp_rep.ejs")
})
route.post("/get_rep",async function(req,res){
    var user_id = req.session.user_id;
    var d= req.body;
    
    var sql1 = `SELECT * , DATE_FORMAT(exp_date, '%Y-%m-%d') AS date FROM exp_info WHERE exp_date BETWEEN '${d.from_date}' AND '${d.to_date}' AND user_id='${user_id}' ORDER BY exp_info.exp_date DESC`
    var data1 = await exe(sql1);

    var sql2 = `SELECT SUM(exp_cost) AS exp_cost_total FROM exp_info WHERE user_id='${user_id}' AND exp_date BETWEEN '${d.from_date}' AND '${d.to_date}'`
    var data2 = await exe(sql2);

    res.render("user/viewexp_rep.ejs",{"date":data1,"sum":data2});
})


// 
route.get("/profile",async function(req,res){
    var user_id = req.session.user_id;
    var sql = `SELECT * FROM user_info WHERE user_id='${user_id}'`;
    var data = await exe(sql);
    res.render("user/profile.ejs",{"pro":data});
})
route.post("/update_profile",async function(req,res){
    var user_id = req.session.user_id;
    var d = req.body;
    var sql = `UPDATE user_info SET user_name='${d.user_name}',user_mob='${d.user_mob}' WHERE user_id='${user_id}'`
    await exe(sql);
    res.redirect("/profile")
})


//
route.get("/change_pass",async function(req,res){
    var user_id = req.session.user_id;
    var data = await exe(`SELECT * FROM user_info WHERE user_id ='${user_id}'`);
    res.render("user/change_pass.ejs",{"user":data});
})
route.post("/update_pass",async function(req,res){
    var user_id = req.session.user_id;
    var d = req.body;
    var sql = `UPDATE user_info SET user_pass='${d.n_password}' WHERE user_id='${user_id}'`
    await exe(sql);
    res.redirect("/change_pass")
})


//
route.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
})
 
//
route.all('*', (req, res) => { 
    res.status(404).render("user/404error.ejs");
});

module.exports = route;

// CREATE TABLE user_info(user_id INT PRIMARY KEY AUTO_INCREMENT,user_name VARCHAR(50),user_mail VARCHAR(40),user_mob VARCHAR(50),user_pass VARCHAR(50));
// CREATE TABLE exp_info(exp_id INT PRIMARY KEY AUTO_INCREMENT,user_id INT,exp_date DATE,exp_item VARCHAR(40),exp_cost VARCHAR(40))