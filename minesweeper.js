
let size = 0;



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

        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-cell-id', j);
            cell.setAttribute('data-state', 'hidden');
            row.appendChild(cell);
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
        }
    }
}


function initGame(numRowsAndCols) {
    if (size !== numRowsAndCols) {
        size = numRowsAndCols;
        initGameBoard();
    } else {
        resetBoard();
    }
}

initGame(9);

