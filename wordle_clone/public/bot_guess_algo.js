const fs = require('fs');

var wordFreqDict;

fs.readFile("./public/unigram_freq.json", "utf8", (err, jsonString) => {
    if (err) {
    console.log("File read failed:", err);
    return;
    }
    wordFreqDict = JSON.parse(jsonString);
    console.log(wordFreqDict[0].word);
});

function make_guess(input, level) {
    var filtered = filterWordsByPattern(wordFreqDict, input);
    if (filtered.length == 0) {
        return "No Word Exist!";
    } else if (filtered.length <= level ) {
        return filtered[filtered.length-1].word;
    }
    return filtered[level].word;
}

function filterWordsByPattern(inputJson, wordPattern) {
    const filteredWords = inputJson.filter(entry => {
      const { word } = entry;
      if (word.length !== wordPattern.length) {
        return false;
      }
      for (let i = 0; i < word.length; i++) {
        if (wordPattern[i] !== "_" && wordPattern[i] !== word[i]) {
          return false;
        }
      }
      return true;
    });
  
    return filteredWords;
  }  

module.exports.make_guess = make_guess;