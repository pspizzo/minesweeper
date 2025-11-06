
Create a new JavaScript file that will be used by the index.html file to play a Minesweeper game. Requirements of the JavaScript file:

- Populate the #game-board element in the HTML with tiles that are not revealed yet
- The game board size should be 9x9
- There should be 10 mines hidden in the game board
- When a user clicks on a tile, reveal the contents of the tile
- The first time a user clicks a tile, start a timer that shows the number of seconds elapsed in this game.
- If a user clicks on a tile that has a mine, the game is over - stop the timer and do not allow the user to click new tiles
- If the tile does not have a mine, the revealed content should show the number of neighboring tiles that contain main. Neighbors include side-to-side, up-and-down, and diagonals (8 neighboring tiles). If the tile has no neighboring mines, the tile should be blank.

