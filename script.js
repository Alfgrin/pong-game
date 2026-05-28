// Game variables
const gameBoard = document.querySelector('.game-board');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 15;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const MAX_BALL_SPEED = 8;

// Game state
let gameRunning = false;
let playerScore = 0;
let computerScore = 0;

// Paddle positions
let leftPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball properties
let ballX = GAME_WIDTH / 2;
let ballY = GAME_HEIGHT / 2;
let ballVelX = BALL_SPEED;
let ballVelY = BALL_SPEED;

// Input handling
let keys = {};
let mouseY = GAME_HEIGHT / 2;

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

gameBoard.addEventListener('mousemove', (e) => {
    const rect = gameBoard.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

startBtn.addEventListener('click', toggleGame);
resetBtn.addEventListener('click', resetGame);

// Initialize paddle positions
function updatePaddlePositions() {
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Initialize ball position
function updateBallPosition() {
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Move paddles
function movePaddles() {
    // Left paddle - player control (mouse and keyboard)
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        leftPaddleY = Math.max(0, leftPaddleY - PADDLE_SPEED);
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        leftPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, leftPaddleY + PADDLE_SPEED);
    }
    
    // Mouse control for left paddle
    const paddleCenter = leftPaddleY + PADDLE_HEIGHT / 2;
    const diff = mouseY - paddleCenter;
    if (Math.abs(diff) > 10) {
        leftPaddleY += diff * 0.08;
        leftPaddleY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, leftPaddleY));
    }
    
    // Right paddle - AI control
    const rightPaddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    const ballDiff = ballY - rightPaddleCenter;
    
    // AI difficulty: follows ball with slight delay/imperfection
    if (ballVelX > 0 && ballX > GAME_WIDTH / 2) {
        if (ballDiff > 15) {
            rightPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, rightPaddleY + PADDLE_SPEED * 0.9);
        } else if (ballDiff < -15) {
            rightPaddleY = Math.max(0, rightPaddleY - PADDLE_SPEED * 0.9);
        }
    }
    
    updatePaddlePositions();
}

// Move ball
function moveBall() {
    ballX += ballVelX;
    ballY += ballVelY;
    
    // Wall collisions (top and bottom)
    if (ballY <= 0 || ballY + BALL_SIZE >= GAME_HEIGHT) {
        ballVelY = -ballVelY;
        ballY = Math.max(0, Math.min(GAME_HEIGHT - BALL_SIZE, ballY));
    }
    
    updateBallPosition();
}

// Paddle collision detection
function checkPaddleCollision() {
    // Left paddle collision
    if (
        ballX <= leftPaddle.offsetLeft + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= leftPaddleY &&
        ballY <= leftPaddleY + PADDLE_HEIGHT &&
        ballVelX < 0
    ) {
        ballVelX = -ballVelX;
        ballX = leftPaddle.offsetLeft + PADDLE_WIDTH;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ballY - leftPaddleY) / PADDLE_HEIGHT - 0.5;
        ballVelY += hitPos * 4;
        
        // Speed up ball slightly
        const speed = Math.sqrt(ballVelX ** 2 + ballVelY ** 2);
        if (speed < MAX_BALL_SPEED) {
            ballVelX *= 1.02;
            ballVelY *= 1.02;
        }
    }
    
    // Right paddle collision
    if (
        ballX + BALL_SIZE >= rightPaddle.offsetLeft &&
        ballY + BALL_SIZE >= rightPaddleY &&
        ballY <= rightPaddleY + PADDLE_HEIGHT &&
        ballVelX > 0
    ) {
        ballVelX = -ballVelX;
        ballX = rightPaddle.offsetLeft - BALL_SIZE;
        
        // Add spin based on where ball hits paddle
        const hitPos = (ballY - rightPaddleY) / PADDLE_HEIGHT - 0.5;
        ballVelY += hitPos * 4;
        
        // Speed up ball slightly
        const speed = Math.sqrt(ballVelX ** 2 + ballVelY ** 2);
        if (speed < MAX_BALL_SPEED) {
            ballVelX *= 1.02;
            ballVelY *= 1.02;
        }
    }
}

// Check for score
function checkScore() {
    if (ballX < 0) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        resetBall();
    } else if (ballX > GAME_WIDTH) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
    updateBallPosition();
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        movePaddles();
        moveBall();
        checkPaddleCollision();
        checkScore();
    }
    requestAnimationFrame(gameLoop);
}

// Toggle game state
function toggleGame() {
    gameRunning = !gameRunning;
    startBtn.textContent = gameRunning ? 'Pause Game' : 'Resume Game';
    
    if (gameRunning) {
        resetBall();
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    startBtn.textContent = 'Start Game';
    
    // Reset positions
    leftPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    rightPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    updatePaddlePositions();
    
    resetBall();
}

// Initialize game
function init() {
    resetBall();
    updatePaddlePositions();
    updateBallPosition();
    gameLoop();
}

// Start the game
init();