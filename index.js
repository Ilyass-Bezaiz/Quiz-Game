//--------------------------------API-STUFF-----------------------------------------


const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';


//--------------------------------SELECTING-HTML-ELEMENTS-----------------------------------------

let gameLogo = document.querySelector(".game-logo");
let welcomeScreen = document.querySelector(".welcome-screen");
let gameScreen = document.querySelector(".game-screen");
let resultScreen = document.querySelector(".result-screen");
let difficulty = document.querySelector("#select-difficulty");
let category = document.querySelector("#select-category");
let progressBar = document.querySelector(".progress-bar");
let progressDetails = document.querySelector(".progress-details");
let errorMessage = document.querySelector(".error-message");
let questionZone = document.querySelector("#question");
let suggetionsContainer = document.querySelector(".suggestions-list");
let suggestions = document.querySelectorAll("li");
let textResult = document.querySelector(".text-result");
let btnStart = document.querySelector("#btn-start");
let btnNext = document.querySelector("#btn-next");
let btnDone = document.querySelector("#btn-done");
let audioGameStart = new Audio("/assets/audio/game-start.mp3");
let audioGoodAsnwer = new Audio("/assets/audio/success.mp3");
let audioWrongAnswer = new Audio("/assets/audio/wrong-answer.mp3");
let audioYouWin = new Audio("/assets/audio/you-win.mp3");
let audioGameOver = new Audio("/assets/audio/game-over.mp3");
let audioErrorMessage = new Audio("/assets/audio/error-message.mp3");

//-------------------------------VARIABLES-----------------------------------------

let myJsonData;
let questionIndex;
let score;
let correctIndex;

//-------------------------------EVENTS-------------------------------------------

suggetionsContainer.addEventListener("click", (e) => e.target.tagName == "LI" ? checkAnswer(e.target, myJsonData.results[questionIndex].correct_answer) : null);
btnStart.addEventListener("click", () => gameStart());
btnNext.addEventListener("click", (e) => nextQuestion(e));
btnDone.addEventListener("click", () => location.reload());
gameLogo.addEventListener("click", () => location.reload());

//-------------------------------FUNCTIONS-----------------------------------------

let gameStart = () => {
    fetchQuestions(difficulty.value);
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";  
    btnStart.style.display = "none";
    btnNext.style.display = "block";
    questionIndex = 0;
    score = 0;
}

let fetchQuestions = async (difficulty) => {
     
    try {        
        let response = await fetch(API_URL + `&difficulty=${difficulty}` + `&category=${category.value}`);
        let data = await response.json();   
        myJsonData = data;
        displayQuestion(questionIndex);        
    } catch(e) {
        console.log('Something went wrong!!');
        errorMessage.textContent = "PLEASE CHECK YOUR INTERNET";
        progressDetails.style.display = "none";
        errorMessage.style.display = "block";
        audioErrorMessage.play();
    }
}

let displayQuestion = (index) => {
    if(index < myJsonData.results.length) {
        questionZone.innerHTML = myJsonData.results[index].question;
        correctIndex = Math.floor(Math.random()* 4);
        let suggestionsIndex = 0;  
        audioGameStart.play();                     
        suggestions.forEach((suggestion, i)=> {
            if (correctIndex == i) {
                suggestion.innerHTML = myJsonData.results[index].correct_answer;
            } else {
                myJsonData.results[index].incorrect_answers[suggestionsIndex] != undefined ?
                suggestion.innerHTML = myJsonData.results[index].incorrect_answers[suggestionsIndex++]:
                suggestion.innerHTML = "";
            }
        });
    } else {
        displayResults();
    }
}

let nextQuestion = () => {
    let correctAnswer = document.querySelector(".checked-correct");
    let incorrectAnswer = document.querySelector(".checked-incorrect");
    if (correctAnswer != null) {
        ++questionIndex;
        displayQuestion(questionIndex);    
        correctAnswer.classList.remove("checked-correct");
        incorrectAnswer != null ? incorrectAnswer.classList.remove("checked-incorrect") : null;
        progressDetails.textContent = `${questionIndex+1}-${myJsonData.results.length}`;
        progressBar.value = questionIndex+1;        
    } else {
        errorMessage.textContent = "CHOOSE AN ANSWER";
        progressDetails.style.display = "none";
        errorMessage.style.display = "block";
        audioErrorMessage.play();
        setTimeout(() => {
            progressDetails.style.display = "block";
            errorMessage.style.display = "none";
        }, 1500);
    }
}

let checkAnswer = (answer, correct) => {    
    if (document.querySelector(".checked-correct") == null 
        && document.querySelector(".checked-incorrect") == null) {
        if (answer.textContent == correct) {
            answer.classList.add("checked-correct");        
            score+=1;
            audioGoodAsnwer.play();
        } else {
            answer.classList.add("checked-incorrect");
            let theLi = suggestions[correctIndex];
            theLi.classList.add("checked-correct");
            audioWrongAnswer.play();
        }
        console.log('my answer: ' + answer.textContent);
        console.log('correct answer: ' + correct);
        console.log(answer.textContent == correct);
    }
}

let displayResults = () => {
    resultScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    btnNext.style.display = 'none';
    textResult.textContent = `${score}/10`;
    btnNext.style.display = 'none';
    btnDone.style.display = 'block';
    score >= 5 ? audioYouWin.play() : audioGameOver.play();
}