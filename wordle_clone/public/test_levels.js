
//var postURL = "http://64.226.100.123/bot/guess";
var postURL = "http://127.0.0.1:3000/generate_level/";
var difficulty = "Medium";
var level;

const buttons = document.querySelectorAll('.pagination a');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => {
          btn.classList.remove('active');
        });

        button.classList.add('active');
        difficulty = button.textContent;
        console.log(difficulty);
      });
    });

function paint_current_level(current_level) {
    level = current_level;
    letters = Array.from(level[0]);
    console.log(letters );
    let board = document.getElementById("game-board");
    board.innerHTML = "";
    
    for (let i = 0; i < level.length; i++) {
        let row = document.createElement("div");
        row.className = "letter-local";
    
        console.log(level[i]);
        for (let j = 0; j < level[i].length; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
    
        board.appendChild(row);
    }

    const buttons = document.querySelectorAll('.keyboard-button');
    buttons.forEach((button) => {
      button.classList.remove('button-marked');
      button.style.color = "black";
      if (letters.includes(button.textContent)) {
        button.classList.add('button-marked');
        button.style.color = "white";
      }
    })
}

document.addEventListener("keyup", (e) => {
  let pressedKey = String(e.key);
  const guess = document.querySelectorAll('#input-guess');
  console.log("reached here");
  if (pressedKey === "Backspace") {
    guess.textContent = guess.textContent[guess.textContent.length - 2];
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
    guess.textContent = guess.textContent + pressedKey;
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
      return;
    }

    let key = target.textContent;
    
    if (key == "Generate Level") {
        fetch(postURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }, 
            body: JSON.stringify({"difficulty": difficulty})
          }).then(response => {
            console.log(response.statusText);
            return response.json();
        })
        .then(data => {
                console.log(data);
                paint_current_level(data);
            })
      return;
    }
  
    if (key === "Del") {
      key = "Backspace";
    }
  
    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
  });

function setup_starting_level() {
  fetch(postURL, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    }, 
    body: JSON.stringify({"difficulty": difficulty})
  }).then(response => {
    console.log(response.statusText);
    return response.json();
  })
  .then(data => {
          console.log(data);
          paint_current_level(data);
      })
}
setup_starting_level();