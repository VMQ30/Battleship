import { Ship, Player, GameController } from "./class.js";

(function () {
  setUpUI();
  getPlayerName();
})();

function closeModal() {
  const modal = document.querySelector(".modal-container");
  modal.style.display = "none";
  document.body.classList.remove("no-scroll");
}

function getPlayerName() {
  document.body.classList.add("no-scroll");
  const button = document.querySelector(".play-button");

  button.addEventListener("click", () => {
    const name = document.querySelector(".name").value;

    if (!name) {
      createErrorMessage("*Error: Name is Required");
    } else if (name.length < 2) {
      createErrorMessage("*Error: Name is too short");
    } else if (name.length > 12) {
      createErrorMessage("*Error: Name is too long");
    } else {
      closeModal();
      const player = createPlayer(name);
      setUpGame(player);
    }
  });
}

function createErrorMessage(message) {
  const inputBox = document.querySelector(".error-message");
  inputBox.innerHTML = "";
  const error = document.createElement("p");
  error.textContent = message;
  error.classList.add("error");
  inputBox.appendChild(error);
}
//Setup
function setUpGame(player) {
  setUpShipPlacement(player);
  setUpGameControls(player);
}

function setUpUI() {
  openShipPlacement();
  renderingBoardCells();
  toggleOrientationButton();
}

function setUpShipPlacement(player) {
  hoverShip(player);
  enableAutoDeploy(player);
}

function setUpGameControls(player) {
  resetGame(player);
}

//Board Rendering

function renderingBoardCells() {
  const gridSize = 11;
  const grids = document.querySelectorAll(".game-grid");
  grids.forEach((grid) => {
    grid.innerHTML = "";
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        createCell(i, j, grid);
      }
    }
  });
}

function createCell(i, j, grid) {
  const cell = document.createElement("div");

  if (i === 0 && j === 0) cell.classList.add("game-header");
  else if (i === 0) {
    const letterHeader = document.createElement("p");
    letterHeader.textContent = String.fromCharCode(65 + (j - 1));
    cell.appendChild(letterHeader);
    cell.classList.add("game-header");
  } else if (j === 0) {
    const letterHeader = document.createElement("p");
    letterHeader.textContent = i;
    cell.appendChild(letterHeader);
    cell.classList.add("game-header");
  } else {
    cell.dataset.row = i - 1;
    cell.dataset.col = j - 1;
    cell.setAttribute(
      "aria-label",
      `Row ${i} Column ${String.fromCharCode(64 + j)}`
    );
    cell.classList.add("cell");
  }

  grid.appendChild(cell);
}

//UI Controls

function openMainGame() {
  const mainGameScreen = document.querySelector(".main-game");
  const shipPlacementScreen = document.querySelector(".ship-placement");
  mainGameScreen.style.display = "flex";
  shipPlacementScreen.style.display = "none";
}

function openShipPlacement() {
  const mainGameScreen = document.querySelector(".main-game");
  const shipPlacementScreen = document.querySelector(".ship-placement");
  mainGameScreen.style.display = "none";
  shipPlacementScreen.style.display = "flex";
}

function toggleOrientationButton() {
  const toggleButton = document.querySelector(".ship-orientation");
  toggleButton.addEventListener("click", () => {
    const orientation = toggleButton.getAttribute("data-orientation");
    if (orientation === "horizontal") {
      toggleButton.dataset.orientation = "vertical";
      toggleButton.textContent = "Vertical";
    } else {
      toggleButton.dataset.orientation = "horizontal";
      toggleButton.textContent = "Horizontal";
    }
  });
}

function beginGame(player) {
  const beginGame = document.querySelector(".begin-game");
  const playerOneMainGrid = document.querySelector(".player-one .game-grid");

  beginGame.addEventListener("click", () => {
    console.log(player);
    openMainGame();
    setUpEnemyGrid(player);
    styleAllShipsOnGrid(player, playerOneMainGrid);
  });
}

function styleAllShipsOnGrid(player, grid) {
  player.gameboard.ships.forEach((ship) => {
    const { length, coordinates, orientation } = ship;
    markShipCells(coordinates[0], coordinates[1], orientation, length, grid);
  });
}

//Ship Placements

function hoverShip(player) {
  const ships = document.querySelectorAll(".ships");
  const currentGrid = document.querySelector(".place-ships");
  const cells = currentGrid.querySelectorAll(".cell");

  let selectedShip = { size: 0, name: "" };

  ships.forEach((ship) => {
    ship.addEventListener("click", () => {
      highlightSelectedShip(ship);
      selectedShip = getShipDetails(ship);
    });
  });

  cells.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      highlightCell(cell, currentGrid, selectedShip.size);
    });

    cell.addEventListener("mouseleave", () => {
      removeHighlight(cells);
    });

    cell.addEventListener("click", () => {
      const isShipPlaced = cellClicked(
        selectedShip.size,
        player,
        selectedShip.name,
        cell
      );
      if (isShipPlaced) {
        selectedShip = { size: 0, name: "" };
      }
    });
  });
}

