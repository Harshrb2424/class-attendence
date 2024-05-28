//? To Edit and Save Attendence
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const data = require('./public/CSM-info.json');
console.log(data);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());
// Load attendance data from the JSON file
let attendanceData = require('./public/attendance.json');
let monthlyAttendanceData = require('./public/attendance-CSM-11-2023.json');

// Serve HTML page for managing attendance
app.get('/', (req, res) => {
    res.render('index.ejs', { students: data });
});
app.get('/add', (req, res) => {
    res.render('add', { students: data });
});
const path = require('path');

app.get('/copy.html', (req, res) => {
    const filePath = path.join(__dirname, 'copy.html');
    res.sendFile(filePath);
});

app.post('/add', (req,res) => {
  console.log(req.body);
  const date = new Date(req.body.date);
  console.log(date.getMonth() + 1);
  console.log(date.getFullYear());
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthlyfile = `./public/attendance-CSM-${month}-${year}.json`;
  
  // Read the existing data from attendance.json
  const existingData = JSON.parse(fs.readFileSync('./public/attendance.json', 'utf-8'));

  // Add the new data from req.body to the existing data
  existingData.push(req.body);

  // Write the updated data back to attendance.json
  fs.writeFileSync('./public/attendance.json', JSON.stringify(existingData, null, 2));

  // Read or create monthly file
  let monthlyexistingData = [];
  if (fs.existsSync(monthlyfile)) {
      monthlyexistingData = JSON.parse(fs.readFileSync(monthlyfile, 'utf-8'));
  } else {
      fs.writeFileSync(monthlyfile, JSON.stringify(monthlyexistingData, null, 2));
  }

  monthlyexistingData.push(req.body);

  // Write the updated monthly data back to its file
  fs.writeFileSync(monthlyfile, JSON.stringify(monthlyexistingData, null, 2));

  res.redirect('/add');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
