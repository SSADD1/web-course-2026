export class SnakeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.lastMoveTime = 0;
    this.handleKey = this.handleKey.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('keydown', this.handleKey);
    this.view.startButton.addEventListener('click', () => this.startOrRestart());
    this.view.setStatus('Ожидание запуска');
    requestAnimationFrame(this.loop);
  }

  startOrRestart() {
    this.model.reset();
    this.model.started = true;
    this.lastMoveTime = performance.now();
    this.view.hideOverlay();
    this.view.setStatus('Игра идёт', true);
    this.view.draw();
  }

  handleKey(event) {
    const directions = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };

    if (directions[event.key]) {
      event.preventDefault();
      if (this.model.started && !this.model.gameOver) {
        this.model.setDirection(directions[event.key]);
      }
    } else if ((event.key === 'Enter' || event.key === ' ') &&
      (this.model.gameOver || !this.model.started)) {
      event.preventDefault();
      this.startOrRestart();
    }
  }

  loop(currentTime) {
    // Рисование идёт через rAF, а скорость игры задаётся прошедшим временем.
    if (this.model.started && !this.model.gameOver &&
      currentTime - this.lastMoveTime >= this.model.moveInterval) {
      this.model.update();
      this.lastMoveTime = currentTime;
      this.view.draw();
      if (this.model.gameOver) this.finishGame();
    }
    requestAnimationFrame(this.loop);
  }

  finishGame() {
    if (this.model.won) {
      this.view.showOverlay(
        'Вы победили!',
        `Поле заполнено. Итоговый счёт: ${this.model.score}.`,
        'Играть снова',
        '★'
      );
    } else {
      this.view.showOverlay(
        'Игра окончена',
        `Ваш итоговый счёт: ${this.model.score}. Попробуйте ещё раз!`,
        'Начать заново',
        '×'
      );
    }
    this.view.setStatus('Игра завершена');
  }
}