function getOrientation() {
  return document
    .querySelector(".ship-orientation")
    .getAttribute("data-orientation");
}

function getPlacementGrid() {
  return document.querySelector(".place-ships");
}

function cellClicked(shipSize, player, shipName, cell) {
  if (shipSize === 0) return alert("Pick a Ship");

  const colCords = Number(cell.getAttribute("data-col"));
  const rowCords = Number(cell.getAttribute("data-row"));
  const orientation = getOrientation();
  const grid = getPlacementGrid();

  const isPlaced = placeShip(
    shipSize,
    rowCords,
    colCords,
    orientation,
    player,
    shipName
  );

  if (isPlaced) {
    styleShipPlaced(
      rowCords,
      colCords,
      orientation,
      shipSize,
      shipName,
      player,
      grid
    );
  }

  return isPlaced;
}

function styleShipPlaced(
  rowCords,
  colCords,
  orientation,
  shipSize,
  shipName,
  player,
  grid
) {
  markShipCells(rowCords, colCords, orientation, shipSize, grid);
  checkIfAllShipsArePlaced(player);
  const shipButton = document.querySelector(`[data-name='${shipName}']`);
  disableShip(shipButton);
}

function placeShip(
  shipSize,
  rowCords,
  colCords,
  orientation,
  player,
  shipName
) {
  const newShip = new Ship(shipSize, shipName, orientation);
  return player.gameboard.placeShip(newShip, rowCords, colCords, orientation);
}

function enableAutoDeploy(player) {
  const autoDeployButton = document.querySelector(".auto-deploy");
  const grid = getPlacementGrid();
  autoDeployButton.addEventListener("click", () => {
    clearBoard(player);
    clearMarkedShippCells();
    autoDeploy(player, true, grid);
  });
}

function getShipDetails(ship) {
  return {
    size: Number(ship.getAttribute("data-ship")),
    name: ship.getAttribute("data-name"),
  };
}

//Ship Highlighting / Styling

function highlightSelectedShip(ship) {
  removeSelectedShip();
  ship.classList.add("selected-ship");
}

function removeSelectedShip() {
  const ships = document.querySelectorAll(".ships");
  ships.forEach((ship) => {
    ship.classList.remove("selected-ship");
    ship.style.pointerEvents = "all";
  });
}

function disableShip(ship) {
  ship.classList.add("disable-ship");
  ship.style.pointerEvents = "none";
}

function removeDisableShip() {
  const ships = document.querySelectorAll(".ships");
  ships.forEach((ship) => {
    ship.classList.remove("disable-ship");
  });
}

function highlightCell(cell, currentGrid, shipSize) {
  const colCords = Number(cell.getAttribute("data-col"));
  const rowCords = Number(cell.getAttribute("data-row"));
  const orientation = document
    .querySelector(".ship-orientation")
    .getAttribute("data-orientation");

  let selectedCells = [];

  for (let i = 0; i < shipSize; i++) {
    const newCells =
      orientation === "vertical"
        ? getCell(rowCords + i, colCords, currentGrid)
        : getCell(rowCords, colCords + i, currentGrid);
    selectedCells.push(newCells);
  }

  selectedCells.forEach((selectedCell) => {
    selectedCell.classList.add("selected");
  });
}

function removeHighlight(cells) {
  cells.forEach((selectedCell) => {
    selectedCell.classList.remove("selected");
  });
}

function markShipCells(rowCords, colCords, orientation, shipSize, currentGrid) {
  for (let i = 0; i < shipSize; i++) {
    const newCells =
      orientation === "vertical"
        ? getCell(rowCords + i, colCords, currentGrid)
        : getCell(rowCords, colCords + i, currentGrid);
    newCells.classList.add("has-ship");
  }
}

function clearMarkedShippCells() {
  const shipCells = document.querySelectorAll(".has-ship");
  const missedCells = document.querySelectorAll(".miss");
  const hitCells = document.querySelectorAll(".hit");
  shipCells.forEach((cell) => {
    cell.classList.remove("has-ship");
  });

  missedCells.forEach((cell) => {
    cell.classList.remove("miss");
  });

  hitCells.forEach((cell) => {
    cell.classList.remove("hit");
  });
}

