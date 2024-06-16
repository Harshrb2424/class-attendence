$(document).ready(function () {
  // Hide the .loading element
  function capitalizeWords(str) {
    // Split the string into an array of words
    const words = str.split(' ');
  
    // Iterate through each word and capitalize the first letter
    const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    // Join the capitalized words back into a single string
    return capitalizedWords.join(' ');
  }
  function updateSVGs() {
    var svgInactive = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.92898 2.92893C6.83419 -0.976277 13.1659 -0.976312 17.0711 2.92893C20.9763 6.83414 20.9763 13.1659 17.0711 17.0711C13.1659 20.9763 6.83419 20.9763 2.92898 17.0711C-0.976267 13.1658 -0.976267 6.83418 2.92898 2.92893ZM6.00006 8.99993C5.44778 8.99994 5.00007 9.44765 5.00006 9.99994C5.00007 10.5097 5.38155 10.9304 5.87462 10.9921L6.00006 10.9999L8.99998 10.9999L9.00001 14C8.99999 14.5523 9.44773 15 10 15C10.5098 15 10.9305 14.6185 10.9922 14.1254L11 14L11 10.9999H14.0001C14.5523 10.9999 15.0001 10.5522 15.0001 9.99993C15.0001 9.49016 14.6186 9.06944 14.1255 9.00773L14.0001 8.99994H11L11 5.99998C11 5.44772 10.5522 5 9.99998 4.99998C9.49019 4.99996 9.06947 5.38147 9.00778 5.87454L8.99999 5.99997L8.99998 8.99994L6.00006 8.99993Z" fill="#787486"/>
        </svg>`;
    
    var svgActive = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM13.5354 6.38136L8.5856 11.3311L6.46431 9.2098C6.07379 8.8193 5.44063 8.8193 5.0501 9.2098C4.65958 9.6003 4.65958 10.2335 5.0501 10.624L7.80782 13.3817C8.2374 13.8113 8.9339 13.8113 9.3635 13.3817L14.9496 7.79557C15.3401 7.40505 15.3401 6.77188 14.9496 6.38136C14.5591 5.99083 13.9259 5.99083 13.5354 6.38136Z" fill="#68B266"/>
        </svg>`;
    
    $('.svg-inactive').html(svgInactive);
    $('.svg-active').html(svgActive);
}

  function toggleClassState() {
    $(this).toggleClass("active inactive");
    // $(this).closest("p").toggleClass("svg-active svg-inactive");
    const pElement = $(this).find('p.svg-active, p.svg-inactive');
        pElement.toggleClass('svg-active svg-inactive');

        updateSVGs();
    const className = $(this).attr("class").split(" ")[0];
    const infoDiv = $(`.info.${className}`);

    if ($(this).hasClass("inactive")) {
      // infoDiv.slideUp();
      infoDiv.animate(
        {
          opacity: 0,
        },
        {
          duration: 100,
          complete: function () {
            $(this).slideUp();
          },
        }
      );
    } else {
      // infoDiv.slideDown();
      infoDiv.animate(
        {
          opacity: 1,
        },
        {
          duration: 100,
          complete: function () {
            $(this).slideDown();
          },
        }
      );
    }
  }

  // Attach click event to class divs
  $(".classes .class").click(toggleClassState);

  // Select all elements with the class 'active' within the 'classes' container

  // Fetch the JSON data
  $.getJSON("../data/students-info-csm-b.json", function (data) {
    $(".loading").hide();

    // ? table creation
    data.forEach(function (student, index) {
      // Create the HTML structure
      let sumCGPA = (parseFloat(student["CGPA11"]) + parseFloat(student["CGPA12"]) + parseFloat(student["CGPA21"]))/3;
      var studentInfo = `
                <div class="info ${student["section"]}">
                    <p>${index + 1}.</p>
                    <p>${student["roll-number"]}</p>
                    <p>${capitalizeWords(student["name"])}</p>
                    <p style="font-weight: bold;">${sumCGPA.toFixed(2)}</p>
                    <p>${student["CGPA11"]}</p>
                    <p>${student["CGPA12"]}</p>
                    <p>${student["CGPA21"]}</p>
                </div>
            `;
      $(".data").append(studentInfo);
    });
  });
});
