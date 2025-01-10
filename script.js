let timeLeft;
let timerId = null;
let isWorkSession = true;
let lastTime = Date.now();

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
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update displays
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update page title
    document.title = `${timeString} - ${isWorkSession ? 'Work' : 'Break'}`;
}

function updateAnalogClock() {
    const minutesHand = document.querySelector('.minutes-hand');
    const secondsHand = document.querySelector('.seconds-hand');
    
    const totalSeconds = WORK_TIME - timeLeft;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Calculate rotation angles
    const minutesDegrees = ((minutes / (isWorkSession ? 25 : 5)) * 360) + ((seconds/60)*360/25);
    const secondsDegrees = (seconds / 60) * 360;
    
    minutesHand.style.transform = `rotate(${minutesDegrees}deg)`;
    secondsHand.style.transform = `rotate(${secondsDegrees}deg)`;
}

function startTimer() {
    if (timerId === null) {
        if (!timeLeft) {
            timeLeft = WORK_TIME;
        }
        lastTime = Date.now();
        timerId = setInterval(() => {
            // Calculate actual elapsed time
            const currentTime = Date.now();
            const deltaTime = Math.floor((currentTime - lastTime) / 1000);
            lastTime = currentTime;
            
            // Update timer by actual elapsed time
            timeLeft = Math.max(0, timeLeft - deltaTime);
            updateDisplay();
            updateAnalogClock();
            
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
    updateAnalogClock();
}

function toggleMode() {
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
    statusText.textContent = isWorkSession ? "Time to focus!" : "Take a break!";
    modeToggleButton.textContent = isWorkSession ? "Switch to Rest" : "Switch to Work";
    updateDisplay();
    updateAnalogClock();
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
updateAnalogClock(); 