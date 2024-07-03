$(document).ready(function () {

    function getQueryParams() {
        var params = {};
        window.location.search.substring(1).split("&").forEach(function(pair) {
            var keyValue = pair.split("=");
            params[keyValue[0]] = keyValue[1];
        });
        console.log(params);
        console.log(params.section);
        return params;
    }

    var queryParams = getQueryParams();
    if (queryParams.section) {
        $.getJSON(queryParams.section+".json", function(data) {
            data.forEach(function(student) {
                var studentDiv = `
                    <div class="${student['roll-number']} student A">
                        <p class="att">A</p>
                        <p>${student['roll-number']}</p>
                        <p>${student.name}</p>
                    </div>
                `;
                $(".table-data").append(studentDiv);
            });
        });
        $("#button-container").hide();
    }
    $(".A .att").text("A");
    $(".P .att").text("P");
    $(".table-data").on("click", ".student", function(event) {
        $(event.currentTarget).toggleClass("A P");
        $(this).find(".att").text($(event.currentTarget).hasClass("A") ? "A" : "P");
    });
    $("#select").click(function () {
        $(".A").removeClass("A");
        $(".student").addClass("P");
        $(".student").find(".att").text($(".student").attr("class").slice(-1));

    });
    $("#unselect").click(function () {
        $(".P").removeClass("P");
        $(".student").addClass("A");
        $(".student").find(".att").text($(".student").attr("class").slice(-1));
    });

    $("#copy-button").click(function () {
      var selectedRollNumbers = [];
      $(".P").each(function () {
        var classtest = $(this).attr("class").split(" ")[0].slice(-2);
        selectedRollNumbers.push(classtest);
      });
      console.log(selectedRollNumbers);
      var unselectedRollNumbers = [];
      $(".A").each(function () {
        var classtest = $(this).attr("class").split(" ")[0].slice(-2);
        unselectedRollNumbers.push(classtest);
          });
      console.log(unselectedRollNumbers);
  
      var date = new Date();
      function getDaySuffix(day) {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }
      function formatDate(date) {
        var day = date.getDate();
        var month = date.toLocaleString("en-GB", { month: "long" }); // Get month name in English
        var year = date.getFullYear();
        var formattedDate = `${day}${getDaySuffix(day)} ${month} ${year}`;
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        
        hours = hours % 12;
        if (hours === 0) hours = 12;
        var formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
        var morningOrAfternoon = (hours > 12 || (hours === 12 && minutes >= 40)) ? "Morning" : "Afternoon";
        return { formattedDate, formattedTime, morningOrAfternoon };
    }
  
      var { formattedDate, formattedTime, morningOrAfternoon } = formatDate(date);
  
      navigator.clipboard
        .writeText(
          `${getQueryParams().section} Attendance ${formattedDate} ${morningOrAfternoon} ${formattedTime} \nPresent ${
            selectedRollNumbers.length
          }: \n${selectedRollNumbers.join(", ")}.\n\nAbsent ${
            unselectedRollNumbers.length
          }:\n${unselectedRollNumbers.join(", ")}.`
        )
        .then(function () {
          alert("Copied roll numbers to clipboard!");
        })
        .catch(function (err) {
          console.error("Failed to copy: ", err);
        });
    });
  });
  