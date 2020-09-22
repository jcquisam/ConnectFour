/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let gameLive = true;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const newBoard = document.querySelector('#board');

	// TODO: add comment for this code
	// this part will create the header or first row where the token will be displayed and each column, and will add an Id, class and eventlistener
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);
	top.classList.add('p1');

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	newBoard.append(top);

	// TODO: add comment for this code
	// this part will create the chart of the game with 6 rows and 7 columns and the value of each cell represented by [y-x]
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.classList.add('item');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		newBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// this part will check from the bottom on the board to up adn will return the first cell available

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
// this part will create a div with two classes which will be appended to an specific cell

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`Player${currPlayer}`);
	const cell = document.getElementById(`${y}-${x}`);
	cell.append(piece);
}

/** endGame: announce game end */
// this function will be called to display a message and stop the player from adding more tokens in in the board

function endGame(msg) {
	// TODO: pop up alert message
	alert(msg);
	gameLive = false;
}

/** handleClick: handle click of column top to play piece */
// this function will check if the game is on if so it will callback other functions to complete diffrent task. moreover, it will switch from player 1 to player 2 each time and will check if there is a winner

function handleClick(evt) {
	if (gameLive === true) {
		// get x from ID of clicked cell
		const x = +evt.target.id;
		const top = document.querySelector('#column-top');
		top.classList.toggle('p1');

		// get next spot in column (if none, ignore click)
		const y = findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		// TODO: add line to update in-memory board
		placeInTable(y, x);
		board[y][x] = currPlayer;

		// check for win
		// check if there is a winner, if so it will run function endgame with the winner player
		if (checkForWin()) {
			return endGame(`Player ${currPlayer} won!`);
		}

		// check for tie
		// TODO: check if all cells in board are filled; if so call, call endGame
		if (board.every((row) => row.every((cell) => cell))) {
			return endGame('Game is a Tie!');
		}

		// switch players
		// TODO: switch currPlayer 1 <-> 2
		currPlayer = currPlayer === 1 ? 2 : 1;
	}
	return;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	//  this part will check each cell if the current player has 4 tokens together horizontically,vertically,and diagonally(right or left), and will return true so i can activate the endgame function.

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();

// this part will reset the board to start over
const btn = document.querySelector('.reset');
btn.addEventListener('click', (e) => {
	document.location.reload();
});
