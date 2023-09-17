// Selectors
let header = document.querySelector("header");
let countQuestions = document.querySelector(".questionNo span");
let start = document.querySelector(".start");
let userName = document.querySelector(".user-input");
let bodyHead = document.querySelector(".bodyHead");
let questionDiv = document.querySelector(".question-div");
let answerDiv = document.querySelector(".answers");
let btn = document.querySelector(".sub");
let main = document.querySelector("main");
let answerBtns = document.getElementsByName("answer");
let userCounter = document.querySelector(".timeCounter");
let finalResult = document.querySelector(".result span");
const modeBtn = document.querySelector(".dark-mode");
const body = document.querySelector("body");
const getMode = localStorage.getItem("mode");

// variables
let countQ = 0;
let score = 0;
let countdownInterval;
let user;

// Main
fetch("questions.json")
  .then((data) => {
    return data.json();
  })
  .then((questions) => {
    userName.onchange = () => {
      if (userName === "") {
        start.disable = true;
      } else {
        start.onclick = (e) => {
          user = userName.value;
          userName.remove();
          start.remove();
          questionDiv.classList.add("question");
          btn.style.display = "block";
          setNoQuestions(questions.length);
          setQuestions(questions[countQ], questions.length);
          countdown(60, questions.length);
          // when click next
          btn.onclick = () => {
            // Check if the answer is right and add to score
            checkAnswer(questions[countQ]["right_answer"]);
            // increment counter
            countQ++;
            // clear the question and answers
            questionDiv.innerHTML = "";
            answerDiv.innerHTML = "";
            // set new question
            setQuestions(questions[countQ], questions.length);
            setNoQuestions(questions.length);
            clearInterval(countdownInterval);
            countdown(60, questions.length);
            showResult(questions.length);
          };
        };
      }
    };
  });

//Functions
function setNoQuestions(num) {
  // show the total number of questions
  countQuestions.innerHTML = `Question ${countQ + 1} out of ${num}`;
}
function setQuestions(obj, num) {
  // create the question and answers elements
  if (countQ < num) {
    // if there is still questions
    // add category
    let category = document.createElement("span");
    category.className = "category";
    category.innerHTML = obj.category;
    questionDiv.appendChild(category);
    // create Photo
    let picDiv = document.createElement("div");
    picDiv.className = "img-container";
    let pic = document.createElement("img");
    pic.src = obj.image;
    picDiv.appendChild(pic);
    questionDiv.appendChild(picDiv);
    // create question
    let question = document.createElement("h3");
    let questionText = document.createTextNode(obj.title);
    question.appendChild(questionText);
    questionDiv.appendChild(question);
    // create answers
    for (let i = 0; i < 4; i++) {
      // create div
      let div = document.createElement("div");
      div.className = "answer";
      // create input radio
      let answerBtn = document.createElement("input");
      answerBtn.type = `radio`;
      answerBtn.id = `answer_${i}`;
      answerBtn.name = `answer`;
      answerBtn.dataset.correctAnswer = obj[`answer_${i + 1}`];
      // create label
      let answerlabel = document.createElement("label");
      answerlabel.htmlFor = `answer_${i}`;
      let answerText = document.createTextNode(obj[`answer_${i + 1}`]);
      // Appending
      answerlabel.appendChild(answerText);
      div.appendChild(answerBtn);
      div.appendChild(answerlabel);
      answerDiv.appendChild(div);
    }
  }
}
function countdown(duration, num) {
  // counting down for each Question
  if (countQ < num) {
    countdownInterval = setInterval(() => {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      userCounter.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        btn.click();
      }
    }, 1000);
  }
}
function checkAnswer(rAnswer) {
  // Check if the answer is right and add to score
  let chosenAnswer;
  // loop through answers and find which is selected
  for (let i = 0; i < answerBtns.length; i++) {
    if (answerBtns[i].checked) {
      chosenAnswer = answerBtns[i].dataset.correctAnswer;
    }
  }
  // match the chosen answer with the correct answer to increase score if true
  if (chosenAnswer === rAnswer) {
    score++;
  }
}
function showResult(num) {
  // remove questions and answers and show the total score
  if (countQ === num) {
    // questions and answers and next button
    bodyHead.remove();
    questionDiv.remove();
    answerDiv.remove();
    btn.remove();
    userCounter.remove();
    countQuestions.remove();
    let result;
    let resultText;
    let div = document.createElement("div");
    div.className = "result";
    // create Photo
    let picDiv = document.createElement("div");
    picDiv.className = "img-container";
    let pic = document.createElement("img");
    pic.src =
      "https://s2.r29static.com/bin/entry/4bc/545x367,85/1347479/image.webp";
    picDiv.appendChild(pic);
    div.appendChild(picDiv);
    // check score
    if (score === num) {
      result = document.createElement("p");
      resultText = document.createTextNode(
        `Perfect ${user}, You Got ${score} / ${num}`
      );
      result.appendChild(resultText);
    } else if (score > num / 2 && score < num) {
      result = document.createElement("p");
      resultText = document.createTextNode(
        `Great ${user}, You Got ${score} / ${num}`
      );
      result.appendChild(resultText);
    } else {
      result = document.createElement("p");
      resultText = document.createTextNode(
        `Unfortunately ${user}, You Got ${score} / ${num}`
      );
      result.appendChild(resultText);
    }
    div.appendChild(result);
    main.appendChild(div);
  }
}

if (getMode === "dark") {
  modeBtn.classList.add("active");
  body.classList.add("dark");
  header.classList.add("dark");
  questionDiv.classList.add("dark");
  btn.classList.add("dark");
}

modeBtn.addEventListener("click", () => {
  // add class active for dark or remove for light
  modeBtn.classList.toggle("active");
  // dark mode for body
  body.classList.toggle("dark");
  header.classList.toggle("dark");
  questionDiv.classList.toggle("dark");
  btn.classList.toggle("dark");
  // for local Storage
  if (!body.classList.contains("dark")) {
    return localStorage.setItem("mode", "light");
  }
  localStorage.setItem("mode", "dark");
});
