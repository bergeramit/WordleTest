const fs = require('fs');

var levels;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

fs.readFile("./public/levels_dataset.json", "utf8", (err, jsonString) => {
    if (err) {
    console.log("File read failed:", err);
    return;
    }
    levels = JSON.parse(jsonString);
    //console.log(levels[0].word);
});

function retrieve_level(difficulty_range) {
    console.log(difficulty_range);
    var lower = difficulty_range[0];
    var upper = difficulty_range[1];
    var level_difficulty = getRandomArbitrary(lower, upper);

    for(let i=0; i<levels.length;i++) {
        if (levels[i][0] < level_difficulty + 50 && levels[i][0] > level_difficulty - 50) {
            return levels[i][1];
        }
    }
}

module.exports.retrieve_level = retrieve_level;