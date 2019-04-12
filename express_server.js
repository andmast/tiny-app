var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser());
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  console.log("Headers: ", req.headers.cookie);
  console.log("Cookies: ", req.cookies.user_id);
  console.log("Signed: ", req.signedCookies);
  next()
})


//=================Functions================
function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
};

function findEmail(email) {
  for(key in users){
    let check = users[key].email
    if(check === email){
      console.log(check)
      return users[key].email
    }
  }
};


//^^^^^^^^^^^^^^^^^Functions^^^^^^^^^^^^^^^^

//################Variables##################
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//^^^^^^^^^^^^^^^^^^Variables^^^^^^^^^^^^^^^^^^




//------------GETS----------------------
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  let templateVars = {username: res.cookie.username}
  res.render("registration",templateVars);
});

app.get("/urls", (req,res) => {
  let templateVars = { urls: urlDatabase,
  username: res.cookie.username };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: res.cookie.username};
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id],
  username: res.cookie.username };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//^^^^^^^^^^^^^^^^^^^Gets^^^^^^^^^^^^^^^^^^^^^^^

//+++++++++++++++++++Posts++++++++++++++++++++++


app.post("/urls", (req, res) => {
  let random = generateRandomString()
  let longURL = req.body.longURL;
  console.log("long",longURL);
  urlDatabase[random] = longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${random}`);
});

app.post("/urls/:id", (req, res) => {
  console.log("post",req.body,req.params)
  urlDatabase[req.params.id]= req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie.username = req.body.username;
  console.log(res.cookie);
  res.redirect('/urls')
});

app.post("/register",(req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userRandomID = generateRandomString();
  if(email === "" || password === ""){
    res.status(400).send("Empty Input Feilds");
  }
  if(findEmail(email)){
    res.status(400).send("Email already registered");
  }

  users[userRandomID] = {
    id: userRandomID,
    email: email,
    password: password,
  }
  console.log(users[userRandomID]);
  res.cookie.user_id = userRandomID;
  console.log(users[res.cookie.user_id]);
  res.redirect("/urls");
});

//^^^^^^^^^^^^^^^^^^^Posts^^^^^^^^^^^^^^^^^^^^^^


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









