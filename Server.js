//Create express app
const mc = require("mongodb").MongoClient;
const express = require('express')
const session = require('express-session')
const fs = require("fs");
const basicAuth= require('basic-auth')
const path=require('path')
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/a4',
  collection: 'sessiondata'
});
//initialize store
const app = express()
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
// use functions
app.set("view engine", "pug");
// Use the session middleware
//Set the store property in the options
app.use(session({ secret: 'Ghallerhorn', store: store }))
// they said the secret could be anything sooo
//variables
let failsafe;
let db;
let purchased;
let send={};
let users;
let loggedin;
let ObjectId=require('mongodb').ObjectId
// variables used inside the server

//gets 
app.get("/",  start);
app.get("/save", save)
app.get("/Home", start);
app.get("/register", register)
app.get("/view",viewU)
app.get("/order",auth, Orderform)
app.get("/registerHandler.js", LogginginScript)
app.get("/reg.js", regscript)
app.get("/User", auth, userPage)
app.get("/Logout", Logout)
app.get("/users/:_id", getSpecificId)
app.post("/save",express.json(), setPriv)
//POSTS
app.post("/Login", Login)
app.post("/registration", registration)
app.post("/history",express.json() ,History)
//functions which cross back to the function
function auth (req,res,next){
	if(!req.session.loggedin){
		console.log("not auth")
		res.redirect("/")
	}
	next()
}
function getSpecificId(req, res, next){
	//console.log(req.path)
	console.log(req.params.userID)
	let id=  JSON.stringify(req.path).split("/").pop().split('"')[0]

	
	console.log(id)
	db.collection("users").findOne({_id: ObjectId(id)}, function(err, result){
		if(err){throw err;} 
		console.log(result)
		if (result.privacy==false)
		{
			if (result.username==req.session.username){
				let person= result.username;
				db.collection("foodpurchases").find({name: person}).toArray(function (err,result){
					//if(err){throw err;}
				
					let purchased= result
					send={person, purchased}
					res.format({
						
						"text/html":()=> {res.render("Userpage", {send:send})},
						"application/json": ()=> {res.status(200).json(send) }
					});
					

				});
			}
			else{
				let person= result.username;
				db.collection("foodpurchases").find({name: person}).toArray(function (err,result){
					//if(err){throw err;}
				
					let purchased= result
					send={person, purchased}
					res.format({
						
						"text/html":()=> {res.render("viewpage", {send:send})},
						"application/json": ()=> {res.status(200).json(send) }
					});
					

				});
			}
		}
		else
		{
			res.status(403).send("You cannot access this person")
		}
		})
		
	
}
function History (req,res,next){
	//console.log(req.body)
	req.body.name=failsafe
	let histo=req.body
	histo.name=req.session.username
	console.log(failsafe)
	db.collection("foodpurchases").insertOne(
	histo,
	   {
		 writeConcern: histo,
		 ordered: true
	   }
	
	)
	//console.log(histo)
}

function Login(req, res, next){
	
	if(req.session.loggedin){
		console.log("you are already logged in")
		res.redirect("/User");
		return
	}
	let username = req.body.name;
	let Password = req.body.Password;
	db.collection("users").findOne({username: username}, function(err, result){
		if(err){throw err;} 
		console.log(result.username)
		console.log(result.Password)
		
		if(result){
			if(result.Password === Password){
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect("/User")
			}else{
				res.status(401).send("Not authorized. Invalid password.");
				
			}
		}else{
			res.status(401).send("Not authorized. Invalid username.");
		
		}
		
	});
}
function Logout(req, res, next){

	if(req.session.loggedin){
		req.session.loggedin = false;
		//res.status(200).send("Logged out.");
		
	}else{
		//res.status(200).send("not logged in");
		
	}
	res.redirect("/")
}
function LogginginScript (req, res, next){
	res.sendFile(path.join(__dirname+'/registerHandler.js'))


}
function start( req, res ,next){
	if (req.session.loggedin)
	{
	let person= req.session.username;
	db.collection("foodpurchases").find({name: req.session.username}).toArray(function (err,result){
		//if(err){throw err;}
	
		let purchased= result
		send={person, purchased}
		res.format({
			
			"text/html":()=> {res.render("Userpage", {send:send})},
			"application/json": ()=> {res.status(200).json(send) }
		});
		

	});
	}
	else{
	res.format({
		"text/html":()=> {res.render("entryPage")},
	});
		}
	
}
function Orderform( req, res, next){
	res.sendFile("orderform.html", {root: path.join(__dirname, "./public")});
}
function regscript(req, res, next)
{
	res.sendFile(path.join(__dirname+'/reg.js'))
}
function registration( req, res, next){
	
	//console.log(req.body.name);
	//console.log(req.body.Password);
	//console.log(req.params.uID)
	let username = req.body.name;
	let Password = req.body.Password;
	let privacy=false
	let newUser={username, Password, privacy}
	//console.log(privacy)
	db.collection("users").findOne({username: username}, function(err, result){
		
		if(result !=null){
			
			console.log("error, cannot register")
			res.redirect("/register")
			return
		}
		db.collection("users").insertOne(
		newUser,
		{
		 writeConcern: newUser,
		 ordered: true
		}
	
		)
		req.session.loggedin=true
		req.session.username=username
		res.redirect("/User")
	});

}
function register(req,res,next){
		res.format({
		"text/html":()=> {res.render("register")},
	});
}
function save(req, res, next){
	res.sendFile(path.join(__dirname+'/save.js'))
}
function setPriv(req, res, next){

	let bool;
	if (req.body.answer=="Yes"){bool=true}
	else{bool=false}
	console.log(bool)
	db.collection("users").findOneAndUpdate(
		{username:req.session.username},
		{$set: { privacy: bool}}

		)
	
}
function userPage(req, res, next){
	let person= req.session.username;
	db.collection("foodpurchases").find({name: req.session.username}).toArray(function (err,result){
		//if(err){throw err;}
		console.log(result)
		let purchased= result
		console.log(purchased)
	});
	send={person, purchased}
	res.format({
		"text/html":()=> {res.render("Userpage", {send:send})},
		"application/json": ()=> (res.status(200).json(send))
	});
	
}

function viewU( req, res, next){
	db.collection("users").find({privacy: false}).toArray( function(err, result){
		if(err){throw err;} 
		console.log(result);
		let users=result
		res.format({
		"text/html":()=> {res.render("resIndex",{users:users} )},
		"application/json": ()=> {res.status(200).json(users) }
		});
		
	});

}





// Initialize database connection
mc.connect("mongodb://localhost:27017", function(err, client) {
	if (err) {
		console.log("Error in connecting to database");
		console.log(err);
		return;
	}

	db = client.db("a4");
	
	//Only start listening now, when we know the database is available
  app.listen(3000);
  console.log("Listening on port 3000");
  console.log('Server running at http://127.0.0.1:3000/');
})