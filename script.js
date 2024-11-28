// Elements for Authentication
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const goToLogin = document.getElementById('goToLogin');
const goToRegister = document.getElementById('goToRegister');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const startBtn = document.querySelector('.startBtn');
const container = document.querySelector('.container');

// Quiz Elements
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alertBox = document.getElementById('alert');
const timer = document.querySelector('.timer');

// User Data Storage (localStorage)
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = '';  // Variable to store the current logged-in user

// Toggle between login and registration forms
goToLogin.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

goToRegister.addEventListener('click', () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Registration logic
registerBtn.addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!username || !password) {
        showAlert("Please fill in all fields.");
        return;
    }

    if (users[username]) {
        showAlert("Username already exists.");
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    showAlert("Registration successful! Please log in.");
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login logic
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (users[username] && users[username] === password) {
        showAlert("Login successful!");
        currentUser = username; // Store the logged-in username
        loginForm.style.display = 'none';
        startBtn.style.display = 'block'; // Show Start Quiz Button
    } else {
        showAlert("Invalid username or password.");
    }
});

// Start Quiz
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    container.style.display = 'block';
    startQuiz(); // Start the quiz functionality
});

// Expanded Quiz Questions (Now 10 Questions)
const quiz = [
    {
        question: "Q. Which of the following is not a CSS box model property?",
        choices: ["margin", "padding", "border-radius", "border-collapse"],
        answer: "border-collapse"
    },
    {
        question: "Q. Which of the following is not a valid way to declare a function in JavaScript?",
        choices: ["function myFunction() {}", "let myFunction = function() {};", "myFunction: function() {}", "const myFunction = () => {};"],
        answer: "myFunction: function() {}"
    },
    {
        question: "Q. Which of the following is not a JavaScript data type?",
        choices: ["string", "boolean", "object", "float"],
        answer: "float"
    },
    {
        question: "Q. Which of the following CSS properties is used to change the font size?",
        choices: ["font-weight", "font-size", "font-style", "text-align"],
        answer: "font-size"
    },
    {
        question: "Q. Which of the following JavaScript methods is used to add an element to the end of an array?",
        choices: ["push()", "pop()", "shift()", "unshift()"],
        answer: "push()"
    },
    {
        question: "Q. What does 'NaN' stand for in JavaScript?",
        choices: ["Not an Object", "Not a Number", "New Object", "None of the above"],
        answer: "Not a Number"
    },
    {
        question: "Q. What does CSS stand for?",
        choices: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        answer: "Cascading Style Sheets"
    },
    {
        question: "Q. Which of the following is not a valid data type in JavaScript?",
        choices: ["Null", "String", "Object", "Integer"],
        answer: "Integer"
    },
    // New questions added here:
    {
        question: "Q. In JavaScript, which of the following is used to declare a constant variable?",
        choices: ["var", "let", "const", "constant"],
        answer: "const"
    },
    {
        question: "Q. Which of the following is used to create an array in JavaScript?",
        choices: ["[]", "{}", "()", "<>"],
        answer: "[]"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerID = null;
let answerCorrect = false;  // Track if the last answer was correct

// Start Quiz Logic
const startQuiz = () => {
    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 15;
    showQuestions();
    startTimer(); // Start timer for the first question
};

// Show question function
const showQuestions = () => {
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;

    choicesBox.innerHTML = ""; // Clear previous choices
    questionDetails.choices.forEach(choice => {
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = choice;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => {
            document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
            choiceDiv.classList.add('selected');
            checkAnswer(choiceDiv.textContent); // Immediately check answer on selection
        });
    });

    nextBtn.style.display = 'none'; // Hide the "Next" button until answer is checked
};

// Timer logic
const startTimer = () => {
    clearInterval(timerID); // Reset any existing timer
    timer.textContent = timeLeft;

    timerID = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerID);
            showAlert("Time's up! Moving to the next question.");
            checkAnswer(); // Automatically check the answer when time runs out
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerID);
};

// Check the answer and give feedback immediately with background colors
const checkAnswer = (selectedAnswer) => {
    const correctAnswer = quiz[currentQuestionIndex].answer;
    
    if (selectedAnswer === correctAnswer) {
        score++;
        document.querySelectorAll('.choice').forEach(choice => {
            if (choice.textContent === correctAnswer) {
                choice.style.backgroundColor = "green"; // Green for correct answer
            }
        });
        showAlert("Correct!");
    } else {
        document.querySelectorAll('.choice').forEach(choice => {
            if (choice.textContent === correctAnswer) {
                choice.style.backgroundColor = "green"; // Green for correct answer
            }
            if (choice.textContent === selectedAnswer) {
                choice.style.backgroundColor = "red"; // Red for wrong answer
            }
        });
        showAlert(`Wrong! The correct answer was: ${correctAnswer}`);
    }

    // Pause the timer before allowing the next question
    stopTimer();

    // Show the "Next" button after feedback
    nextBtn.style.display = 'block'; // Allow user to click next
};

// Move to the next question
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
        showQuestions();
        timeLeft = 15; // Reset timer for the next question
        startTimer();
    } else {
        showScore(); // Show final score if all questions answered
    }
});

// Show final score
const showScore = () => {
    container.style.display = 'none';
    startBtn.style.display = 'block';

    // Show final score with the username
    showAlert(`Congrats ${currentUser}! You scored ${score} / ${quiz.length}`);
};

// Alert function to display messages
const showAlert = (message) => {
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
};
