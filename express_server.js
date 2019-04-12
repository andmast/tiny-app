var express = require("express");
var app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser());
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  console.log("Headers: ", req.headers.cookie)
  console.log("Cookies: ", req.cookies)
  console.log("Signed: ", req.signedCookies)
  next()
})


//=================Functions================
function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
};

//^^^^^^^^^^^^^^^^^Functions^^^^^^^^^^^^^^^^

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//------------GETS----------------------
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
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



//^^^^^^^^^^^^^^^^^^^Posts^^^^^^^^^^^^^^^^^^^^^^


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});









