$(document).ready(function () {
  var currentUrl = window.location.href;
  let attendance = "attendance.json";
  if (currentUrl.endsWith('?Year=2023&Month=11')) {
    attendance = "attendance-CSM-11-2023.json";
  }
  else if(currentUrl.endsWith('?Year=2023&Month=12')) {
    attendance = "attendance-CSM-12-2023.json";
  }
  // Fetch data from CSM-info.json and attendance.json
  $.getJSON("CSM-info.json", function (students) {
    $.getJSON(attendance, function (attendanceData) {
      $.each(students, function (_, student) {
        $("#attendanceTable tbody").append(
          '<tr class="student" id="student_' +
            student["roll-number"] +
            '">' +
            "<td>" +
            student["roll-number"] +
            "</td>" +
            "<td class='name'>" +
            student["name"] +
            "</td>" +
            "</tr>"
        );
      });
      $.each(attendanceData, function (_, attendance) {
        if (attendance["college"] == "Working") {
            $("#attendanceTable thead tr").append(
              "<th>" + attendance["date"] + "</th>"
            );
            $.each(students, function (_, student) {
                if (attendance["student"].includes(student['roll-number'])) {
                    $("#student_"+student['roll-number']).append(
                        "<th>" + "P" + "</th>"
                      );
                } else {
                    $("#student_"+student['roll-number']).append(
                        "<th>" + "A" + "</th>"
                      );
                }
              });

        }
      });
      $('thead tr').prepend('<th>'+"%"+'</th>');
      $('tr.student').each(function() {
        const total_days = $(this).find('th').length;
        const present_days = $(this).find('th:contains("P")').length;
        const attendancePercentage = (present_days / total_days * 100).toFixed(1);
    
        // Add the attendance percentage as a new column
        $(this).prepend('<td>' + attendancePercentage + '</td>');
    
        // Check if attendance percentage is less than 60, and add "low-attd" class
        if (parseFloat(attendancePercentage) < 60) {
            $(this).addClass('low-attd');
        }
    });
    });
  });

});
