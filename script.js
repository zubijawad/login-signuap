// --- Registration ---
function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const user = { name, email, password };
  localStorage.setItem(`user_${email}`, JSON.stringify(user));
  alert("Registration successful!");
}

// --- Login ---
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const storedUser = localStorage.getItem(`user_${email}`);
  if (!storedUser) return alert("User not found!");

  const user = JSON.parse(storedUser);
  if (user.password === password) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "quiz.html";
  } else {
    alert("Incorrect password.");
  }
}


let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timeLeft = 1800; // 30 minutes

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = `${currentQuestion + 1}. ${q.question}`;
  const options = q.options.map(opt => `
    <label><input type="radio" name="option" value="${opt}"> ${opt}</label><br>
  `).join("");
  document.getElementById("options").innerHTML = options;
}

function nextQuestion() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) return alert("Please select an answer!");

  const answer = selected.value;
  userAnswers.push({ question: questions[currentQuestion].question, selected: answer });

  if (answer === questions[currentQuestion].answer) score++;

  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  const interval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(interval);
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const result = {
    email: user.email,
    score,
    total: questions.length,
    percentage: ((score / questions.length) * 100).toFixed(2),
    timestamp: new Date().toLocaleString()
  };

  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));

  localStorage.setItem("lastResult", JSON.stringify(result));
  window.location.href = "result.html";
}

if (window.location.pathname.includes("quiz.html")) {
  loadQuestion();
  startTimer();
}