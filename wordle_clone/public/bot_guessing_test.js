var inputValues = [];
var inputLength = 0;
var wordFreqDict;
var postURL = "http://64.226.100.123/bot/guess";
//var postURL = "http://127.0.0.1:3000/bot/guess";

// fs.readFile("unigram_freq.json", "utf8", (err, jsonString) => {
//     if (err) {
//       console.log("File read failed:", err);
//       return;
//     }
//     wordFreqDict = jsonString;
//   });

function createInputBoxes() {
    const quantityInput = document.getElementById("quantity");
    inputLength = parseInt(quantityInput.value);
  
    // Clear previous input boxes
    const inputContainer = document.getElementById("input-container");
    inputContainer.innerHTML = "";

    const tryButtonContainer = document.getElementById("try-to-guess");
    tryButtonContainer.innerHTML = "";
  
    // Generate new input boxes
    for (let i = 0; i < inputLength; i++) {
      const inputBox = document.createElement("input");
      inputBox.type = "text";
      inputBox.maxLength = 1;
      inputBox.oninput = handleInput;
      inputContainer.appendChild(inputBox);
    }

    const inputBox = document.createElement("Button");
    inputBox.innerHTML = "Guess";
    inputBox.onclick = bot_guess;
    tryButtonContainer.appendChild(inputBox);
  }
  

  function handleInput(event) {
    const index = Array.from(event.target.parentNode.children).indexOf(event.target);
    inputValues[index] = event.target.value;
  }

  function bot_guess() {
    const botLevel = document.getElementById("bot_level").value;
    for (let i = 0; i < inputLength; i++) {
        if (!(i in inputValues)) {
            inputValues[i] = "_";
        }
    }
    var input = inputValues.join("");
    fetch(postURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        }, 
        body: JSON.stringify({input: input.toLowerCase(), level: botLevel})
      }).then(response => {
        console.log(response.statusText);
        return response.json();
    })
    .then(data => {
            console.log(data.guess);
            const botGuess = document.getElementById("bot-guess");
            botGuess.innerHTML = data.guess;
        })
  }