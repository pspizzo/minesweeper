// Game configuration
const BOARD_SIZE = 9;
const MINE_COUNT = 10;

// Game state
let board = [];
let gameStarted = false;
let gameOver = false;
let timerInterval = null;
let secondsElapsed = 0;

// Initialize the game
const initGame = () => {
    board = createBoard();
    placeMines(board);
    calculateNeighborCounts(board);
    renderBoard();
    resetTimer();
    updateMineCounter();
};

// Create empty board
const createBoard = () => {
    const newBoard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        newBoard[row] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            newBoard[row][col] = {
                isMine: false,
                isRevealed: false,
                neighborMines: 0,
                mark: 'none',
                row,
                col
            };
        }
    }
    return newBoard;
};

// Place mines randomly on the board
const placeMines = (board) => {
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);

        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
};

// Calculate neighbor mine counts for all tiles
const calculateNeighborCounts = (board) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(board, row, col);
            }
        }
    }
};

// Count mines in neighboring tiles
const countNeighborMines = (board, row, col) => {
    let count = 0;
    const neighbors = getNeighbors(row, col);

    neighbors.forEach(([r, c]) => {
        if (board[r][c].isMine) {
            count++;
        }
    });

    return count;
};

// Get valid neighbor coordinates
const getNeighbors = (row, col) => {
    const neighbors = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            neighbors.push([newRow, newCol]);
        }
    });

    return neighbors;
};

// Render the board to the DOM
const renderBoard = () => {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 40px)`;
    gameBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 40px)`;

    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileElement = createTileElement(tile, rowIndex, colIndex);
            gameBoard.appendChild(tileElement);
        });
    });
};

// Create a tile element
const createTileElement = (tile, row, col) => {
    const tileElement = document.createElement('div');
    tileElement.className = 'tile';
    tileElement.dataset.row = row;
    tileElement.dataset.col = col;

    if (tile.isRevealed) {
        tileElement.classList.add('revealed');
        if (tile.isMine) {
            tileElement.textContent = '💣';
            tileElement.classList.add('mine');
        } else if (tile.neighborMines > 0) {
            tileElement.textContent = tile.neighborMines;
            tileElement.classList.add(`number-${tile.neighborMines}`);
        }
    } else {
        // Show marks on unrevealed tiles
        if (tile.mark === 'flag') {
            tileElement.textContent = '🚩';
            tileElement.classList.add('flagged');
        } else if (tile.mark === 'question') {
            tileElement.textContent = '❓';
            tileElement.classList.add('questioned');
        }
    }

    tileElement.addEventListener('click', () => handleTileClick(row, col));
    tileElement.addEventListener('contextmenu', (e) => handleTileRightClick(e, row, col));

    return tileElement;
};

// Reveal tile and expand if it has no neighbors
const revealTile = (row, col) => {
    const tile = board[row][col];

    // Skip if already revealed, is a mine, or is flagged
    if (tile.isRevealed || tile.isMine) {
        return;
    }

    tile.isRevealed = true;

    // If tile has no neighboring mines, expand to neighbors
    if (tile.neighborMines === 0) {
        const neighbors = getNeighbors(row, col);
        neighbors.forEach(([r, c]) => {
            revealTile(r, c);
        });
    }
};

// Handle tile click
const handleTileClick = (row, col) => {
    if (gameOver || board[row][col].isRevealed) {
        return;
    }

    // Don't reveal flagged tiles
    if (board[row][col].mark === 'flag') {
        return;
    }

    // Start timer on first click
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
        updateStatus('playing');
    }

    const tile = board[row][col];

    if (tile.isMine) {
        // Game over - hit a mine
        tile.isRevealed = true;
        endGame(false);
    } else {
        // Reveal tile and expand if empty
        revealTile(row, col);
        renderBoard();
        checkWinCondition();
    }
};

// Handle tile right-click
const handleTileRightClick = (event, row, col) => {
    event.preventDefault();

    if (gameOver || board[row][col].isRevealed) {
        return;
    }

    const tile = board[row][col];

    // Cycle through marks: none -> flag -> question -> none
    if (tile.mark === 'none') {
        tile.mark = 'flag';
    } else if (tile.mark === 'flag') {
        tile.mark = 'question';
    } else if (tile.mark === 'question') {
        tile.mark = 'none';
    }

    updateMineCounter();
    renderBoard();
};

// Start the timer
const startTimer = () => {
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
};

// Stop the timer
const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

// Reset the timer
const resetTimer = () => {
    stopTimer();
    secondsElapsed = 0;
    updateTimerDisplay();
};

// Update timer display
const updateTimerDisplay = () => {
    document.getElementById('timer-display').textContent = secondsElapsed;
};

// Update mine counter display
const updateMineCounter = () => {
    let flagCount = 0;
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.mark === 'flag') {
                flagCount++;
            }
        });
    });
    document.getElementById('mine-counter').textContent = MINE_COUNT - flagCount;
};

// Check if the game is won
const checkWinCondition = () => {
    let revealedNonMineCount = 0;
    const totalNonMines = (BOARD_SIZE * BOARD_SIZE) - MINE_COUNT;

    board.forEach(row => {
        row.forEach(tile => {
            if (!tile.isMine && tile.isRevealed) {
                revealedNonMineCount++;
            }
        });
    });

    if (revealedNonMineCount === totalNonMines) {
        endGame(true);
    }
};

// Update game status
const updateStatus = (status) => {
    const statusIndicator = document.getElementById('status-indicator');
    statusIndicator.className = '';

    switch (status) {
        case 'playing':
            statusIndicator.textContent = 'Playing...';
            statusIndicator.classList.add('playing');
            break;
        case 'won':
            statusIndicator.textContent = 'You Won!';
            statusIndicator.classList.add('won');
            break;
        case 'lost':
            statusIndicator.textContent = 'Game Over';
            statusIndicator.classList.add('lost');
            break;
        default:
            statusIndicator.textContent = 'Ready to Play';
    }
};

// End the game
const endGame = (won) => {
    gameOver = true;
    stopTimer();

    if (won) {
        updateStatus('won');
    } else {
        updateStatus('lost');
        // Reveal all mines
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.isMine) {
                    tile.isRevealed = true;
                }
            });
        });
    }

    renderBoard();
};

// Reset the game
const resetGame = () => {
    gameStarted = false;
    gameOver = false;
    resetTimer();
    updateStatus('default');
    initGame();
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();

    // Add click listener to game status for reset
    const gameStatus = document.querySelector('.game-status');
    gameStatus.style.cursor = 'pointer';
    gameStatus.addEventListener('click', resetGame);
});
