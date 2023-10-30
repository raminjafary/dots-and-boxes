let ROWS = 3;
let COLUMNS = 4;

let lines;
let squares;

let TURN;
let R_SCORE;
let B_SCORE;

const PLAYER_ONE = "red";
const PLAYER_TWO = "blue";

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  document.getElementById("restart-btn").addEventListener("click", () => {
    initializeGame();
  });
});

function initializeGame() {
  ROWS = +document.getElementById("rows-input").value;
  COLUMNS = +document.getElementById("columns-input").value;
  TURN = Math.random() <= 0.5 ? PLAYER_ONE : PLAYER_TWO;

  document.getElementById("board").innerHTML = "";
  document.getElementById("turn-label").style.backgroundColor = TURN;

  R_SCORE = 0;
  B_SCORE = 0;

  squares = Array(ROWS)
    .fill(Array(COLUMNS).fill(""))
    .map((r) => {
      return [...r];
    });

  lines = Array(ROWS * 2 + 1)
    .fill(Array(COLUMNS).fill("G"))
    .map((r, index) => {
      if (index % 2 == 1) {
        r = [...r, "G"];
      }
      return [...r];
    });

  createBoardGame();

  console.table(lines);
  console.table(squares);
  console.log("Game is started. Turn is " + TURN);
}

function showSquareLabel(i, j) {
  console.log(i, j);
  console.log(`span[data-data="${i + "," + j}"]`);
  let squreLabel = document.querySelector(`span[data-data="${i + "," + j}"]`);
  squreLabel.textContent =
    TURN == PLAYER_ONE
      ? PLAYER_ONE[0].toUpperCase()
      : PLAYER_TWO[0].toUpperCase();
  squreLabel.style.color = TURN == PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO;
  squreLabel.style.opacity = 1;
}

function createBoardGame() {
  let offset = 10;
  let leftPosition;

  let lineSize = 150;

  let wrapperBorad = document.createElement("div");
  wrapperBorad.className = "wrapper-board";

  leftPosition = offset;

  for (let i = 0; i < lines.length; i++) {
    let widthLine = i % 2 == 1 ? offset : lineSize;
    let heightLine = i % 2 == 1 ? lineSize : offset;

    let rowWrapper = document.createElement("div");
    rowWrapper.style.lineHeight = offset + "px";

    let gap = i % 2 == 1 ? heightLine : offset;

    for (let j = 0; j < lines[i].length; j++) {
      let lineBtn = document.createElement("div");
      lineBtn.dataset.r = i;
      lineBtn.dataset.c = j;

      lineBtn.style.borderRadius = offset / 2 + "px";
      lineBtn.style.display = "inline-block";
      lineBtn.style.cursor = "pointer";
      lineBtn.style.position = "relative";
      lineBtn.style.backgroundColor = "#cccccc";
      lineBtn.style.left = leftPosition + "px";
      lineBtn.style.width = widthLine + "px";
      lineBtn.style.height = heightLine + "px";
      leftPosition += gap;

      lineBtn.addEventListener("click", (e) => {
        if (lines[+e.target.dataset.r][+e.target.dataset.c] == "G") {
          e.target.style.backgroundColor = TURN;
        }
        drawLine(+e.target.dataset.r, +e.target.dataset.c);
      });

      rowWrapper.appendChild(lineBtn);
    }

    leftPosition = i % 2 == 1 ? offset : 0;
    wrapperBorad.appendChild(rowWrapper);
  }

  let wrapperSqurars = document.createElement("div");

  wrapperSqurars.style.position = "absolute";
  wrapperSqurars.style.pointerEvents = "none";
  wrapperSqurars.style.top = 0 + "px";

  leftPosition = offset / 2;
  for (let i = 0; i < ROWS; i++) {
    let rowWrapper = document.createElement("div");
    rowWrapper.style.height = lineSize + "px";
    rowWrapper.style.marginTop = offset + "px";
    rowWrapper.style.pointerEvents = "none";

    for (let j = 0; j < COLUMNS; j++) {
      let squareLabel = document.createElement("span");
      squareLabel.textContent = "G";
      squareLabel.dataset.data = i + "," + j;
      squareLabel.style.display = "inline-grid";
      squareLabel.style.placeItems = "center";
      squareLabel.style.fontFamily = "sans-serif";
      squareLabel.style.position = "relative";
      squareLabel.style.pointerEvents = "none";

      squareLabel.style.fontSize = lineSize / 2 + "px";
      squareLabel.style.opacity = 0;
      squareLabel.style.left = leftPosition + "px";
      squareLabel.style.width = lineSize + offset + "px";
      squareLabel.style.height = lineSize + offset + "px";
      rowWrapper.appendChild(squareLabel);
    }
    wrapperSqurars.appendChild(rowWrapper);
  }

  wrapperBorad.appendChild(wrapperSqurars);

  document.getElementById("board").appendChild(wrapperBorad);
  document.getElementById("player-one-score").innerText =
    PLAYER_ONE + " : " + 0;
  document.getElementById("player-two-score").innerText =
    PLAYER_TWO + " : " + 0;
}

