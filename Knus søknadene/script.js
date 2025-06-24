const holes        = document.querySelectorAll('.hole');
const scoreBoard   = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn     = document.getElementById('start');
const scoreList    = document.getElementById('score-list');

let lastHole, score, timeUp, timeLeft, timerInterval;

const MAX_SCORES = 5;
const STORAGE_KEY = 'whac-a-form-highscores';

// Hent highscores fra localStorage
function getHighscores() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Lagre highscores
function saveHighscores(hs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hs));
}

// Vis highscores i <ol>
function displayHighscores() {
  const highscores = getHighscores();
  scoreList.innerHTML = '';
  highscores.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score} poeng`;
    scoreList.appendChild(li);
  });
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(600, 1500);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function updateTimer() {
  timeLeft--;
  if (timeLeft < 0) timeLeft = 0;
  timerDisplay.textContent = timeLeft;
}

function startGame() {
  score = 0;
  scoreBoard.textContent = score;
  timeUp = false;
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  peep();

  setTimeout(() => {
    timeUp = true;
    clearInterval(timerInterval);
    timerDisplay.textContent = '0';
    handleGameOver();
  }, 15000);
}

function acceptForm(e) {
  if (!e.currentTarget.classList.contains('up')) return;
  score++;
  this.classList.remove('up');
  scoreBoard.textContent = score;
}

function handleGameOver() {
  const highscores = getHighscores();
  const qualifies = 
    highscores.length < MAX_SCORES ||
    score > highscores[highscores.length - 1].score;

  if (qualifies) {
    const name = prompt(`Gratulerer! Du nådde ${score} poeng.\nSkriv inn navnet ditt:`);
    if (name) {
      highscores.push({ name: name.trim(), score });
      highscores.sort((a, b) => b.score - a.score);
      highscores.splice(MAX_SCORES);
      saveHighscores(highscores);
    }
  }
  displayHighscores();
}

// Initialiser hullene med .form-div og klikk­lyttere
holes.forEach(hole => {
  const form = document.createElement('div');
  form.classList.add('form');
  hole.appendChild(form);
  hole.addEventListener('click', acceptForm);
});

// Startknapp og vis lagrede highscores ved oppstart
startBtn.addEventListener('click', startGame);
displayHighscores();