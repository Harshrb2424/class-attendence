document.addEventListener("DOMContentLoaded", () => {
  fetch("schedule.json")
    .then((response) => response.json())
    .then((jsonData) => {
      initializeSchedule(jsonData);
    })
    .catch((error) => console.error("Error loading schedule:", error));
});

function initializeSchedule(jsonData) {
  
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let activeUnitIndex = 0;
  
    // Helper Functions
    const getTimeInMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
  
    const getCurrentClass = (classesToday, nowMinutes) => {
      for (const cls of classesToday) {
        const [startTime, endTime] = cls.timing.split("-").map(getTimeInMinutes);
        if (nowMinutes >= startTime && nowMinutes < endTime) return cls;
      }
      return null;
    };
  
    const getNextClass = (classesToday, nowMinutes) => {
      for (const cls of classesToday) {
        const [startTime] = cls.timing.split("-").map(getTimeInMinutes);
        if (nowMinutes < startTime) return cls;
      }
      return null;
    };
  
    const updateBackground = (today) => {
      const body = document.body;
      const wallpaperPath = `./images/${today.toLowerCase()}.jpg`;
      body.style.backgroundImage = `url('${wallpaperPath}')`;
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundRepeat = "no-repeat";
    };
  
    const renderTopics = (topicsContainer, topics) => {
      topicsContainer.innerHTML = "";
      const topicDiv = document.createElement("div");
      topicDiv.textContent = topics.join(", ");
      topicsContainer.appendChild(topicDiv);
    };
  
    const updateUI = () => {
      const today = daysOfWeek[new Date().getDay()];
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const nowMinutes = currentHour * 60 + currentMinute;
  
      const classesToday = jsonData.schedule[today] || [];
      const currentClass = getCurrentClass(classesToday, nowMinutes);
      const nextClass = getNextClass(classesToday, nowMinutes);
  
      // Update Greeting
      const greetingElement = document.getElementById("greeting");
      greetingElement.textContent =
        currentHour < 12
          ? "Good Morning!"
          : currentHour < 16
          ? "Good Afternoon!"
          : "End of College Day";
  
      // Update Current Class Info
      if (currentClass) {
        document.getElementById("subject-name").textContent = currentClass.subject;
        document.getElementById("subject-code").textContent = `${currentClass.code}`;
        document.getElementById("faculty").textContent = `${currentClass.faculty}`;
        document.getElementById("timing").textContent = `${currentClass.timing}`;
  
        const activeUnit = currentClass.units[activeUnitIndex];
        const topics = currentClass.topics[activeUnitIndex];
        document.getElementById("active-unit").textContent = `${activeUnit}`;
        renderTopics(document.getElementById("topics-container"), topics);
    } else {
        document.getElementById("subject-name").textContent = "No class at the moment.";
        document.getElementById("subject-code").textContent = "";
        document.getElementById("faculty").textContent = "";
        document.getElementById("timing").textContent = "";
        document.getElementById("active-unit").textContent = `III CSM B`;

        renderTopics(document.getElementById("topics-container"), [[""]]);
      }
  
      // Update Next Class Info
      if (nextClass) {
        document.getElementById("next-subject-code").textContent = `${nextClass.code}`;
        document.getElementById("next-timing").textContent = `${nextClass.timing}`;
      } else {
        document.getElementById("next-subject-code").textContent = "--";
        document.getElementById("next-timing").textContent = "";
      }
  
      // Update Background
      updateBackground(today);
    };
  
    // Navigation Buttons
    document.getElementById("prev-unit").addEventListener("click", () => {
      activeUnitIndex = Math.max(activeUnitIndex - 1, 0);
      updateUI();
    });
  
    document.getElementById("next-unit").addEventListener("click", () => {
      const today = daysOfWeek[new Date().getDay()];
      const classesToday = jsonData.schedule[today] || [];
      const currentClass = getCurrentClass(
        classesToday,
        new Date().getHours() * 60 + new Date().getMinutes()
      );
      if (currentClass) {
        activeUnitIndex = Math.min(activeUnitIndex + 1, currentClass.units.length - 1);
        updateUI();
      }
    });
  
    // Initial Update
    updateUI();
  
    // Refresh the UI every 10 seconds
    setInterval(updateUI, 10000);
  };