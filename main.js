// main.js
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

console.log("Now the fun is about to start!");

let x = width / 10;
let y = height / 10;

// Iteration 1
function drawGrid() {
  context.beginPath();

  for (let i = 1; i < 10; i++) {
    context.moveTo(x * i, 0);
    context.lineTo(x * i, height);
  }
  for (let i = 1; i < 10; i++) {
    context.moveTo(0, y * i);
    context.lineTo(width, y * i);
  }
  context.moveTo(0, y * 9);
  context.closePath();
  context.stroke();
}
// Iteration 2 + 3 + Bonus: Iteration 6 (Stop the player at the edges of the board.)
// Add a property direction to the player and display a different image based on the direction.
class Character {
  constructor(name, row, col, scoreElement, playerNumber) {
    this.name = name;
    this.row = row;
    this.col = col;
    this.score = 0;
    this.scoreElement = scoreElement;
    this.img = new Image();
    this.direction = "down";
    this.movement = 0;
    this.playerNumber = playerNumber;
  }

  moveUp() {
    if (this.row > 0) {
      this.row -= 1;
      this.direction = "up";
      this.movement++;
    }
  }
  moveRight() {
    if (this.col < 9) {
      this.col += 1;
      this.direction = "right";
      this.movement++;
    }
  }
  moveDown() {
    if (this.row < 9) {
      this.row += 1;
      this.direction = "down";
      this.movement++;
    }
  }
  moveLeft() {
    if (this.col > 0) {
      this.col -= 1;
      this.direction = "left";
      this.movement++;
    }
  }
  changePlayerImg() {
    this.img.setAttribute(
      "src",
      `./images/character${this.playerNumber}-${this.direction}.png`
    );
  }
  drawPlayer() {
    this.changePlayerImg();
    this.img.addEventListener("load", () => {
      context.drawImage(this.img, this.col * x, this.row * y, x, y);
    });
  }
  drawScores() {
    this.scoreElement.innerHTML = `${this.name} have collected <b>${this.score}</b> treasures!`;
  }
  drawWinScores() {
    this.scoreElement.innerHTML = `${this.name} have collected <b>${this.score}</b> treasures!`;
  }
}

// Iteration 4
class Treasure {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.img = new Image();
    this.img.src = "./images/treasure.png";
  }

  checkForIntersection(item) {
    return this.row === item.row && this.col === item.col;
  }

  setRandomPosition() {
    this.row = Math.floor(Math.random() * 9);
    this.col = Math.floor(Math.random() * 9);
    console.log("row: " + this.row);
    console.log("col: " + this.col);
  }
  drawTreasure() {
    //this is for first time
    this.img.addEventListener("load", () => {
      context.drawImage(this.img, this.col * x, this.row * y, x, y);
    });
    // other times with drawing
    context.drawImage(this.img, this.col * x, this.row * y, x, y);
  }
}

const scoreElement1 = document.getElementById("score1");
const scoreElement2 = document.getElementById("score2");
const countTimeElement = document.getElementById("count_time");

// Iteration 5
class Game {
  constructor(gameScreenElement, gameOverScreenElement, countTimeElement) {
    this.gameScreenElement = gameScreenElement;
    this.gameOverScreenElement = gameOverScreenElement;
    this.countTimeElement = countTimeElement;
    this.intervalId;
    this.reset();
  }

  reset() {
    this.player1 = new Character("Mojeeb Rahman", 0, 0, scoreElement1, "");
    this.player2 = new Character("Player 2", 0, 9, scoreElement2, "2");
    this.treasure = new Treasure(0, 0);
    this.treasure.setRandomPosition();
    this.enemies = [];
    this.remainTime = 180;
  }

  treasurePlayer(treasure, player) {
    if (treasure.checkForIntersection(player)) {
      treasure.setRandomPosition();
      player.score += 1;
    }
  }

  addEnableControls(event, player, left, right, up, down) {
    switch (event.code) {
      case left:
        console.log("left");
        player.moveLeft();
        break;
      case up:
        console.log("up");
        player.moveUp();
        break;
      case right:
        console.log("right");
        player.moveRight();
        break;
      case down:
        console.log("down");
        player.moveDown();
        break;
    }
  }

  runLogic() {
    window.addEventListener("keydown", (event) => {
      // Stop the default behavior (moving the screen to the left/up/right/down)
      event.preventDefault();

      this.addEnableControls(
        event,
        this.player1,
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
      );

      this.addEnableControls(
        event,
        this.player2,
        "KeyA",
        "KeyD",
        "KeyW",
        "KeyS"
      );

      this.treasurePlayer(this.treasure, this.player1);
      this.treasurePlayer(this.treasure, this.player2);

      context.clearRect(0, 0, width, height);
      this.drawEverything();
    });
  }

  drawEverything() {
    drawGrid();
    this.player1.drawPlayer();
    this.player1.drawScores();
    this.player2.drawPlayer();
    this.player2.drawScores();
    this.treasure.drawTreasure();
  }

  gameOver() {
    this.gameScreenElement.style.display = "none";
    this.gameOverScreenElement.style.display = "";
    this.countTimeElement.innerHTML = "";
    this.player1.drawWinScores();
    this.player2.drawWinScores();
    clearInterval(this.intervalId);
    this.reset();
  }

  displayScores() {
    this.countTimeElement.innerHTML = `${this.remainTime} Sec!`;
  }

  countTimeDown() {
    this.remainTime -= 1;

    if (this.remainTime === 0) {
      this.gameOver();
    }

    this.displayScores();
    console.log(this.remainTime);
  }

  start() {
    this.reset();
    this.drawEverything();
    this.runLogic();

    this.intervalId = setInterval(() => {
      this.countTimeDown();
    }, 1000);
  }
}

const startScreenElement = document.getElementById("game_start_screen");
const gameScreenElement = document.getElementById("game_screen");
const gameOverScreenElement = document.getElementById("game_over_screen");

const startButton = startScreenElement.querySelector("button");
const playAgainButton = gameOverScreenElement.querySelector("button");

const game = new Game(
  gameScreenElement,
  gameOverScreenElement,
  countTimeElement
);

startButton.addEventListener("click", () => {
  game.start();

  startScreenElement.style.display = "none";
  gameScreenElement.style.display = "";
});

playAgainButton.addEventListener("click", () => {
  game.start();

  gameOverScreenElement.style.display = "none";
  gameScreenElement.style.display = "";
});

// // Refactoring the codes
// player.moveDown(); // Increase by 1 the value of player.row
// player.moveDown(); // Increase by 1 the value of player.row
// player.moveRight(); // Increase by 1 the value of player.col

// console.log(player.col, player.row); // => 1,2

// Iteration 3

// function drawPlayer() {
//   player.changePlayerImg();
//   player.img.addEventListener("load", () => {
//     context.drawImage(player.img, player.col * x, player.row * y, x, y);
//   });
// }

// function drawTreasure() {
//   //this is for first time
//   treasurePlayer.img.addEventListener("load", () => {
//     context.drawImage(
//       treasurePlayer.img,
//       treasurePlayer.col * x,
//       treasurePlayer.row * y,
//       x,
//       y
//     );
//   });
//   // other times with drawing
//   context.drawImage(
//     treasurePlayer.img,
//     treasurePlayer.col * x,
//     treasurePlayer.row * y,
//     x,
//     y
//   );
// }
