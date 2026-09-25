// UW–Madison Cyber Escape Room
const questions = [
  {
    question: "What is the most common way attackers try to steal credentials?",
    options: [
      "Phishing emails disguised as trusted sources",
      "Resetting the router",
      "Updating antivirus software",
      "Using a stronger password"
    ],
    correct: 0,
    tip: "Think about fake messages that trick users into clicking links or revealing info."
  },
  {
    question: "Which password is the strongest choice?",
    options: [
      "Password123",
      "Bucky!2026#Pass",
      "MyNameIsBucky",
      "12345678"
    ],
    correct: 1,
    tip: "Longer passwords with mixed characters are much harder to guess."
  },
  {
    question: "What should you do if you get a suspicious email asking for personal information?",
    options: [
      "Reply immediately",
      "Click the attachment to verify",
      "Delete it or report it and do not interact",
      "Forward it to everyone in your contacts"
    ],
    correct: 2,
    tip: "When in doubt, do not click or reply. Report it instead."
  },
  {
    question: "What does 2FA add to account security?",
    options: [
      "A second layer of verification beyond a password",
      "A way to erase the password",
      "A method to bypass malware",
      "A password reset reminder"
    ],
    correct: 0,
    tip: "2FA usually requires something you know plus something you have."
  },
  {
    question: "Which action is riskiest on public Wi‑Fi?",
    options: [
      "Checking email with a VPN",
      "Logging into sensitive accounts without protection",
      "Downloading a trusted app",
      "Enabling VPN on your phone"
    ],
    correct: 1,
    tip: "Public networks are often unsecured. Use a VPN before accessing sensitive data."
  },
  {
    question: "What is malware?",
    options: [
      "A type of secure browser plugin",
      "Software designed to harm or exploit devices",
      "A backup system",
      "A password manager"
    ],
    correct: 1,
    tip: "Malware includes viruses, ransomware, spyware, and worms."
  },
  {
    question: "What is the best step when software is outdated?",
    options: [
      "Ignore it until it breaks",
      "Update it to the latest version",
      "Keep using it as-is",
      "Disable the app completely"
    ],
    correct: 1,
    tip: "Updates often contain patches for vulnerabilities and security flaws."
  },
  {
    question: "What is social engineering?",
    options: [
      "Manipulating people into revealing confidential information",
      "Creating a friendly user profile",
      "Using a firewall properly",
      "Running a malware scan"
    ],
    correct: 0,
    tip: "It targets human behavior, not just computer systems."
  },
  {
    question: "Which is the best policy for passwords at work?",
    options: [
      "Share them with your team",
      "Write them on paper and leave them by the desk",
      "Use a password manager and never share them",
      "Use the same password everywhere"
    ],
    correct: 2,
    tip: "Password sharing should be avoided; use secure credential systems instead."
  },
  {
    question: "What does encryption do?",
    options: [
      "Makes files unreadable without the proper key",
      "Deletes backups automatically",
      "Slows down your network",
      "Disables all security alerts"
    ],
    correct: 0,
    tip: "Encryption protects data by turning it into unreadable code."
  },
  {
    question: "Before opening an email attachment from an unknown sender, what is best practice?",
    options: [
      "Open it immediately",
      "Scan it with antivirus software or avoid it",
      "Forward it to all coworkers",
      "Save it to your desktop and then open"
    ],
    correct: 1,
    tip: "Unknown attachments may contain malware or malicious scripts."
  },
  {
    question: "What is ransomware?",
    options: [
      "A software that deletes your files harmlessly",
      "Malware that encrypts files and demands payment",
      "A program that increases Wi‑Fi speed",
      "A backup utility for data restoration"
    ],
    correct: 1,
    tip: "Ransomware locks systems or files until a ransom is paid."
  }
];

const state = {
  currentIndex: 0,
  score: 0,
  elapsed: 0,
  hintCount: 0,
  tipVisible: false,
  timerId: null,
  answered: false
};

function switchScreen(id) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  document.getElementById('timer').textContent = formatTime(state.elapsed);
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.elapsed += 1;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerId);
}

