// Declaring variable
const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let dimension = parseInt(document.getElementById("boardsize").value);
let totalTurn = 0;
let playerCount = 0;
let randomPosition = false;
let board = new Array(dimension)
  .fill("")
  .map(() => new Array(dimension).fill(""));
let startButton = document.getElementById("gamestart");
let turn = 0;
let gameOver = false;
let players = [];
document.getElementById("reset").style.display = "none";
const changeDimension = (event) => {
  dimension = parseInt(event.target.value);
  board = new Array(dimension)
    .fill("")
    .map(() => new Array(dimension).fill(""));
};
const isEmpty = (value) => !value || !value.trim();
document
  .getElementById("boardsize")
  .addEventListener("change", changeDimension);

const startgame = () => {
  if (isEmpty(player1.value) || isEmpty(player2.value)) {
    Swal.fire({
      icon: "error",
      text: "Enter a valid name!",
    });

    return;
  }
  player1.setAttribute("disabled", true);
  player2.setAttribute("disabled", true);
  document.getElementById("boardsize").setAttribute("disabled", true);
  startButton.setAttribute("disabled", true);

  players.push(player1.value);
  players.push(player2.value);
  players.push(`computer`);

  document.getElementById("turn").innerHTML = players[turn % 2] + "'s turn";
  document.getElementById("boardDetails").style.display = "none";
  createBoard();
};

const handleClick = (cell, i, j) => {
  const el = cell;

  if (el.innerHTML !== "" || gameOver) {
    return;
  }

  board[i][j] = turn % 2 === 0 ? "X" : "O";

  el.innerHTML =
    board[i][j] === "X"
      ? `<img width="35px" height="35px" src="img/close.png"></img>`
      : board[i][j] === "O" &&
        `<img width="35px" height="35px" src="img/0.png"></img>`;
  audio.play();

  playerCount++;
  console.log("board Size", board);

  if (calculateWinner()) {
    Swal.fire(
      "Good job!",
      players[randomPosition ? 2 : turn % 2] + " won!!",
      "success"
    );
    gameOver = true;
    return;
  }
  if (turn % 2 !== 0) {
    randomPosition = true;
    setTimeout(computerTurn, 1000);
  }

  turn++;
  document.getElementById("turn").innerHTML = players[turn % 2];

  if (totalTurn === dimension * dimension) {
    debugger;
    Swal.fire({
      icon: "error",
      text: "Game draw",
    });

    gameOver = true;
    return;
  }

  totalTurn++;
  if (playerCount === 2) {
    playerCount = 0;
  }
  randomPosition = false;
};

const createBoard = () => {
  let gameContainer = document.getElementById("board-container");
  for (let i = 0; i < dimension; i++) {
    let row = document.createElement("div");
    row.className = "row";
    row.id = i;
    for (let j = 0; j < dimension; j++) {
      let cell = document.createElement("div");
      cell.addEventListener("click", (event) => handleClick(cell, i, j));
      cell.className = "cell";
      cell.id = j;
      row.appendChild(cell);
    }
    gameContainer.appendChild(row);
  }
  document.getElementById("reset").style.display = "block";
};
const calculateWinner = () => {
  let len = board.length;
  if (turn < len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (board[i].every((el) => el === board[i][0] && el !== "")) {
      return true;
    }
    let start_col_val = board[0][i];
    let count = 1;
    for (let j = 1; j < len; j++) {
      if (start_col_val === board[j][i] && start_col_val !== "") {
        count++;
      }
    }
    if (count === len) {
      return true;
    }
  }

  let i = board[0][0];
  let j = 0;
  while (j < len) {
    if (board[0][0] === "") {
      break;
    }
    if (board[j][j] !== i) {
      break;
    } else {
      j++;
    }
  }
  if (j === len) {
    return true;
  }

  let rev_i = 0;
  let rev_j = len - 1;
  let rev_val = board[rev_i][rev_j];

  while (rev_i < len) {
    if (board[rev_i][rev_j] === "") {
      break;
    }
    if (rev_val !== board[rev_i][rev_j]) {
      break;
    } else {
      rev_i++;
      rev_j--;
    }
  }
  if (rev_i === len) {
    return true;
  }

  return false;
};
function refreshPage() {
  window.location.reload();
}

function computerTurn() {
  let aiPositions = [];
  const getLength = board.length;
  let randomIndex;
  console.log("board Size", board);

  for (let i = 0; i < getLength; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") {
        aiPositions.push({ iIndex: i, jIndex: j });
      }
    }
  }
  if (aiPositions.length > 0) {
    const findRandomIndex = Math.floor(Math.random() * aiPositions.length);
    randomIndex = findRandomIndex;
  }

  board[aiPositions[randomIndex].iIndex][aiPositions[randomIndex].jIndex] = "C";
  const currentDiv = document.getElementsByClassName("row");
  const childNode = currentDiv[aiPositions[randomIndex].iIndex].childNodes;
  childNode[
    aiPositions[randomIndex].jIndex
  ].innerHTML = `<img width="35px" height="35px" src="img/ai.png"></img>`;
  totalTurn++;
  if (totalTurn === dimension * dimension) {
    Swal.fire({
      icon: "error",
      text: "Game draw",
    });

    gameOver = true;
    return;
  }
}

console.log("Total Players", players);
