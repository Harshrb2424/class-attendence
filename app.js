const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
let DBdata = [];
// Read the JSON file
fs.readFile("./public/data/students-info-CSM.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    DBdata = jsonData;

    // console.log(jsonData); // Log the parsed JSON data
    // Work with your JSON data here
  } catch (err) {
    console.error("Error parsing JSON:", err);
  }
});
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
const users = {
  user1: "password1",
  user2: "password2",
};

app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const student = (DBdata.filter(student => student["roll-number"] === username));
  if (users[username] && users[username] === password) {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect("/home");
  } else if (student.length > 0) {
    req.session.loggedIn = true;
    req.session.username = capitalizeWords(student[0].name);
    req.session.data = student[0];
    req.session.student = true;
    res.redirect("/home");
  } else {
    res.render("login", { message: "Invalid credentials" });
  }
});

app.get("/home", (req, res) => {
  res.render("home", { username: req.session.username,  student: req.session.student, info: req.session.data });
});
app.get("/schedule", (req, res) => {
  res.render("schedule", { username: req.session.username });
});
app.get("/students-info", (req, res) => {
    res.render("students-info", { username: req.session.username, student: req.session.student, info: req.session.data });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
function capitalizeWords(str) {
  // Split the string into an array of words
  const words = str.split(' ');

  // Iterate through each word and capitalize the first letter
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(' ');
}