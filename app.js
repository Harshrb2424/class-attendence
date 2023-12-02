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
    res.render('index', { students: data });
});
app.get('/add', (req, res) => {
    res.render('add', { students: data });
});

app.post('/add', (req,res) => {
    console.log(req.body);
    const date = new Date(req.body.date)
    console.log(date.getMonth() + 1);
    console.log(date.getFullYear());
    monthlyfile = `./public/attendance-CSM-${date.getMonth() + 1}-${date.getFullYear()}.json`;
    
    // Read the existing data from attendance.json
    const existingData = JSON.parse(fs.readFileSync('./public/attendance.json', 'utf-8'));
    const monthlyexistingData = JSON.parse(fs.readFileSync(monthlyfile, 'utf-8'));

    // Add the new data from req.body to the existing data
    existingData.push(req.body);
    monthlyexistingData.push(req.body);

    // Write the updated data back to attendance.json
    fs.writeFileSync('./public/attendance.json', JSON.stringify(existingData, null, 2));
    fs.writeFileSync(monthlyfile, JSON.stringify(monthlyexistingData, null, 2));

    res.redirect('/add');
})

// API endpoint to get the current attendance data
app.get('/api/attendance', (req, res) => {
  res.json(attendanceData);
});

// API endpoint to add or edit attendance
app.post('/api/attendance', (req, res) => {
  const { date, students } = req.body;

  // Find existing attendance data for the given date
  const existingAttendance = attendanceData.find(item => item.date === date);

  if (existingAttendance) {
    // Update existing attendance
    existingAttendance.students = students;
  } else {
    // Add new attendance entry
    attendanceData.push({ date, students });
  }

  // Save the updated attendance data to the JSON file
  fs.writeFileSync('./attendance.json', JSON.stringify(attendanceData, null, 2));

  res.json({ success: true, message: 'Attendance updated successfully' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
