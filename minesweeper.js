
let size = 0;
let totalMines = 0;

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


function getCellElement(row, cell) {
    return document.querySelector(`.row[data-row-id="${row}"] .cell[data-cell-id="${cell}"]`);
}

function updateMineCountDisplay() {
    const counter = document.getElementById('mines-remaining');
    counter.innerText = String(totalMines - cellsFlagged);
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


function cellClickHandler(e) {
    if (!gameRunning || e.target.getAttribute('data-state') === 'visible') {
        // Nothing to do
        return;
    }

    const row = parseInt(e.target.parentElement.getAttribute('data-row-id'), 10);
    const cell = parseInt(e.target.getAttribute('data-cell-id'), 10);

    if (board[row][cell] < 0) {
        e.target.setAttribute('data-state', 'visible');
        lose = true;
        document.getElementById('game-board').classList.add('lose');
        e.target.innerHTML = explosionSvg;
        updateStatusIcon();
        gameRunning = false;
    } else if (board[row][cell] === 0) {
        e.target.setAttribute('data-state', 'visible');
        cellsRevealed += 1;
    } else {
        e.target.setAttribute('data-state', 'visible');
        e.target.innerHTML = board[row][cell];
        e.target.setAttribute('data-neighboring-mines', board[row][cell]);
        cellsRevealed += 1;
    }

    if (cellsRevealed === ((size * size) - totalMines)) {
        win = true;
        document.getElementById('game-board').classList.add('win');
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

    cellsFlagged = 0;
    cellsRevealed = 0;
    win = false;
    lose = false;

    totalMines = numMines;
    layMines();
    updateStatusIcon();

    gameRunning = true;
}

document.addEventListener('DOMContentLoaded', () => {
    initGame(9, 10);
})

document.getElementById('status-icon').addEventListener('click', () => {
    initGame(9, 10);
});

