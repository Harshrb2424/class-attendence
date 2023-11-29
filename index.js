$(document).ready(function () {
    // Fetch data from CSM-info.json and attendance.json
    $.getJSON('CSM-info.json', function (students) {
        $.getJSON('attendance.json', function (attendanceData) {
            // Iterate through each attendance record
            $.each(attendanceData, function (index, record) {
                // Check if the record has student attendance data
                if (record.student) {
                    // Iterate through each student in the record
                    $.each(record.student, function (_, rollNumber) {
                        // Find the student information using the roll number
                        var studentInfo = students.find(function (student) {
                            return student['roll-number'] === rollNumber;
                        });

                        // Add a row to the table with attendance details
                        if (studentInfo) {
                            $('#attendanceTable tbody').append(
                                '<tr>' +
                                '<td>' + record.date + '</td>' +
                                '<td>' + record.college + '</td>' +
                                '<td>' + rollNumber + '</td>' +
                                '<td>' + studentInfo.name + '</td>' +
                                '</tr>'
                            );
                        }
                    });
                } else {
                    // Add a row for holiday
                    $('#attendanceTable tbody').append(
                        '<tr>' +
                        '<td>' + record.date + '</td>' +
                        '<td>' + record.college + '</td>' +
                        '<td colspan="2">Holiday</td>' +
                        '</tr>'
                    );
                }
            });
        });
    });
});
