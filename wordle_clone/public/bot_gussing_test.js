var inputValues = [];
var inputLength = 0;
var wordFreqDict;
var postURL = "http://64.226.100.123/bot/guess";

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
    inputBox.innerHTML = "Submit";
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
        mode: "no-cors",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "http://127.0.0.1/", //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        }, 
        body: JSON.stringify({input: input, level: botLevel})
      }).then((res) => {
        console.log("Request complete! response:", res.json());
      });
    // var guesses = get_guesses(input, botLevel);
    // const stringList = document.getElementById("string-list");

    // guesses.forEach((str) => {
    //     const listItem = document.createElement("li");
    //     listItem.textContent = str;
    //     stringList.appendChild(listItem);
    // });
  }