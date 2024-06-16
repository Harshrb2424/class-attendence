$(document).ready(function () {
    // Function to create HTML for class based on classInfo
    function getClassHtml(classInfo) {
      if (classInfo.subject === "LAB") {
        return `<div class="class ${(classInfo.classes == 2) ? 'class-2' : ''}">
                  <h5>${classInfo.subject}</h5>
                  <h6>${classInfo.info[0]} and ${classInfo.info[1]}</h6>
                  <h6>${classInfo.time}</h6>
                  <h6>${classInfo.location}</h6>
                </div>`;
      } else {
        return `<div class="class ${(classInfo.classes == 2) ? 'class-2' : ''}">
                  <h5>${classInfo.subject}</h5>
                  <h6>${classInfo.time}</h6>
                  <h6>${classInfo.location}</h6>
                </div>`;
      }
    }
    function formatDate(date) {
        var months = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
        var day = date.getDate();
        var month = months[date.getMonth()];
        var year = date.getFullYear();
        return day + " " + month + " " + year;
      }
    // Fetch JSON data and process
    $.getJSON("../data/time-table.json", function (timetable) {
      var today = new Date().getDay();
      var daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ];
      var todayName = daysOfWeek[today];
      $(".date").text(formatDate(new Date())+', '+todayName);
      var todayClasses = timetable[today-1]?.classes;
  
      var $todayClassesDiv = $(".classes");
      if (timetable[today] && timetable[today].classes && todayClasses.length > 0) {
        for (var j = 0; j < todayClasses.length; j++) {
          var classInfo = todayClasses[j];
          var classHtml = getClassHtml(classInfo);
          $todayClassesDiv.append(classHtml);
        }
      } else {
        $todayClassesDiv.append("<p>No classes scheduled for today.</p>");
        var tomorrowIndex = (today + 1) % 7;
        var tomorrowClasses = timetable[tomorrowIndex].classes;
  
        var $tomorrowScheduleDiv = $(".schedule");
        if (tomorrowClasses.length > 0) {
            $tomorrowScheduleDiv.append(`<h1>Tomorrow's Schedule</h1>`);
            $tomorrowScheduleDiv.append(`<h2 class="date">${formatDate(new Date(+new Date() + 86400000))}</h2><div class="classes classes-tomorrow"></div>`);
          for (var k = 0; k < tomorrowClasses.length; k++) {
            var tomorrowClassInfo = tomorrowClasses[k];
            var tomorrowClassHtml = getClassHtml(tomorrowClassInfo);
            $(".schedule .classes-tomorrow").append(tomorrowClassHtml);
          }
        } else {
          $tomorrowScheduleDiv.append("<p>No classes scheduled for tomorrow.</p>");
        }
      }
    });
  });