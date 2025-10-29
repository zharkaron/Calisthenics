const workoutDisplay = document.getElementById("workout-display");

function loadCalendar(program) {
  fetch(`workouts/${program}/calendar.json`)
    .then(res => res.json())
    .then(data => renderCalendar(program, data))
    .catch(err => {
      workoutDisplay.innerHTML = `<p style="color:red;">Failed to load ${program} calendar.</p>`;
      console.error(err);
    });
}

function renderCalendar(program, data) {
  let html = `<h2>${program} Calendar</h2>`;

  html += `
    <table border="1" style="margin:auto; border-collapse: collapse; width: 90%; text-align:center;">
      <thead>
        <tr>
          <th>Week</th>
          <th>Sunday</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.weeks.forEach((week, i) => {
    html += `<tr><td>${week.name}</td>`;
    week.days.forEach(day => {
      if (day === "Rest") {
        html += `<td style="color:gray;">Rest</td>`;
      } else {
        html += `<td><button class="day-btn" data-workout="${day}" data-program="${program}">${day}</button></td>`;
      }
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;

  workoutDisplay.innerHTML = html;

  // Attach event listeners to each workout button
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const workoutType = e.target.getAttribute("data-workout");
      const programType = e.target.getAttribute("data-program");
      loadWorkout(programType, workoutType);
    });
  });
}

function loadWorkout(program, type) {
  fetch(`workouts/${program}/Workout${type}.json`)
    .then(res => res.json())
    .then(data => {
      import("./workoutViewer.js").then(module => {
        module.displayWorkout(program, type, data);
      });
    })
    .catch(err => {
      workoutDisplay.innerHTML = `<p style="color:red;">Error loading Workout ${type}</p>`;
      console.error(err);
    });
}
