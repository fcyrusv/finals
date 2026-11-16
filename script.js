var numSelected = null;
var errors = 0;
var maxErrors = 3;
var gameOver = false;
var timeLeft = 0;
var timerId = null;
var solution = {};

var winStreak = 0;
var bestStreak = 0;

window.onload = function() {
    if (localStorage.getItem("winStreak") != null){
        winStreak = parseInt(localStorage.getItem("winStreak"));
    }
    if (localStorage.getItem("bestStreak") != null){
        bestStreak = parseInt(localStorage.getItem("bestStreak"));
    }

    for (let i = 1; i <= 9; i++){
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        number.addEventListener("click", selectNumber);
        document.getElementById("digits").appendChild(number);
    }
}

function playGame(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    newGame();
}

function backToMenu(){
    clearInterval(timerId);
    document.getElementById("game").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function newGame(){
    errors = 0;
    gameOver = false;
    maxErrors = parseInt(document.getElementById("limitSelect").value);
    document.getElementById("board").innerHTML = "";

    let digits = [1,2,3,4,5,6,7,8,9].sort(function(){ return Math.random() - 0.5; });

    for (let r = 0; r < 9; r++){
        for (let c = 0; c < 9; c++){
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.classList.add("tile");

            let answer = digits[(3 * (r % 3) + Math.floor(r / 3) + c) % 9];
            solution[tile.id] = answer;

            if (Math.random() < 0.5){
                tile.innerText = answer;
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5){
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5){
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            document.getElementById("board").append(tile);
        }
    }

    clearInterval(timerId);
    timeLeft = parseInt(document.getElementById("timerSelect").value);
    if (timeLeft > 0){
        showTime();
        timerId = setInterval(tick, 1000);
    }
    else{
        document.getElementById("timer").innerText = "No timer";
    }

    showErrors();
    showStats();
}

function showStats(){
    document.getElementById("stats").innerText = "Win streak: " + winStreak + "  |  Highest win streak: " + bestStreak;
}

function showErrors(){
    if (maxErrors == 0){
        document.getElementById("errors").innerText = "Mistakes: " + errors;
    }
    else{
        document.getElementById("errors").innerText = errors + " / " + maxErrors;
    }
}

function tick(){
    timeLeft = timeLeft - 1;
    showTime();
    if (timeLeft == 0){
        lose("Time's up!");
    }
}

function showTime(){
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}

function lose(message){
    clearInterval(timerId);
    gameOver = true;
    winStreak = 0;
    localStorage.setItem("winStreak", winStreak);
    showStats();
    alert(message);
}

function win(){
    clearInterval(timerId);
    gameOver = true;

    winStreak = winStreak + 1;
    localStorage.setItem("winStreak", winStreak);

    let message = "You win! Win streak: " + winStreak;
    if (winStreak > bestStreak){
        bestStreak = winStreak;
        localStorage.setItem("bestStreak", bestStreak);
        message = message + " (new highest win streak!)";
    }

    showStats();
    alert(message);
}

function checkWin(){
    for (let r = 0; r < 9; r++){
        for (let c = 0; c < 9; c++){
            if (document.getElementById(r + "-" + c).innerText == ""){
                return false;
            }
        }
    }
    return true;
}

function selectNumber(){
    if (numSelected != null){
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile(){
    if (gameOver || numSelected == null || this.innerText != ""){
        return;
    }

    if (solution[this.id] == numSelected.id){
        this.innerText = numSelected.id;
        if (checkWin()){
            win();
        }
    }
    else{
        errors = errors + 1;
        showErrors();
        if (errors == maxErrors){
            lose("Game over! Too many mistakes.");
        }
    }
}