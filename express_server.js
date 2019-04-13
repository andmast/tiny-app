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
      check = users[key];
      return check
    }
  }
};

function findUrldatabase(user_id){

};

function isLoggedIn(cookie){
  for(key in users){
    let check = cookie
    if(check === key){
      return false;
    } else {
      return true;
    }
  }
}

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
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
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
  let templateVars = {
    user: users[res.cookie.user_id],
  }
  res.render("registration",templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[res.cookie.user_id],
  }
  res.render("login",templateVars);
});
app.get("/urls", (req,res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[res.cookie.user_id]
  };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  console.log(res.cookie.user_id)
  console.log(isLoggedIn(res.cookie.user_id))
  if (isLoggedIn(res.cookie.user_id)){
    console.log("not logged@#@#$#$@#$@#$@#%@",true)
  }
  let templateVars = {
    urls: urlDatabase,
    user: users[res.cookie.user_id]
  };
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[res.cookie.user_id]
  };
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
  let check = findEmail(req.body.email)
  let email = req.body.email;
  let password = req.body.password;
  console.log("check",check)
//----------Checking password------------------
  if (check === undefined){
    return res.status(403).send("Not registered");
  } else if (check.email === email && check.password === password) {
    res.cookie("user_id", check.id)
    console.log(check.id);
    res.cookie.user_id = check.id;
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
  console.log(res.cookie);
  res.clearCookie('user',"user_id");
  console.log(res.cookie.user_id);
  res.redirect("/login");
});

app.post("/register",(req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userRandomID = generateRandomString();
  let check = findEmail(email);
//===============Checking Register============
  if(email === "" || password === ""){
    return res.status(400).send("Empty Input Feilds");
  }
  console.log("check",check);
  if( check !== undefined){
    return res.status(400).send("Email already registered");
  }
  if (check === undefined){
    users[userRandomID] = {
      id: userRandomID,
      email: email,
      password: password,
    }
    console.log(users[userRandomID]);
    res.cookie.user_id = userRandomID;
    console.log(users[res.cookie.user_id]);
    res.redirect("/urls");
  }
//==============================================
});


//^^^^^^^^^^^^^^^^^^^Posts^^^^^^^^^^^^^^^^^^^^^^


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









