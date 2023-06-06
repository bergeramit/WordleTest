const cors = require('cors');
const express = require("express"); 
const path = require('path');
const bodyParser = require('body-parser');
const app = express(); // Initializing Express App
app.use(bodyParser.json());
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST']
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/bot/guess', function(req, res) {
    const guess = req.body.guess;
    const level = req.body.level;
    res.send({
      'guess': "test",
    });
  });

app.get('/script.js', function(req, res){
    res.sendFile(__dirname + '/public/script.js');
});

app.get('/favicon.ico', function(req, res){
    res.sendFile(__dirname + '/assets/favicon.ico');
});


app.get('/words.js', function(req, res){
    res.sendFile(__dirname + '/public/words.js');
});

app.get('/nakama.js', function(req, res){
    res.sendFile(__dirname + '/public/nakama.js');
});

app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/public/style.css');
});

app.listen(3000, ()=> console.log("App Listening on port 3000"));
