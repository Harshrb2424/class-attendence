$(document).ready(function () {
  $.getJSON("CSM-info.json", function (data) {
    data.forEach(function (item) {
      var row = `<tr>
                    <td><input type="checkbox" class="attendance-checkbox ${item["number"]}" disabled></td>
                    <td>${item["roll-number"]}</td>
                    <td>${item.name}</td>
                </tr>`;
      $("#attendance-table tbody").append(row);
    });
  });

  $("table").on("click", "tr", function (event) {
    var checkbox = $(this).find('input[type="checkbox"]');
    checkbox.prop("checked", !checkbox.prop("checked"));
    event.stopPropagation();
  });

  $("#select").click(function () {
    var checkboxes = $("input.attendance-checkbox");
    checkboxes.prop("checked", true);
  });
  $("#unselect").click(function () {
    var checkboxes = $("input.attendance-checkbox");
    checkboxes.prop("checked", false);
  });
  $("#copy-button").click(function () {
    var selectedRollNumbers = [];
    $(".attendance-checkbox:checked").each(function () {
      var classtest = $(this).closest("input").attr("class");
      selectedRollNumbers.push(classtest.split(" ")[1]);
      // var rollNumber = $(this).closest('tr').find('td:eq(1)').text();
      // selectedRollNumbers.push(rollNumber);
    });

    var unselectedRollNumbers = [];
    $(".attendance-checkbox:not(:checked)").each(function () {
      var classtest = $(this).closest("input").attr("class");
      unselectedRollNumbers.push(classtest.split(" ")[1]);
      // var rollNumber = $(this).closest('tr').find('td:eq(1)').text();
      // selectedRollNumbers.push(rollNumber);
    });

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
      var formattedTime = `${hours}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      return { formattedDate, formattedTime };
    }

    var { formattedDate, formattedTime } = formatDate(date);

    navigator.clipboard
      // .writeText("CSM B Attendance "+formattedDate+" "+formattedTime+" \nPresent:\n"+selectedRollNumbers.join(", ")+"\n\nAbsent:\n"+unselectedRollNumbers.join(", ")+".")
      .writeText(
        `CSM B Attendance ${formattedDate} ${formattedTime} \nPresent ${
          selectedRollNumbers.length
        }: \n${selectedRollNumbers.join(", ")} \n\nAbsent ${
          selectedRollNumbers.length
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
