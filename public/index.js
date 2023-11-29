$(document).ready(function () {
  // Fetch data from CSM-info.json and attendance.json
  $.getJSON("CSM-info.json", function (students) {
    $.getJSON("attendance.json", function (attendanceData) {



      $.each(students, function (_, student) {
        $("#attendanceTable tbody").append(
          '<tr id="' +
            student["roll-number"] +
            '">' +
            "<td>" +
            student["roll-number"] +
            "</td>" +
            "<td>" +
            student["name"] +
            "</td>" +
            "</tr>"
        );


      });

      $.each(attendanceData, function (_, attendance) {
        console.log(attendance);

        
        if (attendance["college"] == "Working") {
            $("#attendanceTable thead tr").append(
              "<th>" + attendance["date"] + "</th>"
            );
            $.each(students, function (_, student) {
                console.log(attendance["student"]);
                console.log(student);

                if (attendance["student"].includes(student['roll-number'])) {
                    console.log(`${student['roll-number']} is in the array.`);
                    $("#"+student['roll-number']).append(
                        "<th>" + "P" + "</th>"
                      );
                } else {
                    console.log(`${student['roll-number']} is not in the array.`);
                    $("#"+student['roll-number']).append(
                        "<th>" + "A" + "</th>"
                      );
                }

              });
        }

      });
      // Iterate through each attendance record
      // $.each(attendanceData, function (index, record) {
      //     // Check if the record has student attendance data
      //     if (record.student) {
      //         // Iterate through each student in the record
      //         $.each(record.student, function (_, rollNumber) {
      //             // Find the student information using the roll number
      //             var studentInfo = students.find(function (student) {
      //                 return student['roll-number'] === rollNumber;
      //             });

      //             // Add a row to the table with attendance details
      //             if (studentInfo) {
      //                 $('#attendanceTable tbody').append(
      //                     '<tr>' +
      //                     '<td>' + record.date + '</td>' +
      //                     '<td>' + record.college + '</td>' +
      //                     '<td>' + rollNumber + '</td>' +
      //                     '<td>' + studentInfo.name + '</td>' +
      //                     '</tr>'
      //                 );
      //             }
      //         });
      //     } else {
      //         // Add a row for holiday
      //         $('#attendanceTable tbody').append(
      //             '<tr>' +
      //             '<td>' + record.date + '</td>' +
      //             '<td>' + record.college + '</td>' +
      //             '<td colspan="2">Holiday</td>' +
      //             '</tr>'
      //         );
      //     }
      // });
    });
  });


});
