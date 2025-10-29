export function displayWorkout(program, type, data) {
  const workoutDisplay = document.getElementById("workout-display");

  let currentIndex = 0;
  let currentSet = 0;
  const repsCycle = [10, 15, 20];
  let resting = false;

  function showExercise() {
    if (currentIndex >= data.length) {
      currentSet++;
      if (currentSet < repsCycle.length) {
        currentIndex = 0;
      } else {
        workoutDisplay.innerHTML = `
          <h2>${program} ${type} Complete!</h2>
          <button id="backToCalendar">Back to Calendar</button>
        `;
        document.getElementById("backToCalendar").onclick = () => loadCalendar(program);
        return;
      }
    }

    const ex = data[currentIndex];
    workoutDisplay.innerHTML = `
      <h2>${ex.name}</h2>
      <p>Set ${currentSet + 1} of ${ex.sets}</p>
      <p>Reps: ${repsCycle[currentSet]}</p>
      <p>Rest: ${ex.rest_interval} seconds</p>
      <div style="margin-top:2em;">
        <button id="back-btn">⬅️ Back</button>
        <button id="next-btn">Next ➡️</button>
      </div>
    `;

    document.getElementById("back-btn").onclick = () => {
      if (currentIndex > 0) currentIndex--;
      showExercise();
    };

    document.getElementById("next-btn").onclick = () => startRest(ex.rest_interval);
  }

  function startRest(seconds) {
    if (resting) return;
    resting = true;
    let time = seconds;

    const timer = setInterval(() => {
      workoutDisplay.innerHTML = `<h2>Rest for ${time}s...</h2>`;
      time--;

      if (time < 0) {
        clearInterval(timer);
        resting = false;
        currentIndex++;
        showExercise();
      }
    }, 1000);
  }

  showExercise();
}

