const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const users = {
  user1: 'password1',
  user2: 'password2'
};

app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/home');
  } else {
    res.render('login', { message: 'Invalid credentials' });
  }
});

app.get('/home', (req, res) => {
    res.render('home', { username: req.session.username });
});
app.get('/schedule', (req, res) => {
  res.render('schedule', { username: req.session.username });
});
app.get('/students-info', (req, res) => {
  res.render('students-info', { username: req.session.username });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home');
    }
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
