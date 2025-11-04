
let size = 0;
let totalMines = 0;

// Data representation of board.
// Each cell shows the number of neighboring mines, 0 through 8.
// Or, if the value in a cell is -1, then the cell has a mine.
let board = [];


function cellClickHandler(e) {
    if (e.target.getAttribute('data-state') === 'visible') {
        // Nothing to do
        return;
    }

    e.target.setAttribute('data-state', 'visible');
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
}


function initGame(numRowsAndCols, numMines) {
    if (size !== numRowsAndCols) {
        size = numRowsAndCols;
        initGameBoard();
    } else {
        resetBoard();
    }

    totalMines = numMines;
    layMines();
}

initGame(9, 10);

