const workoutDisplay = document.getElementById("workout-display");
const buttons = {
  Conditioning: document.getElementById("Conditioning"),
  StrengthTraining: document.getElementById("StrengthTraining"),
  TotalBodyShred: document.getElementById("TotalBodyShred"),
};

let currentWorkout = [];
let currentIndex = 0;
let currentSet = 0;
let currentReps = [10, 15, 20]; // cycles 3 times
let isResting = false;

function loadWorkout(type) {
  // You can modify this later to dynamically select WorkoutA/B/C/D
  fetch(`workouts/${type}/WorkoutA.json`)
    .then(response => response.json())
    .then(data => {
      currentWorkout = data;
      currentIndex = 0;
      currentSet = 0;
      displayWorkout();
    })
    .catch(err => {
      workoutDisplay.innerHTML = `<p style="color:red;">Error loading ${type} workout.</p>`;
      console.error(err);
    });
}

function displayWorkout() {
  if (currentIndex >= currentWorkout.length) {
    currentSet++;
    if (currentSet < currentReps.length) {
      currentIndex = 0; // restart workout
    } else {
      workoutDisplay.innerHTML = "<h2>Workout Complete!</h2>";
      return;
    }
  }

  const exercise = currentWorkout[currentIndex];
  workoutDisplay.innerHTML = `
    <h2>${exercise.name}</h2>
    <p>Sets: ${exercise.sets}</p>
    <p>Reps: ${currentReps[currentSet]}</p>
    <p>Rest Interval: ${exercise.rest_interval} seconds</p>

    <div style="margin-top:2em;">
      <button id="back-btn">⬅️ Back</button>
      <button id="next-btn">Next ➡️</button>
    </div>
  `;

  document.getElementById("back-btn").onclick = () => {
    if (currentIndex > 0) currentIndex--;
    displayWorkout();
  };

  document.getElementById("next-btn").onclick = () => handleNext(exercise.rest_interval);
}

function handleNext(restTime) {
  if (isResting) return;
  isResting = true;

  let timer = restTime;
  const interval = setInterval(() => {
    workoutDisplay.innerHTML = `<h2>Rest for ${timer} seconds...</h2>`;
    timer--;

    if (timer < 0) {
      clearInterval(interval);
      isResting = false;
      currentIndex++;
      displayWorkout();
    }
  }, 1000);
}

buttons.Conditioning.addEventListener("click", () => loadWorkout("Conditioning"));
buttons.StrengthTraining.addEventListener("click", () => loadWorkout("StrenghtTraining"));
buttons.TotalBodyShred.addEventListener("click", () => loadWorkout("TotalBodyShred"));

