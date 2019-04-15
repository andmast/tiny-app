var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser());
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.use(function(req, res, next) {
  console.log("Headers: ", req.headers.cookie);
  console.log("Cookies: ", req.cookies.user_id);
  console.log("Signed: ", req.signedCookies);
  next()
})
const bcrypt = require('bcrypt');
//--------------------------------------------


//=================Functions================
function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
};

function findEmail(email) {
  for(key in users){
    let check = users[key].email
    if(check === email){
      check = users[key];
      return check
    }
  }
};

function urlsForUser(id){
  let urls = {};
  for(key in urlDatabase){
    if(urlDatabase[key].userID === id){
      urls[key] = urlDatabase[key].longURL
    }
  }
  return urls;
};

//^^^^^^^^^^^^^^^^^Functions^^^^^^^^^^^^^^^^

//################Variables##################
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: bcrypt.hashSync("dishwasher-funk", 10)
  }
}
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

//^^^^^^^^^^^^^^^^^^Variables^^^^^^^^^^^^^^^^^^




//------------GETS----------------------
app.get("/", (req, res) => {
  if (!req.session.user_id){
    res.redirect("/login");
  } else {
    res.redirect("/urls")
  }
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: undefined,
  }
  res.render("registration",templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: undefined
  };
  res.render("login",templateVars);
});

app.get("/urls", (req,res) => {
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id]
  };
  if (!req.session.user_id){
    return res.status(403).send("Login in to see urls");
  } else {
    res.render("urls_index", templateVars)
  }
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  if (!req.session.user_id){
    res.redirect("/login")
  } else {
    res.render("urls_new",templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id]
  };
  if (!req.session.user_id){
    return res.status(403).send("Login in to see url");
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL)
});

//^^^^^^^^^^^^^^^^^^^Gets^^^^^^^^^^^^^^^^^^^^^^^






//+++++++++++++++++++Posts++++++++++++++++++++++


app.post("/urls", (req, res) => {
  let random = generateRandomString()
  let longURL = req.body.longURL;
  console.log("long",longURL);
  urlDatabase[random] = {
    longURL: longURL,
    userID: req.session.user_id
  }
  console.log(urlDatabase);
  res.redirect(`/urls/${random}`);
});

app.post("/urls/:id", (req, res) => {
  console.log("post",req.body,req.params)
  urlDatabase[req.params.id]= {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let check = findEmail(req.body.email)
  let typedPassword = req.body.password
//----------Checking password------------------
  if (check === undefined){
    return res.status(403).send("Not registered");
  } else if (check.email === req.body.email && bcrypt.compareSync(typedPassword, check.hashedPassword)) {
    console.log(check.id);
    req.session.user_id = check.id;
    return res.redirect("urls");
  } else if (check.mail !== req.body.mail){
    res.status(400).send("No account registered. Please register");
  } else if (check.password !== req.body.password){
    res.status(400).send("wrong password");
  }
//------------------------------------------------
  res.redirect("/urls")
});

app.post("/logout",(req,res) => {
  req.session.user_id = undefined;
  res.redirect("/urls");
});

app.post("/register",(req,res) => {
  let userRandomID = generateRandomString();
  let check = findEmail(req.body.email);
//===============Checking Register============
  if(req.body.email === "" || req.body.password === ""){
    return res.status(400).send("Empty Input Feilds");
  } else  if( check !== undefined){
    return res.status(400).send("Email already registered");
  } else if (check === undefined) {
    users[userRandomID] = {
      id: userRandomID,
      email: req.body.email,
      hashedPassword: bcrypt.hashSync(req.body.password, 10),
    }
    console.log("reg", users[userRandomID]);
    req.session.user_id = userRandomID;
    res.redirect("/urls");
  }
//==============================================
});


//^^^^^^^^^^^^^^^^^^^Posts^^^^^^^^^^^^^^^^^^^^^^


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});