document.addEventListener("DOMContentLoaded", function () {
  let profileWindow = document.getElementById("profile-window");
  let profileForm = document.getElementById("profile-form");
  let profileDisplay = document.getElementById("profile-display");
  if (localStorage.getItem("pseudo")) {
    profileWindow.style.display = "none";
    showProfile();
  }

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let nom = document.getElementById("nom").value;
    let prenom = document.getElementById("prenom").value;
    let pseudo = document.getElementById("pseudo").value;
    let age = document.getElementById("age").value;

    localStorage.setItem("nom", nom);
    localStorage.setItem("prenom", prenom);
    localStorage.setItem("pseudo", pseudo);
    localStorage.setItem("age", age);
    localStorage.setItem("volume", "50");
    localStorage.setItem("lastScore", "0");
    localStorage.setItem("theme", "dark");

    profileWindow.style.display = "none";
    showProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      });
    }
  });
  function showProfile() {
    let nom = localStorage.getItem("nom");
    let prenom = localStorage.getItem("prenom");
    let pseudo = localStorage.getItem("pseudo");
    let age = localStorage.getItem("age");

    profileDisplay.textContent =
      "Bonjour " + prenom + " " + nom + " (" + pseudo + "), " + age + " ans.";
  }

  let quizQuestions = [
    {
      question: "Quelle planète est la plus proche du Soleil ?",
      answers: ["Mars", "Mercure", "Jupiter"],
      correct: "Mercure",
    },
    {
      question: "Dans quel milieu flotte un astronaute autour de la Terre ?",
      answers: ["Dans l'apesanteur", "Sous l'eau", "Dans un tunnel"],
      correct: "Dans l'apesanteur",
    },
    {
      question: "Quelle mission a posé les premiers humains sur la Lune ?",
      answers: ["Apollo 11", "ISS", "Voyager"],
      correct: "Apollo 11",
    },
  ];

  let quizIndex = 0;
  let quizScore = 0;
  let quizQuestion = document.getElementById("quiz-question");
  let quizAnswers = document.getElementById("quiz-answers");
  let quizMessage = document.getElementById("quiz-message");

  showQuizQuestion();

  function showQuizQuestion() {
    let currentQuestion = quizQuestions[quizIndex];
    quizQuestion.textContent = currentQuestion.question;
    quizAnswers.textContent = "";

    for (let i = 0; i < currentQuestion.answers.length; i++) {
      let answerButton = document.createElement("button");
      answerButton.textContent = currentQuestion.answers[i];
      answerButton.className = "quiz-answer";
      quizAnswers.appendChild(answerButton);

      answerButton.addEventListener("click", function () {
        if (answerButton.textContent === currentQuestion.correct) {
          quizScore++;
          quizMessage.textContent = "Bonne réponse.";
        } else {
          quizMessage.textContent =
            "Mauvaise réponse. La bonne réponse était " +
            currentQuestion.correct +
            ".";
        }

        quizIndex++;

        if (quizIndex < quizQuestions.length) {
          showQuizQuestion();
        } else {
          let percentage = Math.round((quizScore / quizQuestions.length) * 100);
          let pseudo = localStorage.getItem("pseudo");
          sessionStorage.setItem("missionScore", percentage);
          quizQuestion.textContent = "";
          quizAnswers.textContent = "";
          quizMessage.textContent =
            "Bravo " +
            pseudo +
            ", tu as réussi " +
            percentage +
            "% de ta mission !";
        }
      });
    }
  }

  let draggedItem = null;
  let dragItems = [
    document.getElementById("mars"),
    document.getElementById("jupiter"),
    document.getElementById("saturne"),
    document.getElementById("soleil"),
    document.getElementById("sirius"),
    document.getElementById("comete"),
  ];
  let dropZones = [
    document.getElementById("zone-systeme"),
    document.getElementById("zone-au-dela"),
  ];
  let dragMessage = document.getElementById("drag-message");
  let placedItems = 0;

  for (let i = 0; i < dragItems.length; i++) {
    dragItems[i].addEventListener("dragstart", function () {
      draggedItem = dragItems[i];
    });
  }

  for (let i = 0; i < dropZones.length; i++) {
    dropZones[i].addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    dropZones[i].addEventListener("drop", function (event) {
      event.preventDefault();

      let itemZone = draggedItem.dataset.zone;
      let zoneName = dropZones[i].dataset.zone;

      if (itemZone === zoneName) {
        dropZones[i].appendChild(draggedItem);
        dragMessage.textContent = "Bravo !";

        if (!draggedItem.dataset.placed) {
          draggedItem.dataset.placed = "true";
          placedItems++;
        }

        if (placedItems === 6) {
          dragMessage.textContent =
            "Bravo ! Tous les objets sont bien classés.";
        }
      } else {
        dragMessage.textContent =
          "Non, " + draggedItem.textContent + " n'est pas dans cette zone.";
      }
    });
  }

  let hangmanWords = [
    "PLANETE",
    "FUSEE",
    "ETOILE",
    "GALAXIE",
    "COMETE",
    "LUNE",
    "SOLEIL",
    "ASTRONAUTE",
    "SATELLITE",
    "ORBITE",
  ];
  let hangmanWord = "";
  let hangmanErrors = 0;
  let guessedLetters = [];

  let hangmanWordDisplay = document.getElementById("hangman-word");
  let hangmanErrorsDisplay = document.getElementById("hangman-errors");
  let hangmanKeyboard = document.getElementById("hangman-keyboard");
  let hangmanMessage = document.getElementById("hangman-message");
  let hangmanReplay = document.getElementById("hangman-replay");

  startHangman();

  function startHangman() {
    let randomIndex = Math.floor(Math.random() * hangmanWords.length);
    hangmanWord = hangmanWords[randomIndex];
    hangmanErrors = 0;
    guessedLetters = [];
    hangmanMessage.textContent = "";
    hangmanKeyboard.textContent = "";

    showHangmanWord();
    showHangmanErrors();

    for (let i = 0; i < 26; i++) {
      let letter = String.fromCharCode(65 + i);
      let letterButton = document.createElement("button");
      letterButton.textContent = letter;
      letterButton.className = "hangman-letter";
      hangmanKeyboard.appendChild(letterButton);

      letterButton.addEventListener("click", function () {
        letterButton.disabled = true;
        guessedLetters.push(letter);

        if (hangmanWord.indexOf(letter) === -1) {
          hangmanErrors++;
          showHangmanErrors();
        }

        showHangmanWord();
        checkHangmanResult();
      });
    }

    for (let i = 1; i <= 6; i++) {
      let drawingPart = document.getElementById("hangman-" + i);
      drawingPart.style.visibility = "hidden";
    }
  }

  function showHangmanWord() {
    let display = "";

    for (let i = 0; i < hangmanWord.length; i++) {
      let letter = hangmanWord[i];
      if (guessedLetters.indexOf(letter) !== -1) {
        display += letter + " ";
      } else {
        display += "_ ";
      }
    }

    hangmanWordDisplay.textContent = display;
  }

  function showHangmanErrors() {
    hangmanErrorsDisplay.textContent =
      "Erreurs restantes : " + (6 - hangmanErrors);

    if (hangmanErrors > 0) {
      let drawingPart = document.getElementById("hangman-" + hangmanErrors);
      drawingPart.style.visibility = "visible";
    }
  }

  function checkHangmanResult() {
    let lettersFound = true;

    for (let i = 0; i < hangmanWord.length; i++) {
      if (guessedLetters.indexOf(hangmanWord[i]) === -1) {
        lettersFound = false;
      }
    }

    let pseudo = localStorage.getItem("pseudo");

    if (lettersFound) {
      hangmanMessage.textContent = "Bravo " + pseudo + " !";
      localStorage.setItem("lastScore", "gagne");
      disableHangmanLetters();
    } else if (hangmanErrors === 6) {
      hangmanMessage.textContent = "Perdu ! Le mot était : " + hangmanWord;
      localStorage.setItem("lastScore", "perdu");
      disableHangmanLetters();
    }
  }

  function disableHangmanLetters() {
    let buttons = hangmanKeyboard.children;

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  hangmanReplay.addEventListener("click", function () {
    startHangman();
  });
});