function getCell(row, col, grid) {
  return grid.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

//Auto Deploy

function getRandomOrientation() {
  const orientation = ["vertical", "horizontal"];
  return orientation[randomNum(2) % 2];
}

function autoDeploy(player, style = true, grid) {
  const shipInfo = {
    Carrier: 5,
    Battleship: 4,
    Cruiser: 3,
    Submarine: 3,
    Destroyer: 2,
  };

  for (const shipName in shipInfo) {
    const shipSize = shipInfo[shipName];
    let isShipPlaced = false;

    while (!isShipPlaced) {
      const randomCol = randomNum(10);
      const randomRow = randomNum(10);
      const randomOrientation = getRandomOrientation();

      isShipPlaced = placeShip(
        shipSize,
        randomRow,
        randomCol,
        randomOrientation,
        player,
        shipName
      );
      if (isShipPlaced && style) {
        styleShipPlaced(
          randomRow,
          randomCol,
          randomOrientation,
          shipSize,
          shipName,
          player,
          grid
        );
      }
    }
  }
}

function randomNum(max) {
  return Math.floor(Math.random() * max);
}

//Game Control

function checkIfAllShipsArePlaced(player) {
  if (player.gameboard.ships.length === 5) {
    document.querySelector(".begin-game").disabled = false;
    beginGame(player);
  }
}

function clearBoard(player) {
  player.gameboard.clearPlayerBoard();
}

function resetGame(player) {
  const resetButtons = document.querySelectorAll(".reset");

  resetButtons.forEach((resetButton) => {
    resetButton.addEventListener("click", () => {
      player.gameboard.clearPlayerBoard();
      player.reset();
      clearMarkedShippCells();
      openShipPlacement();
      removeSelectedShip();
      removeDisableShip();
      document.querySelector(".begin-game").disabled = true;
    });
  });
}

//Game Setup

function createPlayer(name) {
  const playerOne = new Player(name);
  return playerOne;
}

//begin game

function enemyTurn(controller) {
  const instructions = document.querySelector(".instructions-text");
  enemyTurnStyling(instructions);

  setTimeout(() => {
    enemyAttack(controller.player, controller.enemy);
    controller.endEnemyTurn();
    playerTurnStyling(instructions);
  }, 1000);
}

function enemyTurnStyling(instructions) {
  const enemyGrid = document.querySelector(".player-two-grid-wrapper");
  const playerGrid = document.querySelector(".player-one-grid-wrapper");

  playerGrid.classList.add("active");
  enemyGrid.classList.remove("active");
  instructions.textContent = "Enemy's turn...";
}

function playerTurnStyling(instructions) {
  const enemyGrid = document.querySelector(".player-two-grid-wrapper");
  const playerGrid = document.querySelector(".player-one-grid-wrapper");

  enemyGrid.classList.add("active");
  playerGrid.classList.remove("active");
  instructions.textContent = "Your Turn - Select a Target";
}

function getAdjacentCells(row, col) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => r >= 0 && r < 10 && c >= 0 && c < 10);
}

function isCellUntouched(board, row, col) {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return false;
  }

  return board[row][col] !== "hit" && board[row][col] !== "miss";
}

function determineDirection(enemy) {
  const [[r1], [r2]] = enemy.hitStack;
  enemy.direction = r1 === r2 ? "horizontal" : "vertical";

  enemy.targetQueue = enemy.hitStack
    .flatMap(([r, c]) =>
      enemy.direction === "horizontal"
        ? [
            [r, c - 1],
            [r, c + 1],
          ]
        : [
            [r - 1, c],
            [r + 1, c],
          ]
    )
    .filter(([r, c]) => isCellUntouched(enemy.gameboard.board, r, c)); // only untouched cells
}

function resetEnemyAI(enemy) {
  enemy.mode = "hunt";
  enemy.hitStack = [];
  enemy.targetQueue = [];
  enemy.direction = null;
}

function huntAttack(player) {
  let row, col;

  do {
    row = randomNum(10);
    col = randomNum(10);
  } while (!isCellUntouched(player.gameboard.board, row, col));

  return [row, col];
}

function targetAttack(player, enemy) {
  while (enemy.targetQueue.length) {
    const [row, col] = enemy.targetQueue.shift();
    if (isCellUntouched(player.gameboard.board, row, col)) return [row, col];
  }

  resetEnemyAI(enemy);
  return huntAttack(player);
}

function enemyAttack(player, enemy) {
  let row, col;

  if (enemy.mode === "hunt") {
    [row, col] = huntAttack(player);
  } else {
    [row, col] = targetAttack(player, enemy);
  }

  const grid = document.querySelector(".player-one-grid");
  const cell = grid.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );

  const isHit = checkIfShipIsHit(cell, player, enemy);

  if (isHit) {
    enemy.hitStack.push([row, col]);

    if (enemy.mode === "hunt") {
      enemy.mode = "target";
      enemy.targetQueue = getAdjacentCells(row, col);
    }

    if (enemy.hitStack.length === 2 && !enemy.direction) {
      determineDirection(enemy);
    }
  } else if (enemy.mode === "target" && enemy.targetQueue.length === 0) {
    resetEnemyAI(enemy);
  }
}

