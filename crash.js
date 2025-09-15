let history = [];
let balance = parseInt(localStorage.getItem('balance')) || 100;
let multiplier = 1.0;
let interval;
let crashed = false;
let cashout = false;
let bet = 0;
let autoCashoutValue = null;
let hasCashedOut = false;

// Статистика
let totalGames = 0;
let totalWins = 0;
let totalLosses = 0;
let totalMultiplier = 0;

const balanceEl = document.getElementById('balance');
const multiplierEl = document.getElementById('multiplier');
const resultEl = document.getElementById('result');
const betInput = document.getElementById('bet');
const autoCashoutInput = document.getElementById('autoCashout');
const startBtn = document.getElementById('startBtn');
const cashoutBtn = document.getElementById('cashoutBtn');
const statsEl = document.getElementById('stats');

function updateBalance() {
  balanceEl.textContent = `Баланс: ${balance} ₽`;
  localStorage.setItem('balance', balance);
}

function updateStats() {
  const avgMult = totalWins ? (totalMultiplier / totalWins).toFixed(2) : '—';
  statsEl.innerHTML = `
    🎮 Игр: ${totalGames} | ✅ Побед: ${totalWins} | ❌ Поражений: ${totalLosses}<br>
    📈 Средний множитель: ${avgMult}x
  `;
}

function weighted(min, max, curve = 'low') {
  const r = Math.random();
  let skewed;

  if (curve === 'low') {
    skewed = Math.pow(r, 2); // ближе к min
  } else if (curve === 'high') {
    skewed = 1 - Math.pow(1 - r, 2); // ближе к max
  } else {
    skewed = r; // равномерно
  }

  return +(min + (max - min) * skewed).toFixed(2);
}

function getCrashPoint() {
  const roll = Math.random();

  if (roll < 0.6) return weighted(1, 3, 'low');       // 60%: 1–3x, чаще ближе к 1x
  if (roll < 0.85) return weighted(3, 6, 'mid');      // 25%: 3–6x, равномерно
  if (roll < 0.97) return weighted(6, 11, 'high');    // 12%: 6–11x, чаще ближе к 11x
  return weighted(20, 30, 'high');                   // 3%: 20–30x, чаще ближе к 30x
}

function startGame() {
  bet = parseInt(betInput.value);
  autoCashoutValue = parseFloat(autoCashoutInput.value);
  if (!bet || bet < 1 || bet > balance) {
    resultEl.textContent = '❌ Неверная ставка';
    return;
  }

  balance -= bet;
  updateBalance();
  multiplier = 1.0;
  crashed = false;
  cashout = false;
  hasCashedOut = false;
  resultEl.textContent = '';
  cashoutBtn.disabled = false;
  startBtn.disabled = true;
  totalGames++;

  const crashPoint = getCrashPoint();

  interval = setInterval(() => {
    multiplier += 0.05;
    multiplierEl.textContent = `Множитель: ${multiplier.toFixed(2)}x`;

    if (!hasCashedOut && autoCashoutValue && multiplier >= autoCashoutValue) {
      cashOut();
    }

    if (multiplier >= crashPoint) {
      clearInterval(interval);
      crashed = true;
      cashoutBtn.disabled = true;
      startBtn.disabled = false;

      if (!hasCashedOut) {
        resultEl.textContent = `💥 Взрыв на ${crashPoint.toFixed(2)}x! Ставка сгорела.`;
        totalLosses++;
      } else {
        resultEl.textContent += ` 🚀 Ракета долетела до ${crashPoint.toFixed(2)}x`;
      }

      updateStats();
    }
  }, 100);
}

function cashOut() {
  if (hasCashedOut || crashed) return;
  hasCashedOut = true;
  cashout = true;
  const win = Math.floor(bet * multiplier);
  balance += win;
  updateBalance();
  resultEl.textContent = `✅ Вывел на ${multiplier.toFixed(2)}x: +${win} ₽`;
  totalWins++;
  totalMultiplier += multiplier;
  cashoutBtn.disabled = true;
}
function updateHistory(multiplier, cashedOut) {
  history.unshift({ x: multiplier.toFixed(2), success: cashedOut });
  if (history.length > 10) history.pop();
  
  if (hasCashedOut) {
  updateHistory(multiplier, true); // ты вывел — логируем свой множитель
} else {
  updateHistory(crashPoint, false); // не успел — логируем точку взрыва
}

  const html = history.map(entry => {
    const color = entry.success ? '#0f0' : '#f33';
    return `<span style="color:${color}">${entry.x}x</span>`;
  }).join(' | ');

  document.getElementById('history').innerHTML = `📜 История: ${html}`;
}



updateBalance();
updateStats();
startBtn.addEventListener('click', startGame);
cashoutBtn.addEventListener('click', cashOut);