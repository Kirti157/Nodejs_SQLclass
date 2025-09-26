const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root', 
    database: 'school',
    password:'@sigma#KIRTI'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),                  // id
    faker.internet.username(),            // username
    faker.internet.email(),               // email
    faker.internet.password()             // password
  ];
}

app.get("/",(req, res)=>{
  let q = `select count(*) from users`;
  try{
  connection.query(q, (err, result) => {
    if (err) throw err;
    let count = result[0]["count(*)"];
    console.log(result[0]["count(*)"]);
    res.render("index.ejs", {count});

  });
 } catch (err) {
    console.log(err);
    res.send("There is some error.");
}
  // res.send("Welcome to home page");
});

//Home Page
app.get("/users", (req, res)=>{
  let q = `select * from users;`;
   try{
  connection.query(q, (err, users) => {
    if (err) throw err;
    // res.send(result);
    res.render("home.ejs", {users});
  });
 } catch (err) {
    console.log(err);
    res.send("There is some error.");
}
});

// Edit Page
app.get("/user/:id/edit",(req, res)=>{
  let {id}=req.params;
 let q = `select * from users where id='${id}'`;

 try{
   connection.query(q, (err, result)=>{
     if (err) throw err;
     console.log(result[0]);
     let user =result[0];
     res.render("edit.ejs", {user});
   });
 }catch(err){
console.log(err);
res.send("some err in DB...");
}
});
//Updated page
 app.patch("/user/:id", (req, res)=>{
 let {id}=req.params;
 let q = `select * from users where id='${id}'`;
  let {password: new_password, username:new_username }=req.body;
  
 try{
   connection.query(q, (err, result)=>{
     if (err) throw err;
     let user =result[0];
     if(new_password != user.password){
      res.send("Wrong password");
     }else{
    let q2 = `update users set username = '${new_username}' where id = '${id}'; `   ;
    connection.query(q2, (err, result)=>{
      if(err) throw err;
    res.redirect("/users");
    });
    }
     
   });
 }catch(err){
console.log(err);
res.send("some err in DB...");
}
 });

 //create new 
 app.get("/user/create", (req, res)=>{
res.render("create.ejs");
 });
 app.post("/user/post", (req,res)=>{
  let {id, username, email, password}= req.body;

  let q =`insert into users(id, email, username, password) values ('${id}','${email}', '${username}', '${password}');`;
  connection.query(q, (err, result)=>{
    if(err) throw err;
    res.redirect("/users");
  });
 });
app.get("/user/:id/delete", (req, res)=>{
  let {id} = req.params;
   let q = `select * from users where id='${id}'`;

   connection.query(q, (err, result)=>{
     if (err) throw err;
     console.log(result[0]);
     let user =result[0];});
res.render("delete.ejs", {id});
});
app.post("/user/:id/delete", (req, res)=>{
  let {id} = req.params;
 let q = `select * from users where id='${id}';`;
  let {email : form_email, password : form_password} = req.body;

try{
  connection.query(q, (err, result)=>{

    if(err) throw err;
     console.log(result[0]);
     let user =result[0];

     if(form_password == user.password && form_email==user.email ){
      let q3 = `delete from users where id ='${id}';`;
       connection.query(q3, (err, result)=>{
      if(err) throw err;
    res.redirect("/users");
     });

     }else{
  
      res.send("Wrong password"); 
}
    
  });
}catch(err){
  console.log(err);
res.send("some err in DB...");
}
});

//Server 
app.listen("8080", ()=>{
  console.log("server is listening to port 8080");
});

//Inserting New Data

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
// for(let i= 0; i<=5; i++){
//  data.push(getRandomUser());
// }
// let users = [
//   [125, '125_newuserb', 'abc@gmail.comb', 'abcb'],
//   [126, '126_newuserc', 'abc@gmail.comc', 'abcc']
// ];

// try{
// connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
// });
// } catch (err) {
//     console.log(err);
// }
// connection.end();





