"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var players = ["X", "O"];
var currentPlayer = "X";
var wins = 0;
var draws = 0;
var losses = 0;
var board = [["", "", ""], ["", "", ""], ["", "", ""]];
var player = "X";
var opponent = "O";
var opponentMakingMove = false;
var someoneWon = false;

var Move = function Move(row, col) {
  _classCallCheck(this, Move);

  this.row = row;
  this.col = col;
};

function changeCurrentPlayer(player) {
  currentPlayer = player;
  document.getElementById("current-player-heading").textContent = "Player: " + currentPlayer;
}

function updateStats() {
  document.getElementById("stats-wins").innerHTML = "Wins: " + wins;
  document.getElementById("stats-draws").innerHTML = "Draws: " + draws;
  document.getElementById("stats-losses").innerHTML = "Losses: " + losses;
}

function playerClickedTile(row, col) {
  if (board[row - 1][col - 1] === "" && opponentMakingMove === false && someoneWon === false) {
    board[row - 1][col - 1] = player;
    document.getElementById("row-" + row + "-col-" + col).textContent = player;
    checkForWin(board);
    makeOpponentMove();
  }
}

function opponentMadeMove(row, col) {
  board[row - 1][col - 1] = opponent;
  document.getElementById("row-" + row + "-col-" + col).textContent = opponent;
  checkForWin(board);
}

function checkForWin(board) {
  var score = evaluate(board);

  if (score === -10) {
    someoneWon = true;
    wins++;
    updateStats();
  } else if (score === 10) {
    someoneWon = true;
    losses++;
    updateStats();
  }

  if (isMovesLeft(board) === false) {
    someoneWon = true;
    draws++;
    updateStats();
  }
}

function restart() {
  currentPlayer = "X";
  board = [["", "", ""], ["", "", ""], ["", "", ""]];
  opponentMakingMove = false;
  someoneWon = false;

  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      document.getElementById("row-" + (row + 1) + "-col-" + (col + 1)).textContent = "";
    }
  }
} // Opponent
// This function returns true if there are moves
// remaining on the board. It returns false if
// there are no moves left to play.


function isMovesLeft(board) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        return true;
      }
    }
  }

  return false;
} // This is the evaluation function.
// Return -10 if player has won,
// +10 if opponent has won and
// 0 if no one has won.


function evaluate(board) {
  // Checking rows for X or O victory
  for (var row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === opponent) {
        return +10;
      } else if (board[row][0] === player) {
        return -10;
      }
    }
  } // Checking columns for X or O victory


  for (var col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === opponent) {
        return +10;
      } else if (board[0][col] === player) {
        return -10;
      }
    }
  } // Checking diagonals for X or O victory


  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === opponent) {
      return +10;
    } else if (board[0][0] === player) {
      return -10;
    }
  }

  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === opponent) {
      return +10;
    } else if (board[0][2] === player) {
      return -10;
    }
  } // Return 0 if none of them have won


  return 0;
} // This is the minimax function. It considers all
// the possible ways the game can go and returns
// the value of the board


function minimax(board, depth, isMax, alpha, beta) {
  var score = evaluate(board); // If Maximizer has win the game
  // return its evaluated score

  if (score == 10) {
    return score;
  } // If Minimizer has won the game
  // return its evaluated score


  if (score == -10) {
    return score;
  } // If there are no more moves and
  // no winner then it is a tie


  if (isMovesLeft(board) === false) {
    return 0;
  } // If this is miaxmizer's move


  if (isMax) {
    var best = -1000; // Traverse all cells

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        // Check if cell is empty
        if (board[i][j] === "") {
          // Make the move
          board[i][j] = opponent; // Call minimax recursively and choose
          // the maximum value

          best = Math.max(best, minimax(board, depth + 1, !isMax, alpha, beta));
          alpha = Math.max(alpha, best); // Undo the move

          board[i][j] = ""; // Alpha Beta Pruning

          if (beta <= alpha) {
            break;
          }
        }
      }
    }

    return best;
  } // If this is minimizer's move
  else {
      var _best = 1000; // Traverse all cells

      for (var _i = 0; _i < 3; _i++) {
        for (var _j = 0; _j < 3; _j++) {
          // Check if cell is empty
          if (board[_i][_j] === "") {
            // Make the move
            board[_i][_j] = player; // Call minimax recursively and choose
            // the minimum value

            _best = Math.min(_best, minimax(board, depth + 1, !isMax));
            beta = Math.min(beta, _best); // Undo the move

            board[_i][_j] = ""; // Alpha Beta Pruning

            if (beta <= alpha) {
              break;
            }
          }
        }
      }

      return _best;
    }
} // This will return the best possible
// move for the opponent.


function findBestMove(board) {
  var bestVal = -1000;
  var bestMove = new Move(-1, -1); // Traverse all cells, evaluate minimax function
  // for all empty cells. And return cell
  // with optimal value.

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      // Check if cell is empty
      if (board[i][j] === "") {
        // Make the move
        board[i][j] = opponent; // Compute evaluation function for this
        // move.

        var moveVal = minimax(board, 0, false, -1000, 1000); // Undo the move

        board[i][j] = ""; // If the value if the current move is
        // more than the best value, then update
        // best

        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }

  return bestMove;
}

function makeOpponentMove() {
  opponentMakingMove = true;
  var bestMove = findBestMove(board);
  opponentMadeMove(bestMove.row + 1, bestMove.col + 1);
  opponentMakingMove = false;
}