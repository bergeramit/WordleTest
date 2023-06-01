import seedrandom from 'https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm'
import { WORDS } from "./words.js";
import Nakama from "./nakama.js";

const NUMBER_OF_GUESSES = 3; // 3 per user
const TOTAL_ROWS = 6; // total rows
let rightGuessString;

toastr.options.timeOut = 500;

class playerState {
  constructor(nextLetter) {
    this.nextLetter = nextLetter;
    this.guessesRemaining = NUMBER_OF_GUESSES;
    this.currentGuess = [];
  }
}

let player_local = new playerState(0);
let player_remote = new playerState(0);

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < TOTAL_ROWS; i++) {
    let row = document.createElement("div");
    if (i < 3) {
      row.className = "letter-row-local";
    } else {
      row.className = "letter-row-opponent";
    }

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
  Nakama.authenticate();
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function get_row_and_player(is_local) {
  if (is_local) {
    // top 3 rows
    return [document.getElementsByClassName("letter-row-local")[3 - player_local.guessesRemaining], player_local];
  } else {
    return [document.getElementsByClassName("letter-row-opponent")[3 - player_remote.guessesRemaining], player_remote];
  }
}

function deleteLetter(is_local) {
  let [row, player] = get_row_and_player(is_local);
  let box = row.children[player.nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  player.currentGuess.pop();
  player.nextLetter -= 1;
}

function checkGuess(is_local) {
  let [row, player] = get_row_and_player(is_local);
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of player.currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    toastr.error("Not enough letters!");
    return;
  }

  if (!WORDS.includes(guessString)) {
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = ["gray", "gray", "gray", "gray", "gray"];

  //check green
  for (let i = 0; i < 5; i++) {
    if (rightGuess[i] == player.currentGuess[i]) {
      letterColor[i] = "green";
      rightGuess[i] = "#";
    }
  }

  //check yellow
  //checking guess letters
  for (let i = 0; i < 5; i++) {
    if (letterColor[i] == "green") continue;

    //checking right letters
    for (let j = 0; j < 5; j++) {
      if (rightGuess[j] == player.currentGuess[i]) {
        letterColor[i] = "yellow";
        rightGuess[j] = "#";
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = letterColor[i];
      shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    player.guessesRemaining = 0;
    return;
  } else {
    player.guessesRemaining -= 1;
    player.currentGuess = [];
    player.nextLetter = 0;

    if (player.guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

function insertLetter(pressedKey, is_local) {
  let [row, player] = get_row_and_player(is_local);
  if (player.nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let box = row.children[player.nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  player.currentGuess.push(pressedKey);
  player.nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

function handle_key_entered(pressedKey, is_local) {
  let [row, player] = get_row_and_player(is_local);
  if (pressedKey === "Backspace" && player.nextLetter !== 0) {
    deleteLetter(is_local);
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess(is_local);
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey, is_local);
  }
}

function match_guess_target_callback(match_id) {
  var date = new Date();
  rightGuessString = WORDS[Math.floor(seedrandom(match_id + date.getHours().toString() + date.getMinutes().toString())() * WORDS.length)];
  console.log("Match's Word: "+rightGuessString);
}

document.addEventListener("keyup", (e) => {
  let pressedKey = String(e.key);
  Nakama.makeMove(pressedKey, handle_key_entered);
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;
  
  if (key == "Connect") {
    Nakama.createSocket(handle_key_entered);
    Nakama.findMatch(match_guess_target_callback);
    return;
  }

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

initBoard();
