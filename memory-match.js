const board = document.getElementById("gameBoard");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("bestTime");
const popup = document.getElementById("popup");
const finalTimeEl = document.getElementById("finalTime");
const finalBestTimeEl = document.getElementById("finalBestTime");

const emojis = ["🍓", "🌸", "🧸", "🍭", "🌼", "💎", "🌈", "🎈"];
let deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timer = 0;
let gameStarted = false;
let timerInterval;
let bestTime = localStorage.getItem("memoryBest");

if (bestTime) bestEl.textContent = bestTime;

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function createBoard() {
  board.innerHTML = ''; // Clear board if restarting
  deck.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.textContent = "";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this.classList.contains("flipped")) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  this.classList.add("flipped");
  this.textContent = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchedPairs++;
    resetCards();
    if (matchedPairs === emojis.length) finishGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function finishGame() {
  clearInterval(timerInterval);
  popup.classList.remove("hidden");
  finalTimeEl.textContent = timer;

  if (!bestTime || timer < bestTime) {
    bestTime = timer;
    localStorage.setItem("memoryBest", bestTime);
  }

  finalBestTimeEl.textContent = localStorage.getItem("memoryBest");
}

function restartGame() {
  window.location.reload();
}

createBoard();