function getEnemyGrid() {
  return document.querySelector(".player-two-grid");
}

function setUpEnemyGrid(player) {
  const grid = getEnemyGrid();
  const enemy = createPlayer("Enemy");

  autoDeploy(enemy, false, grid);
  const controller = new GameController(player, enemy);
  enemyGrid(enemy, player, controller);
}

function enemyGrid(enemy, player, controller) {
  const enemyGrid = getEnemyGrid();
  const cells = enemyGrid.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      console.log(enemy);
      if (!controller.canPlayerAct()) return;

      checkIfShipIsHit(cell, enemy, player);

      controller.endPlayerTurn();
      enemyTurn(controller);
    });
  });
}

function winGame(player, enemy) {
  document.body.classList.add("no-scroll");

  const modalContainer = document.querySelector(".modal-container");
  modalContainer.style.display = "flex";

  createWinningModal(player);
  const playGame = document.querySelector(".play-again");

  playGame.addEventListener("click", () => {
    document.body.classList.remove("no-scroll");
    modalContainer.style.display = "none";
    fullRestart(player, enemy);
  });
}

function fullRestart(player, enemy) {
  player.reset();
  enemy.reset();
  clearMarkedShippCells();
  openShipPlacement();
  removeSelectedShip();
  removeDisableShip();
  document.querySelector(".begin-game").disabled = true;
}

function createWinningModal(player) {
  const modal = document.querySelector(".modal");

  modal.innerHTML = `
            <div class = 'title'>
                <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3ZM13 5.82929C14.1652 5.41746 15 4.30622 15 3C15 1.34315 13.6569 0 12 0C10.3431 0 9 1.34315 9 3C9 4.30622 9.83481 5.41746 11 5.82929V8H8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H11V20.9381C7.57272 20.5107 4.81871 17.9154 4.15356 14.5678L5.29289 15.7071C5.68342 16.0976 6.31658 16.0976 6.70711 15.7071C7.09763 15.3166 7.09763 14.6834 6.70711 14.2929L3.70711 11.2929C3.42111 11.0069 2.99099 10.9213 2.61732 11.0761C2.24364 11.2309 2 11.5955 2 12V13C2 18.5228 6.47715 23 12 23C17.5228 23 22 18.5228 22 13V12C22 11.5955 21.7564 11.2309 21.3827 11.0761C21.009 10.9213 20.5789 11.0069 20.2929 11.2929L17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L19.8464 14.5678C19.1813 17.9154 16.4273 20.5107 13 20.9381V10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H13V5.82929Z" fill="#e6b31a"></path> </g></svg>
                <h2 id = 'modal-title'>BATTLESHIP</h2>
                <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3ZM13 5.82929C14.1652 5.41746 15 4.30622 15 3C15 1.34315 13.6569 0 12 0C10.3431 0 9 1.34315 9 3C9 4.30622 9.83481 5.41746 11 5.82929V8H8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H11V20.9381C7.57272 20.5107 4.81871 17.9154 4.15356 14.5678L5.29289 15.7071C5.68342 16.0976 6.31658 16.0976 6.70711 15.7071C7.09763 15.3166 7.09763 14.6834 6.70711 14.2929L3.70711 11.2929C3.42111 11.0069 2.99099 10.9213 2.61732 11.0761C2.24364 11.2309 2 11.5955 2 12V13C2 18.5228 6.47715 23 12 23C17.5228 23 22 18.5228 22 13V12C22 11.5955 21.7564 11.2309 21.3827 11.0761C21.009 10.9213 20.5789 11.0069 20.2929 11.2929L17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L19.8464 14.5678C19.1813 17.9154 16.4273 20.5107 13 20.9381V10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H13V5.82929Z" fill="#e6b31a"></path> </g></svg>
            </div>

            <div class = 'name-input'>
                <h3>${player.name} Has Won the Game!</h3>
                <p>Play Again?</p>
            </div>
            <button class = 'play-again' aria-label = 'Play Game Again'>Play Game</button>`;
}

function checkIfPlayerHasNoShip(playerOne, playerTwo) {
  const hasNoShips = playerTwo.gameboard.noShips();

  if (hasNoShips) winGame(playerOne, playerTwo);
}

function checkIfShipIsHit(cell, player, enemy) {
  const col = Number(cell.getAttribute("data-col"));
  const row = Number(cell.getAttribute("data-row"));
  const isHit = player.gameboard.receiveAttack(row, col);

  if (isHit) cellHit(cell);
  else cellMiss(cell);

  checkIfPlayerHasNoShip(player, enemy);

  return isHit;
}

function cellHit(cell) {
  cell.classList.add("hit");
  cell.classList.remove("has-ship");
}

function cellMiss(cell) {
  cell.classList.add("miss");
  cell.classList.remove("has-ship");
}
