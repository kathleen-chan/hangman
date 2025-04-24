const start = document.getElementById("start");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addOrSub(){
    n1 = randomInt(1, 200);
    n2 = randomInt(1, 200);
    if(n1 < n2){
        [n1, n2] = [n2, n1];
    }
    return [n1, n2];
}

function mul(){
    n1 = randomInt(1, 20);
    n2 = randomInt(1, 20);
    return [n1, n2];
}

function div(){
    n1 = randomInt(1, 200)
    n2 = randomInt(1, 12)
    if (n1 % n2 != 0){
        n1 += (n2 - n1) % n2
    }
    return [n1, n2];
}

function generateFunction(){
    let qType = randomInt(1, 4);
    let ans = null;
    let op = null;
    let list;
    if (qType == 1){
        list = addOrSub();
        ans = list[0] + list[1];
        op = '+';
    } else if (qType == 2){
        list = addOrSub();
        ans = list[0] - list[1];
        op = '-';
    } else if (qType == 3){
        list = mul();
        ans = list[0] * list[1];
        op = '*';
    } else {
        list = div();
        ans = list[0] / list[1];
        op = '/';
    }
    ans = Math.round(ans);
    return { n1: list[0], n2: list[1], ans, op };
}

function checkAnswer(ans, userAns){
    return userAns === ans;
}

function startGame() {
    const startBtn = document.getElementById("startBtn");
    const inputBox = document.getElementById("ansBox");
    const scoreBox = document.getElementById("score");
    const feedback = document.getElementById("feedback");
    const checkBtn = document.getElementById("checkBtn");
    const question = document.getElementById("question");
    const timerBox = document.getElementById("timer");
    
    startBtn.style.display = "none";
    inputBox.style.display = "block";
    checkBtn.style.display = "block";
    scoreBox.style.display = "block";
    timerBox.style.display = "block";
    feedback.textContent = "";

    let currentAnswer = null;
    let timeLeft = 10;
    let score = 0;

    function showQuestion() {
        const { n1, n2, ans, op } = generateFunction();
        question.textContent = `What is ${n1} ${op} ${n2}?`;
        currentAnswer = ans;
    }

    function handleCheck() {
        const userAns = Number(inputBox.value);
        if (userAns === currentAnswer) {
            score++;
            feedback.textContent = "Correct!";
        } else {
            feedback.textContent = `Wrong! The correct answer was ${currentAnswer}`;
        }
        scoreBox.textContent = `Score: ${score}`;
        inputBox.value = "";
        showQuestion();
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") handleCheck();
    }

    inputBox.addEventListener("keypress", handleKeyPress);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerBox.textContent = `Time left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);  // stop timer
        }
    }, 1000);

    setTimeout(() => {
        inputBox.value = "";
        inputBox.removeEventListener("keypress", handleKeyPress);

        question.textContent = "Game Over!";
        inputBox.style.display = "none";
        checkBtn.style.display = "none";
        scoreBox.style.display = "none";
        feedback.textContent = `⏰ Time's up! Final score: ${score} \n`;
        startBtn.style.display = "block";
    }, timeLeft*1000);

    checkBtn.onclick = handleCheck;

    scoreBox.textContent = "Score: 0";
    question.textContent = "Get ready!";
    timerBox.textContent = `Time left: ${timeLeft}`;
    
    showQuestion();
}