const welcomeScreen = document.getElementById("welcome-screen");
const questionScreen = document.getElementById("question-screen");
const successScreen = document.getElementById("success-screen");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}

startBtn.addEventListener("click", () => {
  showScreen(questionScreen);
});

yesBtn.addEventListener("click", () => {
  showScreen(successScreen);
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });
});

const noTexts = [
  "Нет 💔",
  "Точно нет? 🥺",
  "Подумай ещё 😭",
  "Ты уверена? 🥹",
  "Попробуй ещё раз 😏",
  "У тебя нет выбора ❤️",
];

let noClickCount = 0;
const NO_BTN_MIN_SCALE = 0.85;

function moveNoButton() {
  noClickCount++;

  noBtn.textContent = noTexts[noClickCount % noTexts.length];

  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 20;
  const maxY = window.innerHeight - rect.height - 20;

  const randomX = Math.max(10, Math.floor(Math.random() * maxX));
  const randomY = Math.max(10, Math.floor(Math.random() * maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  const scale = Math.max(NO_BTN_MIN_SCALE, 1 - noClickCount * 0.03);
  noBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

noBtn.addEventListener("click", () => {
  moveNoButton();
});
