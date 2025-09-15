let history = [];
let balance = parseInt(localStorage.getItem('balance')) || 100;
let multiplier = 1.0;
let interval;
let crashed = false;
let cashout = false;
let bet = 0;

const balanceEl = document.getElementById('balance');
const multiplierEl = document.getElementById('multiplier');
const resultEl = document.getElementById('result');
const betInput = document.getElementById('bet');
const startBtn = document.getElementById('startBtn');
const cashoutBtn = document.getElementById('cashoutBtn');

function updateBalance() {
  balanceEl.textContent = `Баланс: ${balance} монет`;
  localStorage.setItem('balance', balance);
}

function startGame() {
  bet = parseInt(betInput.value);
  if (!bet || bet < 1 || bet > balance) {
    resultEl.textContent = '❌ Неверная ставка';
    return;
  }

  balance -= bet;
  updateBalance();
  multiplier = 1.0;
  crashed = false;
  cashout = false;
  resultEl.textContent = '';
  cashoutBtn.disabled = false;
  startBtn.disabled = true;

  const crashPoint = +(Math.random() * 100 + 1).toFixed(2); // от 1x до 100x

  interval = setInterval(() => {
    multiplier += 0.05;
    multiplierEl.textContent = `Множитель: ${multiplier.toFixed(2)}x`;

    if (multiplier >= crashPoint) {
      clearInterval(interval);
      crashed = true;
      cashoutBtn.disabled = true;
      startBtn.disabled = false;
      resultEl.textContent = '💥 Ракета взорвалась! Ставка сгорела.';
    }

    if (cashout && !crashed) {
      clearInterval(interval);
      const win = Math.floor(bet * multiplier);
      balance += win;
      updateBalance();
      resultEl.textContent = `✅ Вывел на ${multiplier.toFixed(2)}x: +${win} монет`;
      cashoutBtn.disabled = true;
      startBtn.disabled = false;
    }
  }, 100);
}

function cashOut() {
  cashout = true;
}

updateBalance();
startBtn.addEventListener('click', startGame);
cashoutBtn.addEventListener('click', cashOut);

