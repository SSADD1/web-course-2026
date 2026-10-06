(() => {
  "use strict";

  const pads = [...document.querySelectorAll(".pad")];
  const startBtn = document.querySelector("#startBtn");
  const statusEl = document.querySelector("#status");
  const roundEl = document.querySelector("#round");
  const lengthEl = document.querySelector("#length");
  const bestEl = document.querySelector("#best");

  // Всё состояние игры хранится здесь, а не вычисляется из CSS.
  const state = {
    sequence: [],
    playerIndex: 0,
    round: 0,
    playing: false,
    showing: false,
    timerIds: new Set(),
    audioContext: null,
    best: Number(localStorage.getItem("memory-sequence-best") || 0)
  };

  const TIMING = {
    flash: 360,
    gap: 130,
    afterSequence: 260,
    betweenRounds: 650
  };

  const toneByPad = [329.63, 261.63, 392.0, 523.25];

  bestEl.textContent = String(state.best);

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function updateScore() {
    roundEl.textContent = String(state.round);
    lengthEl.textContent = String(state.sequence.length);
    bestEl.textContent = String(state.best);
  }

  function setPadsDisabled(disabled) {
    pads.forEach((pad) => {
      pad.disabled = disabled;
    });
  }

  function schedule(fn, delay) {
    const id = setTimeout(() => {
      state.timerIds.delete(id);
      fn();
    }, delay);
    state.timerIds.add(id);
    return id;
  }

  function clearAllTimers() {
    state.timerIds.forEach(clearTimeout);
    state.timerIds.clear();
  }

  function ensureAudio() {
    if (!state.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        state.audioContext = new AudioContextClass();
      }
    }

    if (state.audioContext?.state === "suspended") {
      state.audioContext.resume();
    }
  }

  function playTone(index, duration = 0.22) {
    ensureAudio();
    const ctx = state.audioContext;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = toneByPad[index];
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.02);
  }

  function flashPad(index) {
    const pad = pads[index];
    pad.classList.add("active");
    playTone(index);

    schedule(() => {
      pad.classList.remove("active");
    }, TIMING.flash);
  }

  function randomPad() {
    return Math.floor(Math.random() * pads.length);
  }

  function startGame() {
    clearAllTimers();

    state.sequence = [randomPad()];
    state.playerIndex = 0;
    state.round = 1;
    state.playing = true;
    state.showing = true;

    updateScore();
    setPadsDisabled(true);
    setStatus("Запоминайте последовательность…");
    showSequence();
  }

  function showSequence() {
    if (!state.playing) return;

    state.showing = true;
    setPadsDisabled(true);
    setStatus(`Раунд ${state.round}: смотрите на последовательность`);

    state.sequence.forEach((index, position) => {
      schedule(() => {
        if (!state.playing) return;
        flashPad(index);
      }, position * (TIMING.flash + TIMING.gap));
    });

    const sequenceDuration =
      state.sequence.length * (TIMING.flash + TIMING.gap);

    schedule(() => {
      if (!state.playing) return;

      state.showing = false;
      state.playerIndex = 0;
      setPadsDisabled(false);
      setStatus("Теперь повторите последовательность");
    }, sequenceDuration + TIMING.afterSequence);
  }

  function handlePlayerClick(index) {
    if (!state.playing || state.showing) return;

    flashPad(index);

    const expected = state.sequence[state.playerIndex];

    if (index !== expected) {
      finishGame(false);
      return;
    }

    state.playerIndex += 1;

    if (state.playerIndex === state.sequence.length) {
      // Один успешный раунд = +1 к длине последовательности.
      state.round += 1;
      state.sequence.push(randomPad());
      state.playerIndex = 0;

      if (state.sequence.length > state.best) {
        state.best = state.sequence.length;
        localStorage.setItem("memory-sequence-best", String(state.best));
      }

      updateScore();
      setPadsDisabled(true);
      setStatus("Верно! Следующий раунд…");

      schedule(() => {
        if (!state.playing) return;
        state.showing = true;
        showSequence();
      }, TIMING.betweenRounds);
    }
  }

  function finishGame(success) {
    if (!state.playing) return;

    state.playing = false;
    state.showing = false;
    clearAllTimers();
    pads.forEach((pad) => pad.classList.remove("active"));
    setPadsDisabled(true);

    // score — длина полностью пройденной последовательности.
    const score = Math.max(0, state.sequence.length - (success ? 0 : 1));

    if (score > state.best) {
      state.best = score;
      localStorage.setItem("memory-sequence-best", String(state.best));
    }

    updateScore();

    if (success) {
      setStatus(`Игра завершена. Ваш результат: ${score}.`);
    } else {
      setStatus(`Ошибка! Игра окончена. Вы дошли до ${score}.`);
    }
  }

  startBtn.addEventListener("click", () => {
    ensureAudio();
    startGame();
  });

  pads.forEach((pad) => {
    pad.addEventListener("click", () => {
      handlePlayerClick(Number(pad.dataset.index));
    });
  });

  // Клавиатура: 1–4 дублируют четыре сектора.
  window.addEventListener("keydown", (event) => {
    if (!state.playing || state.showing) return;

    const keyToIndex = { "1": 0, "2": 1, "3": 2, "4": 3 };
    const index = keyToIndex[event.key];

    if (index !== undefined) {
      event.preventDefault();
      pads[index].focus();
      handlePlayerClick(index);
    }
  });

  updateScore();
})();
