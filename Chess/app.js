const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = "pink";
playerDisplay.textContent = "pink";

const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  king,
  queen,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    // square.classList.add("lightblue");
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "lightblue" : "blue");
    } else {
      square.classList.add(i % 2 === 0 ? "blue" : "lightblue");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("pink");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("green");
    }
    gameBoard.append(square);
  });
}

createBoard();

const allSquares = document.querySelectorAll("#gameboard .square");
//console.log(allSquares);
allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let dragedElement;

function dragStart(e) {
  //console.log(e.target.parentNode.getAttribute("square-id"));
  startPositionId = e.target.parentNode.getAttribute("square-id");
  dragedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  //console.log("playerGo", playerGo);
  //console.log("target", e.target);
  const correctGo = dragedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  //e.target.append(dragedElement);
  const opponentGo = playerGo === "green" ? "pink" : "green";
  // console.log("playerGo", playerGo);
  const takenByOponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    if (takenByOponent && valid) {
      e.target.parentNode.append(dragedElement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken) {
      infoDisplay.textContent = "Can't go here";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }
    if (valid) {
      e.target.append(dragedElement);
      checkForWin();
      changePlayer();
      return;
    }
  }
}

function changePlayer() {
  if (playerGo === "pink") {
    reverseIds();
    playerGo = "green";
    playerDisplay.textContent = "green";
  } else {
    revertIds();
    playerGo = "pink";
    playerDisplay.textContent = "pink";
  }
}

function reverseIds() {
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}

function revertIds() {
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}

function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);
  const piece = dragedElement.id;

  console.log("sterttid", startId);
  console.log("targetid", targetId);
  console.log("piece", piece);

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 - 1 === targetId ||
        startId + width * 2 + 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 + 2}"]`
              ).firstChild
          )) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId + width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 + 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId + width * 3 + 3}"]`
              ).firstChild) ||
              (startId + width * 5 + 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId + width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 + 4}"]`
                    ).firstChild) ||
                    startId + width * 6 + 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId + width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 + 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 5 + 5}"]`
                    ).firstChild) ||
                    (startId + width * 7 + 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId + width + 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId + width * 2 + 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 3 + 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 4 + 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 5 + 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 6 + 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //second direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 - 2}"]`
              ).firstChild
          )) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId - width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 - 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId - width * 3 - 3}"]`
              ).firstChild) ||
              (startId - width * 5 - 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId - width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 - 4}"]`
                    ).firstChild) ||
                    startId - width * 6 - 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId - width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 - 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 5 - 5}"]`
                    ).firstChild) ||
                    (startId - width * 7 - 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId - width - 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId - width * 2 - 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 3 - 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 4 - 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 5 - 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 6 - 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //third diretiom
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 + 2}"]`
              ).firstChild
          )) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId - width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 + 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId - width * 3 + 3}"]`
              ).firstChild) ||
              (startId - width * 5 + 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId - width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 + 4}"]`
                    ).firstChild) ||
                    startId - width * 6 + 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId - width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 + 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 5 + 5}"]`
                    ).firstChild) ||
                    (startId - width * 7 + 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId - width + 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId - width * 2 + 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 3 + 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 4 + 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 5 + 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 6 + 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //fourth direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 - 2}"]`
              ).firstChild
          )) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId + width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 - 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId + width * 3 - 3}"]`
              ).firstChild) ||
              (startId + width * 5 - 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId + width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 - 4}"]`
                    ).firstChild) ||
                    startId + width * 6 - 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId + width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 - 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 5 - 5}"]`
                    ).firstChild) ||
                    (startId + width * 7 - 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId + width - 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId + width * 2 - 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 3 - 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 4 - 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 5 - 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 6 - 6}"]`
                          ).firstChild
                      ))
                ))
          ))
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        //second direction
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        //third direction
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        //fourth direction
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "queen":
      //like bishop
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 + 2}"]`
              ).firstChild
          )) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId + width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 + 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId + width * 3 + 3}"]`
              ).firstChild) ||
              (startId + width * 5 + 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId + width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 + 4}"]`
                    ).firstChild) ||
                    startId + width * 6 + 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId + width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 + 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 5 + 5}"]`
                    ).firstChild) ||
                    (startId + width * 7 + 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId + width + 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId + width * 2 + 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 3 + 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 4 + 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 5 + 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 6 + 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //second direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 - 2}"]`
              ).firstChild
          )) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId - width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 - 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId - width * 3 - 3}"]`
              ).firstChild) ||
              (startId - width * 5 - 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId - width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 - 4}"]`
                    ).firstChild) ||
                    startId - width * 6 - 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId - width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 - 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 5 - 5}"]`
                    ).firstChild) ||
                    (startId - width * 7 - 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId - width - 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId - width * 2 - 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 3 - 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 4 - 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 5 - 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 6 - 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //third diretiom
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 + 2}"]`
              ).firstChild
          )) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId - width + 1}"]` &&
              !document.querySelector(
                `[square-id="${startId - width * 2 + 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId - width * 3 + 3}"]`
              ).firstChild) ||
              (startId - width * 5 + 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId - width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 + 4}"]`
                    ).firstChild) ||
                    startId - width * 6 + 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId - width + 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId - width * 2 + 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 3 + 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 4 + 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId - width * 5 + 5}"]`
                    ).firstChild) ||
                    (startId - width * 7 + 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId - width + 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId - width * 2 + 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 3 + 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 4 + 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 5 + 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId - width * 6 + 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //fourth direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 - 2}"]`
              ).firstChild
          )) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(
            (`[square-id="${startId + width - 1}"]` &&
              !document.querySelector(
                `[square-id="${startId + width * 2 - 2}"]`
              ).firstChild &&
              !document.querySelector(
                `[square-id="${startId + width * 3 - 3}"]`
              ).firstChild) ||
              (startId + width * 5 - 5 === targetId &&
                !document.querySelector(
                  (`[square-id="${startId + width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 - 4}"]`
                    ).firstChild) ||
                    startId + width * 6 - 6 === targetId
                ) &&
                !document.querySelector(
                  (`[square-id="${startId + width - 1}"]` &&
                    !document.querySelector(
                      `[square-id="${startId + width * 2 - 2}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 3 - 3}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 4 - 4}"]`
                    ).firstChild &&
                    !document.querySelector(
                      `[square-id="${startId + width * 5 - 5}"]`
                    ).firstChild) ||
                    (startId + width * 7 - 7 === targetId &&
                      !document.querySelector(
                        `[square-id="${startId + width - 1}"]` &&
                          !document.querySelector(
                            `[square-id="${startId + width * 2 - 2}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 3 - 3}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 4 - 4}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 5 - 5}"]`
                          ).firstChild &&
                          !document.querySelector(
                            `[square-id="${startId + width * 6 - 6}"]`
                          ).firstChild
                      ))
                ))
          )) ||
        //like rook
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        //second direction
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        //third direction
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        //fourth direction
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width + 1 === targetId ||
        startId + width - 1 === targetId ||
        startId - width + 1 === targetId ||
        startId - width - 1 === targetId
      ) {
        return true;
      }
  }
}

function checkForWin() {
  const kings = Array.from(document.querySelectorAll("#king"));

  if (!kings.some((king) => king.firstChild.classList.contains("green"))) {
    infoDisplay.innerHTML = "Pink wins!";
    //no more moves
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("pink"))) {
    infoDisplay.innerHTML = "Green wins!";
    //no more moves
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}
