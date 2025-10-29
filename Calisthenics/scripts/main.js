// main.js
(() => {
  const display = document.getElementById("workout-display");
  const buttons = {
    Conditioning: document.getElementById("Conditioning"),
    StrengthTraining: document.getElementById("StrengthTraining"),
    TotalBodyShred: document.getElementById("TotalBodyShred"),
  };

  // attach the handlers
  buttons.Conditioning.addEventListener("click", () => loadCalendar("Conditioning"));
  buttons.StrengthTraining.addEventListener("click", () => loadCalendar("StrengthTraining"));
  buttons.TotalBodyShred.addEventListener("click", () => loadCalendar("TotalBodyShred"));

  // load calendar.json for the chosen program
  function loadCalendar(program) {
    display.innerHTML = `<p>Loading ${program} calendar…</p>`;
    fetch(`../workouts/${program}/calendar.json`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch calendar.json: " + res.status);
        return res.json();
      })
      .then(json => renderCalendar(program, json))
      .catch(err => {
        console.error(err);
        display.innerHTML = `<p style="color:red">Error loading calendar: ${err.message}</p>
          <p>Check devtools console for details and ensure files are served over HTTP (see README below).</p>`;
      });
  }

  // render the calendar table
  function renderCalendar(program, data) {
    let html = `<h2>${program} — Calendar</h2>`;
    html += `<table><thead><tr><th>Week</th><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr></thead><tbody>`;
    (data.weeks || []).forEach((week, i) => {
      html += `<tr><td>${week.name || "Week " + (i+1)}</td>`;
      (week.days || []).forEach(day => {
        if (!day || day.toLowerCase() === "rest" || day === "Rest") {
          html += `<td style="color:gray">Rest</td>`;
        } else {
          html += `<td><button class="day-btn" data-program="${program}" data-workout="${day}">${day}</button></td>`;
        }
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    html += `<p style="margin-top:.75rem">Click a workout cell (A/B/C/D) to start that workout.</p>`;

    display.innerHTML = html;

    // attach click listeners to workout cells
    display.querySelectorAll(".day-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const program = e.currentTarget.dataset.program;
        const workout = e.currentTarget.dataset.workout;
        loadWorkout(program, workout);
      });
    });
  }

  // load the workout JSON and launch viewer
  function loadWorkout(program, workoutLetter) {
    display.innerHTML = `<p>Loading Workout ${workoutLetter}…</p>`;
    fetch(`/workouts/${program}/Workout${workoutLetter}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch workout: " + res.status);
        return res.json();
      })
      .then(json => launchViewer(program, workoutLetter, json))
      .catch(err => {
        console.error(err);
        display.innerHTML = `<p style="color:red">Error loading Workout ${workoutLetter}: ${err.message}</p>`;
      });
  }

  // viewer: shows each exercise, next/back, rest timer, cycles reps 10->15->20 three times
  function launchViewer(program, letter, exercises) {
    let idx = 0;
    let repStage = 0; // 0 => 10, 1 => 15, 2 => 20
    const repsCycle = [10,15,20];
    let resting = false;
    let restTimerId = null;

    function renderExercise() {
      if (idx >= exercises.length) {
        // finished one pass, increment repStage or finish
        repStage++;
        if (repStage >= repsCycle.length) {
          display.innerHTML = `<h2>${program} ${letter} — Complete!</h2><button id="backToCal">Back to calendar</button>`;
          document.getElementById("backToCal").addEventListener("click", () => loadCalendar(program));
          return;
        } else {
          idx = 0; // restart exercises for next repStage
        }
      }

      const ex = exercises[idx];
      display.innerHTML = `
        <h2>${ex.name}</h2>
        <!-- placeholder for image -->
        <div style="height:140px;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border-radius:8px;margin:0.75rem auto;width:80%;">Image / ${ex.name}</div>
        <p>Set: ${Math.min(ex.sets || 1, 999)}</p>
        <p>Reps: ${repsCycle[repStage]}</p>
        <p>Rest interval: ${ex.rest_interval}s</p>

        <div class="controls">
          <button id="backBtn">◀︎ Back</button>
          <div style="flex:1"></div>
          <button id="nextBtn">Next ▶︎</button>
        </div>

        <div id="status" style="margin-top:1rem"></div>
      `;

      document.getElementById("backBtn").onclick = () => {
        if (resting) return;
        if (idx > 0) idx--;
        renderExercise();
      };

      document.getElementById("nextBtn").onclick = () => {
        if (resting) return startRest(ex.rest_interval);
        // otherwise start rest
        startRest(ex.rest_interval);
      };
    }

    function startRest(seconds) {
      if (resting) return;
      resting = true;
      const status = document.getElementById("status");
      let t = seconds;
      status.textContent = `Rest: ${t}s`;
      restTimerId = setInterval(() => {
        t--;
        status.textContent = `Rest: ${t}s`;
        if (t <= 0) {
          clearInterval(restTimerId);
          resting = false;
          idx++;
          renderExercise();
        }
      }, 1000);
    }

    renderExercise();
  }

})();

