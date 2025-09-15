const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
let balance = parseInt(localStorage.getItem('balance')) || 0;

const balanceEl = document.getElementById('balance');
const slotsEl = document.getElementById('slots');
const resultEl = document.getElementById('result');
const spinBtn = document.getElementById('spinBtn');
const betInput = document.getElementById('bet');
const logEl = document.getElementById('log');

function updateBalance() {
  balanceEl.textContent = `Баланс: ${balance} Ton`;
  localStorage.setItem('balance', balance);
}

function log(message) {
  const entry = document.createElement('div');
  entry.textContent = message;
  logEl.prepend(entry);
}

function getRandomSlot() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function generateSpinResult() {
  const chance = Math.random();
  if (chance < 0.05) {
    const symbol = getRandomSlot();
    return [symbol, symbol, symbol];
  } else {
    return [getRandomSlot(), getRandomSlot(), getRandomSlot()];
  }
}

function animateSpin(callback) {
  let frames = 12;
  const interval = setInterval(() => {
    const temp = [getRandomSlot(), getRandomSlot(), getRandomSlot()];
    slotsEl.textContent = temp.join(' ');
    frames--;
    if (frames <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 100);
}

function spinSlots() {
  const bet = parseInt(betInput.value);
  if (!bet || bet < 1 || bet > balance) {
    resultEl.textContent = '❌ Неверная ставка';
    return;
  }

  balance -= bet;
  updateBalance();
  resultEl.textContent = '🎞️ Крутится...';
  spinBtn.disabled = true;

  animateSpin(() => {
    const slotResult = generateSpinResult();
    slotsEl.textContent = slotResult.join(' ');
    let win = 0;

    if (slotResult.every(s => s === '7️⃣')) {
      win = bet * 50;
      resultEl.textContent = `💥 Джекпот! Выигрыш: +${win} Ton`;
    } else if (slotResult[0] === slotResult[1] && slotResult[1] === slotResult[2]) {
      win = bet * 5;
      resultEl.textContent = `🎉 Три одинаковых! Выигрыш: +${win} Ton`;
    } else {
      resultEl.textContent = `😢 Проигрыш: -${bet} Ton`;
    }

    balance += win;
    updateBalance();
    log(`🎲 ${slotResult.join(' ')} | Ставка: ${bet} Ton | Выигрыш: ${win} Ton`);
    spinBtn.disabled = false;
  });
}

updateBalance();
spinBtn.addEventListener('click', spinSlots);