function drawLine(r, c) {
  if (lines[r][c] !== "G") {
    console.log("This line has already being drawn...");
    return;
  }

  console.log(TURN + " is drawing line ...");

  let oldBScore = B_SCORE;
  let oldRScore = R_SCORE;

  lines[r][c] = TURN;

  detectSqures(r, c);

  if (TURN == PLAYER_ONE) {
    if (R_SCORE == oldRScore) {
      TURN = PLAYER_TWO;
    } else {
      TURN = PLAYER_ONE;
    }
  } else {
    if (B_SCORE == oldBScore) {
      TURN = PLAYER_ONE;
    } else {
      TURN = PLAYER_TWO;
    }
  }

  document.getElementById("turn-label").style.backgroundColor = TURN;
  console.log("%c" + "R = " + R_SCORE + " VS B = " + B_SCORE, "color:yellow");
  console.log("Next turn is " + TURN);

  if (gameIsFinished()) {
    if (R_SCORE == B_SCORE) {
      console.log("Result is Draw");
    } else {
      console.log((R_SCORE > B_SCORE ? PLAYER_ONE : PLAYER_TWO) + " is Winner");
    }
  }
}

function gameIsFinished() {
  let emptySquareExists = false;
  for (let i = 0; i < ROWS; i++) {
    if (emptySquareExists) break;
    for (let j = 0; j < COLUMNS; j++) {
      if (squares[i][j] == "") {
        emptySquareExists = true;
        break;
      }
    }
  }
  return !emptySquareExists;
}

function addScore(turn) {
  if (turn == PLAYER_ONE) {
    R_SCORE++;
    document.getElementById("player-one-score").innerText =
      PLAYER_ONE + " : " + R_SCORE;
  } else {
    B_SCORE++;
    document.getElementById("player-two-score").innerText =
      PLAYER_TWO + " : " + B_SCORE;
  }
}

function detectSqures(r, c) {
  let lineDirection = r % 2 == 0 ? "hort" : "vert";

  if (lineDirection == "vert") {
    if (c != COLUMNS) {
      //right square
      let lineA = [r - 1, c];
      let lineB = [r, c + 1];
      let lineC = [r + 1, c];

      if (
        lines[lineA[0]][lineA[1]] !== "G" &&
        lines[lineB[0]][lineB[1]] !== "G" &&
        lines[lineC[0]][lineC[1]] !== "G"
      ) {
        let i = Math.floor(r / 2);
        squares[i][c] = TURN;
        console.log("right square detected");
        addScore(TURN);
        showSquareLabel(i, c);
      }
    }

    if (c != 0) {
      //left square
      let lineD = [r - 1, c - 1];
      let lineE = [r, c - 1];
      let lineF = [r + 1, c - 1];
      if (
        lines[lineD[0]][lineD[1]] !== "G" &&
        lines[lineE[0]][lineE[1]] !== "G" &&
        lines[lineF[0]][lineF[1]] !== "G"
      ) {
        let i = Math.floor(r / 2);
        squares[i][c - 1] = TURN;
        console.log("left square detected");
        addScore(TURN);
        showSquareLabel(i, c - 1);
      }
    }
  } else {
    if (r != 0) {
      //top square
      let lineA = [r - 1, c];
      let lineB = [r - 2, c];
      let lineC = [r - 1, c + 1];

      if (
        lines[lineA[0]][lineA[1]] !== "G" &&
        lines[lineB[0]][lineB[1]] !== "G" &&
        lines[lineC[0]][lineC[1]] !== "G"
      ) {
        let i = Math.floor(r / 2) - 1;
        squares[i][c] = TURN;
        console.log("top square detected");
        addScore(TURN);
        showSquareLabel(i, c);
      }
    }

    if (r <= lines.length - 2) {
      //bottom
      let lineD = [r + 1, c];
      let lineE = [r + 2, c];
      let lineF = [r + 1, c + 1];

      if (
        lines[lineD[0]][lineD[1]] !== "G" &&
        lines[lineE[0]][lineE[1]] !== "G" &&
        lines[lineF[0]][lineF[1]] !== "G"
      ) {
        let i = Math.floor(r / 2);
        squares[i][c] = TURN;
        console.log("bottom square detected");
        addScore(TURN);
        showSquareLabel(i, c);
      }
    }
  }
}

function testFinishGame() {
  lines = [
    [PLAYER_ONE, PLAYER_TWO, PLAYER_ONE],
    [PLAYER_TWO, PLAYER_ONE, PLAYER_ONE, PLAYER_TWO],
    [PLAYER_ONE, PLAYER_TWO, PLAYER_ONE],
    [PLAYER_ONE, PLAYER_TWO, PLAYER_ONE, PLAYER_TWO],
    [PLAYER_ONE, PLAYER_TWO, PLAYER_ONE],
    [PLAYER_ONE, PLAYER_TWO, PLAYER_ONE, PLAYER_TWO],
    [PLAYER_ONE, PLAYER_TWO, "G"],
  ];
  //red
  drawLine(6, 2);
}

function testScoreAndTurn() {
  //red
  drawLine(0, 0);
  //blue
  drawLine(1, 1);
  //red
  drawLine(2, 0);
  //blue
  drawLine(1, 0);

  //B = 1 VS R = 0
  if (B_SCORE !== 1 && R_SCORE !== 0) {
    console.log("%c" + "Bug! [SCORE]", "color:red");
  }

  //TURN = B
  if (TURN !== PLAYER_TWO) {
    console.log("%c" + "Bug! [TURN]", "color:red");
  }

  //blue
  drawLine(2, 1);
  //red
  drawLine(3, 2);
  //blue
  drawLine(4, 1);
  //red
  drawLine(3, 1);

  //B = 1 VS R = 1
  if (B_SCORE !== 1 && R_SCORE !== 1) {
    console.log("%c" + "Bug! [SCORE]", "color:red");
  }

  //TURN = R
  if (TURN !== PLAYER_ONE) {
    console.log("%c" + "Bug! [TURN]", "color:red");
  }
}
