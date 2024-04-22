let currentPlayer = 'X'; // Keep track of whose turn it is
let boardStatus = ['', '', '', '', '', '', '', '', '']; // Initial empty status for all 9 boards
let lastMove = { board: null, cell: null };


document.querySelectorAll('.small-box').forEach(cell => {
    cell.addEventListener('click', cellClicked);
  });

  function isMoveValid(cellPos, boardPos) {
    console.log("Attempting move at cell:", cellPos, "on board:", boardPos);
  
    // Scenario handling for the first move or when directed to a completed board
    let nextValidBoard = nextWhichBoard(lastMove.cell);
    console.log("Next valid board:", nextValidBoard);

    // Check if the cell is already occupied or the board has been won
    if (gameBoardState[boardPos][cellPos] !== '' || boardStatus[boardPos] !== '') {
        console.log("Cell is occupied or board is won.");
        return false;
    }

    // If any board is valid (first move or directed to a completed board)
    if (nextValidBoard === -1) {
        console.log("Any board is valid for this move.");
        return true; // Any move is valid under these conditions
    }

    // If there's a specific board that the next move must be made on
    if (lastMove.board !== null && lastMove.cell !== null) {
        // Convert lastMove.cell to a board index and compare with the current boardPos
        if (parseInt(boardPos) !== nextValidBoard) {
            console.log("Move must be made on board:", nextValidBoard, "but was made on board:", boardPos);
            return false; // The move must be made on nextValidBoard but wasn't
        }
    }
  
    console.log("Move is valid for cell:", cellPos, "on board:", boardPos);
    return true; // The move is valid
}


function nextWhichBoard(lastCell) {
  // Check if it's the first move of the game
  if (lastMove.board === null && lastMove.cell === null) {
      console.log("First turn, any board is valid.");
      return -1; // Indicate that any board is valid
  }

  // If the last move was made, determine the next board based on the last cell
  // This assumes the lastCell is 'row-col' of where the last move was made
  if (lastCell) {
      // No need to convert to index, just use the cell position directly to determine the next board
      const [row, col] = lastCell.split('-').map(Number);
      // Assuming the board layout matches cell positions directly
      const nextBoard = row * 3 + col;
      
      // Check if the determined next board is already completed (won or tied)
      if (boardStatus[nextBoard] !== '' || isBoardFilled(nextBoard)) {
          console.log("Directed to a completed board, any board is valid.");
          return -1; // Any board is valid since the directed one is completed
      }

      console.log("Next valid board:", nextBoard);
      return nextBoard; // Return the determined next valid board
  }

  // Fallback in case lastCell wasn't provided properly
  console.log("Fallback, any board is valid.");
  return -1;
}

function checkForGameTie() {
  // Assuming boardStatus indicates which player won each board or '' if not won
  // and isBoardFilled checks if a board is completely filled
  for (let i = 0; i < boardStatus.length; i++) {
      if (boardStatus[i] === '' && !isBoardFilled(i)) {
          return false; // Found a board that is not completely filled and not won, no tie
      }
  }
  // Now, check if there's no winner on the large board
  if (!checkLargeBoardWin('X') && !checkLargeBoardWin('O')) {
      return true; // It's a tie if no player wins the large board and all boards are filled or won
  }
  return false; // There's a winner, or not all boards are filled/won, so no tie
}



function isFirstMove() {
  // Check if all boards are empty, indicating it's the first move of the game.
  for (let i = 0; i < gameBoardState.length; i++) {
      if (!isBoardEmpty(i)) {
          return false; // Found a board that is not empty, so it's not the first move.
      }
  }
  return true; // All boards are empty.
}

function isBoardFilled(boardIndex) {
  const board = gameBoardState[boardIndex];
  for (let cell in board) {
      if (board[cell] === '') {
          return false; // Found an empty cell.
      }
  }
  return true; // No empty cells found.
}

function isBoardEmpty(boardIndex) {
  const board = gameBoardState[boardIndex];
  for (let cell in board) {
      if (board[cell] !== '') {
          return false; // Found a non-empty cell.
      }
  }
  return true; // All cells are empty.
}


function updateGamestate(boardPos, cellPos, currentPlayer) {
  gameBoardState[boardPos][cellPos] = currentPlayer;
}

function cellClicked(event) {
  const clickedCell = event.target;
  const cellPos = clickedCell.getAttribute('data-cell');
  const boardPos = clickedCell.parentNode.getAttribute('data-board');
  
  if (isMoveValid(cellPos, boardPos)) {
      updateGamestate(boardPos, cellPos, currentPlayer);
      clickedCell.textContent = currentPlayer; // Display player's symbol

      // Check for wins before switching players
      const wonSmallBoard = checkSmallBoardWin(boardPos, currentPlayer);
      const wonLargeBoard = wonSmallBoard ? checkLargeBoardWin(currentPlayer) : false;

      if (wonLargeBoard) {
          console.log(currentPlayer + " wins the game!");
          // Implement winning logic (display message, reset game, etc.)
      } else if (checkForGameTie()) {
          console.log("The game is a tie!");
          // Implement tie logic (display message, reset game, etc.)
      } else {
          // If the game is not won or tied, continue to the next player
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }

      lastMove.board = boardPos;
      lastMove.cell = cellPos;

      console.log(lastMove);
      clickedCell.removeEventListener('click', cellClicked); // Prevent further clicks
  }
}


const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8], 
];
/*function checkSmallBoardWin(boardPos, player) {
    // Implement logic to check if the player has won the small board at boardPos
    // Use the winPatterns to check for a win
    // Return true if the player has won, otherwise false
    pass
}*/
// function convertToIndex(rowCol) {
//     const [row, col] = rowCol.split('-').map(Number);
//     return row * 3 + col;
// }
function convertToRowCol(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `${row}-${col}`;
  }
let gameBoardState = [
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' },
    { '0-0': '', '0-1': '', '0-2': '', '1-0': '', '1-1': '', '1-2': '', '2-0': '', '2-1': '', '2-2': '' }
  ];
const checkSmallBoardWin = (boardPos,player) => {
  for (let pattern of winPatterns) {
    let pos1Val = gameBoardState[boardPos][convertToRowCol(pattern[0])];
    let pos2Val = gameBoardState[boardPos][convertToRowCol(pattern[1])];
    let pos3Val = gameBoardState[boardPos][convertToRowCol(pattern[2])];

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        console.log(`winner:${player}`);;
        boardStatus[boardPos]= player
        return true;
      }
    }
  }
};

const checkLargeBoardWin = (player) => {
  for (let pattern of winPatterns) {
    let pos1Val = boardStatus[pattern[0]];
    let pos2Val = boardStatus[pattern[1]];
    let pos3Val = boardStatus[pattern[2]];

    if (pos1Val != '' && pos2Val != '' && pos3Val != '' ) {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        console.log(`winner:${player}`);
        return true;
      }
    }
  }
};

  
 