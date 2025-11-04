
let size = 0;
let totalMines = 0;
let timer;

let cellsFlagged = 0;
let cellsRevealed = 0;

// Data representation of board.
// Each cell shows the number of neighboring mines, 0 through 8.
// Or, if the value in a cell is -1, then the cell has a mine.
let board = [];

let gameRunning = false;
let win = false;
let lose = false;

const explosionSvg = '<svg class="explosion" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m480-281 59-59h81v-81l59-59-59-59v-81h-81l-59-59-59 59h-81v81l-59 59 59 59v81h81l59 59Zm0 253L346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Zm0-112 100-100h140v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h140l100 100Zm0-340Z"/></svg>';
const bombSvg = '<svg class="bomb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M346-48q-125 0-212.5-88.5T46-350q0-125 86.5-211.5T344-648h13l27-47q12-22 36-28.5t46 6.5l30 17 5-8q23-43 72-56t92 12l35 20-40 69-35-20q-14-8-30.5-3.5T570-668l-5 8 40 23q21 12 27.5 36t-5.5 45l-27 48q23 36 34.5 76.5T646-348q0 125-87.5 212.5T346-48Zm0-80q91 0 155.5-64.5T566-348q0-31-8.5-61T532-466l-26-41 42-72-104-60-42 72h-44q-94 0-163.5 60T125-350q0 92 64.5 157T346-128Zm454-480v-80h120v80H800ZM580-828v-120h80v120h-80Zm195 81-56-56 85-85 56 56-85 85ZM346-348Z"/></svg>';


function getCellElement(row, cell) {
    return document.querySelector(`.row[data-row-id="${row}"] .cell[data-cell-id="${cell}"]`);
}

function updateMineCountDisplay() {
    const counter = document.getElementById('mines-remaining');
    counter.innerText = String(totalMines - cellsFlagged);
}

function startGameTimer() {
    let start = new Date().getTime();
    const timeEl = document.getElementById('game-time');
    timer = setInterval(() => {
        timeEl.innerText = String(Math.floor((new Date().getTime() - start) / 1000));
    }, 1000);
}

function stopGameTimer() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
}

function updateStatusIcon() {
    const statusEl = document.getElementById('status-icon');
    statusEl.classList.remove('neutral');
    statusEl.classList.remove('happy');
    statusEl.classList.remove('sad');
    if (!gameRunning) {
        statusEl.classList.add('neutral');
        return;
    }

    if (lose) {
        statusEl.classList.add('sad');
    } else if (win) {
        statusEl.classList.add('happy');
    } else {
        statusEl.classList.add('neutral');
    }
}

function rightClickHandler(e) {
    e.preventDefault();
    if (!gameRunning || e.target.getAttribute('data-state') === 'visible') {
        // Nothing to do
        return;
    }

    const currentFlag = e.target.getAttribute('data-flagged');
    if (currentFlag === 'mine') {
        e.target.setAttribute('data-flagged', 'question');
        cellsFlagged -= 1;
        updateMineCountDisplay();
        e.target.innerHTML = '?';
    } else if (currentFlag === 'question') {
        e.target.removeAttribute('data-flagged');
        e.target.innerHTML = '';
    } else {
        e.target.setAttribute('data-flagged', 'mine');
        cellsFlagged += 1;
        updateMineCountDisplay();
        e.target.innerHTML = '!';
    }
}


function revealConnectedEmptySpaces(row, cell) {
    if (row < 0 || row >= size || cell < 0 || cell >= size) return;

    const cellEl = getCellElement(row, cell);
    if (cellEl.getAttribute('data-state') === 'visible') return;

    cellEl.setAttribute('data-state', 'visible');
    cellsRevealed += 1;

    if (board[row][cell] !== 0) {
        cellEl.innerHTML = board[row][cell];
        cellEl.setAttribute('data-neighboring-mines', board[row][cell]);
    } else {
        // Recurse
        [row - 1, row, row + 1].forEach((r) => {
            [cell - 1, cell, cell + 1].forEach((c) => {
                revealConnectedEmptySpaces(r, c);
            })
        });
    }
}

