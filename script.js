let players = ["X", "O"];
let currentPlayer = "X";
let wins = 0;
let draws = 0;
let losses = 0;
let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let player = "X";
let opponent = "O";
let opponentMakingMove = false;
let someoneWon = false;

class Move {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

function showToast(player) {
    let content = "";
    switch (player) {
        case "X":
            content = "You Win!";
            break;
        case "O":
            content = "You Loose!";
            break;
        default:
            content = "Draw!";
            break;
    }
    document.getElementById("toast-text").textContent = content;
    $('.toast').toast("show");
}

function changeCurrentPlayer(player) {
    currentPlayer = player;
    document.getElementById("current-player-heading").textContent = "Player: " + currentPlayer;
}

function updateStats() {
    document.getElementById("stats-wins").textContent = "Wins: " + wins;
    document.getElementById("stats-draws").textContent = "Draws: " + draws;
    document.getElementById("stats-losses").textContent = "Losses: " + losses;
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
    let score = evaluate(board);

    if (score === -10) {
        someoneWon = true;
        wins++;
        updateStats();
        showToast("X");
    }
    else if (score === 10) {
        someoneWon = true;
        losses++;
        updateStats();
        showToast("O");
    }

    if (isMovesLeft(board) === false) {
        someoneWon = true;
        draws++;
        updateStats();
        showToast("");
    }
}

function restart() {
    currentPlayer = "X";
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    opponentMakingMove = false;
    someoneWon = false;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            document.getElementById("row-" + (row + 1) + "-col-" + (col + 1)).textContent = "";
        }
    }
}

// Opponent

// This function returns true if there are moves
// remaining on the board. It returns false if
// there are no moves left to play.
function isMovesLeft(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                return true;
            }
        }
    }

    return false;
}

// This is the evaluation function.
// Return -10 if player has won,
// +10 if opponent has won and
// 0 if no one has won.
function evaluate(board) {
    // Checking rows for X or O victory
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            if (board[row][0] === opponent) {
                return +10;
            }
            else if (board[row][0] === player) {
                return -10;
            }
        }
    }

    // Checking columns for X or O victory
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            if (board[0][col] === opponent) {
                return +10;
            }
            else if (board[0][col] === player) {
                return -10;
            }
        }
    }

    // Checking diagonals for X or O victory
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === opponent) {
            return +10;
        }
        else if (board[0][0] === player) {
            return -10;
        }
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === opponent) {
            return +10;
        }
        else if (board[0][2] === player) {
            return -10;
        }
    }

    // Return 0 if none of them have won
    return 0;
}

// This is the minimax function. It considers all
// the possible ways the game can go and returns
// the value of the board
function minimax(board, depth, isMax, alpha, beta) {
    let score = evaluate(board);

    // If Maximizer has win the game
    // return its evaluated score
    if (score == 10) {
        return score;
    }

    // If Minimizer has won the game
    // return its evaluated score
    if (score == -10) {
        return score;
    }

    // If there are no more moves and
    // no winner then it is a tie
    if (isMovesLeft(board) === false) {
        return 0;
    }

    // If this is miaxmizer's move
    if (isMax) {
        let best = -1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === "") {
                    // Make the move
                    board[i][j] = opponent;

                    // Call minimax recursively and choose
                    // the maximum value
                    best = Math.max(best, minimax(board, depth + 1, !isMax, alpha, beta));
                    alpha = Math.max(alpha, best);

                    // Undo the move
                    board[i][j] = "";

                    // Alpha Beta Pruning
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }

        return best;
    }

    // If this is minimizer's move
    else {
        let best = 1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === "") {
                    // Make the move
                    board[i][j] = player;

                    // Call minimax recursively and choose
                    // the minimum value
                    best = Math.min(best, minimax(board, depth + 1, !isMax));
                    beta = Math.min(beta, best);

                    // Undo the move
                    board[i][j] = "";

                    // Alpha Beta Pruning
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }

        return best;
    }
}

// This will return the best possible
// move for the opponent.
function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = new Move(-1, -1);

    // Traverse all cells, evaluate minimax function
    // for all empty cells. And return cell
    // with optimal value.
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Check if cell is empty
            if (board[i][j] === "") {
                // Make the move
                board[i][j] = opponent;

                // Compute evaluation function for this
                // move.
                let moveVal = minimax(board, 0, false, -1000, 1000);

                // Undo the move
                board[i][j] = "";

                // If the value if the current move is
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

async function makeOpponentMove() {
    opponentMakingMove = true;
    await new Promise(r => setTimeout(r, 0));
    let bestMove = findBestMove(board);
    if (bestMove.row !== -1 && bestMove.col !== -1) {
        opponentMadeMove(bestMove.row + 1, bestMove.col + 1);
    }
    opponentMakingMove = false;
}

$('.toast').toast({
    delay: 10000,
});