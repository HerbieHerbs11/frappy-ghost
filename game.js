const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird properties
const bird = {
    x: 50,
    y: 200,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
};

// Pipe properties
const pipes = [];
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

let gameOver = false;
let score = 0;

// Jump when spacebar is pressed
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        bird.velocity = bird.jump;
    }
});

// Create new pipes
function createPipe() {
    const gapPosition = Math.random() * (canvas.height - PIPE_GAP);
    pipes.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + PIPE_GAP
    });
}

// Game loop
function update() {
    if (gameOver) return;

    // Update bird position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        // Check collision
        if (bird.x + bird.size > pipes[i].x && 
            bird.x < pipes[i].x + PIPE_WIDTH &&
            (bird.y < pipes[i].topHeight || 
             bird.y + bird.size > pipes[i].bottomY)) {
            gameOver = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    // Check if bird hits boundaries
    if (bird.y < 0 || bird.y + bird.size > canvas.height) {
        gameOver = true;
    }

    // Draw everything
    draw();

    requestAnimationFrame(update);
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width/2 - 100, canvas.height/2);
    }
}

// Start the game
update();