function revealMines() {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] < 0) {
                const cellEl = getCellElement(row, col);
                if (cellEl.getAttribute('data-state') !== 'visible') {
                    cellEl.innerHTML = bombSvg;
                    cellEl.setAttribute('data-state', 'visible');
                }
            }
        }
    }
}

function cellClickHandler(e) {
    if (!gameRunning || e.target.getAttribute('data-state') === 'visible') {
        // Nothing to do
        return;
    }

    if (!timer) {
        startGameTimer();
    }

    const row = parseInt(e.target.parentElement.getAttribute('data-row-id'), 10);
    const cell = parseInt(e.target.getAttribute('data-cell-id'), 10);

    if (board[row][cell] < 0) {
        e.target.setAttribute('data-state', 'visible');
        lose = true;
        document.getElementById('game-board').classList.add('lose');
        e.target.innerHTML = explosionSvg;
        stopGameTimer();
        updateStatusIcon();
        revealMines();
        gameRunning = false;
    } else if (board[row][cell] === 0) {
        revealConnectedEmptySpaces(row, cell);
    } else {
        e.target.setAttribute('data-state', 'visible');
        e.target.innerHTML = board[row][cell];
        e.target.setAttribute('data-neighboring-mines', board[row][cell]);
        cellsRevealed += 1;
    }

    if (cellsRevealed === ((size * size) - totalMines)) {
        win = true;
        document.getElementById('game-board').classList.add('win');
        stopGameTimer();
        updateStatusIcon();
        gameRunning = false;
    }
}


function initGameBoard() {
    const boardEl = document.getElementById('game-board');

    // Clear existing board DOM elements and board data
    boardEl.innerHTML = '';
    board = [];

    // Create new board
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('data-row-id', i);

        const rowData = [];
        board.push(rowData);

        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-cell-id', j);
            cell.setAttribute('data-state', 'hidden');
            cell.addEventListener('click', cellClickHandler);
            cell.addEventListener('contextmenu', rightClickHandler);
            row.appendChild(cell);

            rowData.push(0);
        }
        boardEl.appendChild(row);
    }
}

function resetBoard() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = getCellElement(i, j);
            cell.setAttribute('data-state', 'hidden');
            cell.removeAttribute('data-neighboring-mines');
            cell.removeAttribute('data-flagged');
            cell.innerHTML = '';
            board[i][j] = 0;
        }
    }
}

function layMines() {
    let remaining = totalMines;
    while (remaining > 0) {
        const row = Math.floor(Math.random() * size);
        const cell = Math.floor(Math.random() * size);
        if (board[row][cell] >= 0) {
            remaining -= 1;
            // New mine - update neighbor counts in board data
            board[row][cell] = -1;
            [row - 1, row, row + 1].forEach((r) => {
                [cell - 1, cell, cell + 1].forEach((c) => {
                    if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] >= 0) {
                        board[r][c] += 1;
                    }
                });
            });
        }
    }
    updateMineCountDisplay();
}


function initGame(numRowsAndCols, numMines) {
    if (size !== numRowsAndCols) {
        size = numRowsAndCols;
        initGameBoard();
    } else {
        resetBoard();
    }

    const gameBoardEl = document.getElementById('game-board');
    gameBoardEl.classList.remove('win');
    gameBoardEl.classList.remove('lose');

    stopGameTimer();
    document.getElementById('game-time').innerHTML = '0';
    cellsFlagged = 0;
    cellsRevealed = 0;
    win = false;
    lose = false;

    totalMines = numMines;
    layMines();
    updateStatusIcon();

    gameRunning = true;
}

function initGameForDifficulty(selectEl) {
    const container = document.getElementById('game-container');
    container.classList.remove('easy');
    container.classList.remove('hard');
    container.classList.remove('expert');

    if (selectEl.value === 'hard') {
        initGame(16, 40);
        container.classList.add('hard');
    } else if (selectEl.value === 'expert') {
        initGame(22, 99);
        container.classList.add('expert');
    } else {
        initGame(9, 10);
        container.classList.add('easy');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGameForDifficulty(document.getElementById('difficulty-select'));
})

document.getElementById('status-icon').addEventListener('click', () => {
    initGameForDifficulty(document.getElementById('difficulty-select'));
});

document.getElementById('difficulty-select').addEventListener('change', (e) => {
    initGameForDifficulty(e.target);
});

