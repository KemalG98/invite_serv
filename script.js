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