function updateProgress() {
  const progress = ((state.currentIndex) / questions.length) * 100;
  document.getElementById('currentQuestion').textContent = state.currentIndex + 1;
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
}

function renderQuestion() {
  const q = questions[state.currentIndex];
  const optionsContainer = document.getElementById('optionsContainer');
  const tipBox = document.getElementById('tipBox');
  const tipButton = document.getElementById('tipBtn');
  const nextBtn = document.getElementById('nextBtn');
  const feedbackBox = document.getElementById('feedbackBox');

  state.answered = false;
  state.tipVisible = false;

  document.getElementById('questionText').textContent = q.question;
  document.getElementById('questionNum').textContent = state.currentIndex + 1;
  document.getElementById('tipText').textContent = q.tip;
  document.getElementById('feedbackBox').classList.add('hidden');
  nextBtn.style.display = 'none';
  tipBox.classList.add('hidden');
  tipButton.textContent = '💡 Show Tip';

  optionsContainer.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.type = 'button';
    btn.textContent = option;
    btn.addEventListener('click', () => handleAnswer(index, btn));
    optionsContainer.appendChild(btn);
  });

  updateProgress();
}

function handleAnswer(selected, clickedButton) {
  if (state.answered) return;
  state.answered = true;

  const q = questions[state.currentIndex];
  const buttons = document.querySelectorAll('.option');
  const feedbackBox = document.getElementById('feedbackBox');
  const feedbackText = document.getElementById('feedbackText');
  const nextBtn = document.getElementById('nextBtn');

  buttons.forEach((button, index) => {
    button.disabled = true;
    button.classList.add('disabled');

    if (index === q.correct) {
      button.classList.add('correct');
    } else if (index === selected && index !== q.correct) {
      button.classList.add('incorrect');
    }
  });

  if (selected === q.correct) {
    state.score += 1;
    feedbackText.textContent = 'Correct! You unlocked the next chamber.';
    feedbackBox.classList.remove('incorrect');
    feedbackBox.classList.add('correct');
  } else {
    feedbackText.textContent = `Incorrect. The correct answer was: ${q.options[q.correct]}`;
    feedbackBox.classList.remove('correct');
    feedbackBox.classList.add('incorrect');
  }

  feedbackBox.classList.remove('hidden');
  nextBtn.style.display = 'inline-block';
}

function toggleTip() {
  const tipBox = document.getElementById('tipBox');
  const tipButton = document.getElementById('tipBtn');

  if (!state.tipVisible) {
    tipBox.classList.remove('hidden');
    tipButton.textContent = '💡 Hide Tip';
    state.tipVisible = true;
    state.hintCount += 1;
  } else {
    tipBox.classList.add('hidden');
    tipButton.textContent = '💡 Show Tip';
    state.tipVisible = false;
  }
}

function skipQuestion() {
  if (!state.answered) {
    advanceQuestion();
  }
}

function advanceQuestion() {
  state.currentIndex += 1;
  if (state.currentIndex >= questions.length) {
    completeGame();
  } else {
    renderQuestion();
  }
}

function completeGame() {
  stopTimer();
  document.getElementById('finalTime').textContent = formatTime(state.elapsed);
  document.getElementById('finalScore').textContent = `${state.score} / ${questions.length}`;
  document.getElementById('hintsUsed').textContent = state.hintCount;
  switchScreen('completionScreen');
}

function startGame() {
  state.currentIndex = 0;
  state.score = 0;
  state.elapsed = 0;
  state.hintCount = 0;
  state.tipVisible = false;
  state.answered = false;
  updateTimer();
  renderQuestion();
  startTimer();
  switchScreen('gameScreen');
}

function resetGame() {
  stopTimer();
  switchScreen('welcomeScreen');
}

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('nextBtn').addEventListener('click', advanceQuestion);
document.getElementById('tipBtn').addEventListener('click', toggleTip);
document.getElementById('skipBtn').addEventListener('click', skipQuestion);
document.getElementById('restartBtn').addEventListener('click', resetGame);

updateTimer();
