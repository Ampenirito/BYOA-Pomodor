let timeLeft;
let timerId = null;
let isWorkSession = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const modeToggleButton = document.getElementById('mode-toggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId === null) {
        if (!timeLeft) {
            timeLeft = WORK_TIME;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkSession = !isWorkSession;
                timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
                statusText.textContent = isWorkSession ? "Time to focus!" : "Take a break!";
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkSession = true;
    timeLeft = WORK_TIME;
    statusText.textContent = "Time to focus!";
    updateDisplay();
}

function toggleMode() {
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
    statusText.textContent = isWorkSession ? "Time to focus!" : "Take a break!";
    modeToggleButton.textContent = isWorkSession ? "Switch to Rest" : "Switch to Work";
    updateDisplay();
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    toggleMode();
});

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(); 