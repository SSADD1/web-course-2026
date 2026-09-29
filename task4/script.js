'use strict';

const gameState = {
  secret: '',
  history: [],
  finished: false
};

const guessForm = document.querySelector('#guessForm');
const guessInput = document.querySelector('#guessInput');
const checkButton = document.querySelector('#checkButton');
const newGameButton = document.querySelector('#newGameButton');
const attemptsCount = document.querySelector('#attemptsCount');
const historyCount = document.querySelector('#historyCount');
const historyList = document.querySelector('#historyList');
const historyEmpty = document.querySelector('#historyEmpty');
const message = document.querySelector('#message');
const inputError = document.querySelector('#inputError');

function generateSecretNumber() {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Первый разряд не может быть 0, чтобы число действительно было 4-значным.
  const firstIndex = Math.floor(Math.random() * 9) + 1;
  const firstDigit = digits.splice(firstIndex, 1)[0];

  let result = firstDigit;
  while (result.length < 4) {
    const index = Math.floor(Math.random() * digits.length);
    result += digits.splice(index, 1)[0];
  }

  return result;
}

function validateGuess(value) {
  if (!/^\d{4}$/.test(value)) {
    return 'Введите ровно 4 цифры без пробелов и символов.';
  }

  if (new Set(value).size !== 4) {
    return 'Все 4 цифры должны быть разными.';
  }

  return '';
}

function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < secret.length; i += 1) {
    if (guess[i] === secret[i]) {
      bulls += 1;
    } else if (secret.includes(guess[i])) {
      cows += 1;
    }
  }

  return { bulls, cows };
}

function formatCount(number, one, few, many) {
  const lastTwo = number % 100;
  const last = number % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

function formatResult(bulls, cows) {
  const bullWord = formatCount(bulls, 'бык', 'быка', 'быков');
  const cowWord = formatCount(cows, 'корова', 'коровы', 'коров');
  return `${bulls} ${bullWord}, ${cows} ${cowWord}`;
}

function clearError() {
  inputError.textContent = '';
  guessInput.removeAttribute('aria-invalid');
}

function showError(text) {
  inputError.textContent = text;
  guessInput.setAttribute('aria-invalid', 'true');
}

function renderHistory() {
  historyList.innerHTML = '';
  historyEmpty.hidden = gameState.history.length > 0;
  historyCount.textContent = `${gameState.history.length} ${formatCount(
    gameState.history.length,
    'ход',
    'хода',
    'ходов'
  )}`;
  attemptsCount.textContent = String(gameState.history.length);

  gameState.history.forEach((item) => {
    const li = document.createElement('li');

    const guess = document.createElement('span');
    guess.className = 'guess';
    guess.textContent = item.guess;

    const result = document.createElement('span');
    result.className = 'result';
    result.textContent = `→ ${formatResult(item.bulls, item.cows)}`;

    li.append(guess, result);
    historyList.appendChild(li);
  });
}

function startNewGame() {
  gameState.secret = generateSecretNumber();
  gameState.history = [];
  gameState.finished = false;

  guessInput.value = '';
  guessInput.disabled = false;
  checkButton.disabled = false;
  clearError();

  message.className = 'message';
  message.textContent = 'Игра началась. Сделайте первую попытку!';

  renderHistory();
  guessInput.focus();
}

guessForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (gameState.finished) return;

  const guess = guessInput.value.trim();
  const validationError = validateGuess(guess);

  if (validationError) {
    showError(validationError);
    return;
  }

  clearError();

  const { bulls, cows } = countBullsAndCows(gameState.secret, guess);
  gameState.history.push({ guess, bulls, cows });
  renderHistory();

  if (bulls === 4) {
    gameState.finished = true;
    guessInput.disabled = true;
    checkButton.disabled = true;
    message.className = 'message success';
    message.textContent = `Победа! Угадано за ${gameState.history.length} ${formatCount(
      gameState.history.length,
      'попытку',
      'попытки',
      'попыток'
    )}.`;
  } else {
    message.className = 'message';
    message.textContent = `Результат: ${formatResult(bulls, cows)}.`;
    guessInput.select();
  }
});

newGameButton.addEventListener('click', startNewGame);

guessInput.addEventListener('input', () => {
  // Разрешаем ввод только цифр и не более 4 символов.
  guessInput.value = guessInput.value.replace(/\D/g, '').slice(0, 8);
  clearError();
});

startNewGame();
