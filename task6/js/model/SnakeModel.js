export class SnakeModel {
  constructor() {
    this.columns = 20;
    this.rows = 20;
    this.cellSize = 30;
    this.moveInterval = 150;
    this.reset();
  }

  reset() {
    const x = Math.floor(this.columns / 2);
    const y = Math.floor(this.rows / 2);
    this.snake = [{ x, y }, { x: x - 1, y }, { x: x - 2, y }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.apple = null;
    this.score = 0;
    this.gameOver = false;
    this.started = false;
    this.won = false;
    this.spawnApple();
  }

  setDirection(direction) {
    if (direction.x === -this.direction.x && direction.y === -this.direction.y) return;
    this.nextDirection = direction;
  }

  spawnApple() {
    const freeCells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (!this.snake.some(part => part.x === x && part.y === y)) freeCells.push({ x, y });
      }
    }
    if (freeCells.length === 0) {
      this.apple = null;
      this.won = true;
      this.gameOver = true;
      return;
    }
    this.apple = freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  update() {
    if (this.gameOver || !this.started) return;

    this.direction = this.nextDirection;
    const head = this.snake[0];
    const nextHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    const eating = this.apple && nextHead.x === this.apple.x && nextHead.y === this.apple.y;

    // Если не едим яблоко, хвост освободит клетку в этом же шаге.
    const bodyToCheck = eating ? this.snake : this.snake.slice(0, -1);
    const hitWall = nextHead.x < 0 || nextHead.x >= this.columns ||
      nextHead.y < 0 || nextHead.y >= this.rows;
    const hitSelf = bodyToCheck.some(part => part.x === nextHead.x && part.y === nextHead.y);

    if (hitWall || hitSelf) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(nextHead);
    if (eating) {
      this.score += 1;
      this.spawnApple();
    } else {
      this.snake.pop();
    }
  }
}
