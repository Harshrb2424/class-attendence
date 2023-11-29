//? To Edit and Save Attendence
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const data = require('./CSM-info.json');
console.log(data);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load attendance data from the JSON file
let attendanceData = require('./attendance.json');

// Serve HTML page for managing attendance
app.get('/', (req, res) => {
    res.render('index', { students: data });
});

app.post('/add', (req,res) => {
    console.log(req.body);
    res.redirect('/');
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
