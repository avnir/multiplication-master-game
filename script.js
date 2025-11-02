// Game State
let currentLevel = 'easy';
let score = 0;
let streak = 0;
let currentQuestion = {};
let totalQuestions = 0;
let correctAnswers = 0;
let gameTimer = null;
let elapsedTime = 0;

// Level configurations
const levels = {
    easy: { min: 1, max: 5, name: 'Easy' },
    medium: { min: 1, max: 10, name: 'Medium' },
    hard: { min: 1, max: 12, name: 'Hard' },
    expert: { min: 1, max: 15, name: 'Expert' }
};

// DOM Elements
const levelScreen = document.getElementById('level-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const levelButtons = document.querySelectorAll('.level-btn');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const quitBtn = document.getElementById('quit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const changeLevelBtn = document.getElementById('change-level-btn');
const feedback = document.getElementById('feedback');

// Event Listeners
levelButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentLevel = e.currentTarget.dataset.level;
        startGame();
    });
});

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

quitBtn.addEventListener('click', () => {
    stopGame();
    showResults();
});

playAgainBtn.addEventListener('click', () => {
    startGame();
});

changeLevelBtn.addEventListener('click', () => {
    showScreen('level-screen');
    resetGame();
});

// Game Functions
function startGame() {
    resetGame();
    showScreen('game-screen');
    startTimer();
    generateQuestion();
    answerInput.focus();
}

function resetGame() {
    score = 0;
    streak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    elapsedTime = 0;
    updateStats();
    clearFeedback();
}

function stopGame() {
    stopTimer();
}

function startTimer() {
    gameTimer = setInterval(() => {
        elapsedTime++;
        document.getElementById('timer').textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function generateQuestion() {
    const level = levels[currentLevel];
    const num1 = Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
    const num2 = Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
    
    currentQuestion = {
        num1: num1,
        num2: num2,
        answer: num1 * num2
    };
    
    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
    answerInput.value = '';
    clearFeedback();
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        showFeedback('Please enter a number!', 'incorrect');
        return;
    }
    
    totalQuestions++;
    
    if (userAnswer === currentQuestion.answer) {
        correctAnswers++;
        streak++;
        score += 10 + (streak * 2); // Bonus points for streak
        showFeedback(`🎉 Correct! +${10 + (streak * 2)} points`, 'correct');
        
        // Generate new question after a short delay
        setTimeout(() => {
            generateQuestion();
            answerInput.focus();
        }, 1000);
    } else {
        streak = 0;
        showFeedback(`❌ Wrong! The answer is ${currentQuestion.answer}`, 'incorrect');
        
        // Generate new question after showing the correct answer
        setTimeout(() => {
            generateQuestion();
            answerInput.focus();
        }, 2000);
    }
    
    updateStats();
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function clearFeedback() {
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
}

function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function showResults() {
    const accuracy = totalQuestions > 0 
        ? Math.round((correctAnswers / totalQuestions) * 100) 
        : 0;
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('time-played').textContent = formatTime(elapsedTime);
    
    showScreen('results-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Celebration messages based on performance
function getCelebrationMessage(accuracy) {
    if (accuracy >= 90) return '🏆 Outstanding! You\'re a multiplication master!';
    if (accuracy >= 75) return '⭐ Great job! Keep up the good work!';
    if (accuracy >= 50) return '👍 Good effort! Practice makes perfect!';
    return '💪 Keep practicing! You\'ll get better!';
}

// Initialize
showScreen('level-screen');
