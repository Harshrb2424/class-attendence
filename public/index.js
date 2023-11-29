$(document).ready(function () {
  // Fetch data from CSM-info.json and attendance.json
  $.getJSON("CSM-info.json", function (students) {
    $.getJSON("attendance.json", function (attendanceData) {
      $.each(students, function (_, student) {
        $("#attendanceTable tbody").append(
          '<tr class="student" id="' +
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
        if (attendance["college"] == "Working") {
            $("#attendanceTable thead tr").append(
              "<th>" + attendance["date"] + "</th>"
            );
            $.each(students, function (_, student) {
                if (attendance["student"].includes(student['roll-number'])) {
                    $("#"+student['roll-number']).append(
                        "<th>" + "P" + "</th>"
                      );
                } else {
                    $("#"+student['roll-number']).append(
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
        $(this).prepend('<td>'+(present_days/total_days*100)+'</td>');
    });
    });
  });

});
