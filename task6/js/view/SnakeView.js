export class SnakeView {
  constructor(model) {
    this.model = model;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = document.getElementById('score');
    this.overlay = document.getElementById('overlay');
    this.overlayIcon = document.getElementById('overlay-icon');
    this.overlayTitle = document.getElementById('overlay-title');
    this.overlayText = document.getElementById('overlay-text');
    this.startButton = document.getElementById('start-button');
    this.statusText = document.getElementById('status-text');
    this.statusDot = document.getElementById('status-dot');
    this.draw();
  }

  draw() {
    const { ctx, model } = this;
    const size = model.cellSize;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#121a15';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = 'rgba(191,225,183,.055)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= model.columns; x++) {
      ctx.beginPath(); ctx.moveTo(x * size + .5, 0);
      ctx.lineTo(x * size + .5, this.canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= model.rows; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * size + .5);
      ctx.lineTo(this.canvas.width, y * size + .5); ctx.stroke();
    }

    if (model.apple) this.drawApple(model.apple.x * size, model.apple.y * size, size);
    model.snake.forEach((part, index) => this.drawSegment(part, index === 0));
    this.scoreElement.textContent = String(model.score);
  }

  drawSegment(part, isHead) {
    const { ctx, model } = this;
    const s = model.cellSize;
    const inset = isHead ? 3 : 4;
    const x = part.x * s + inset;
    const y = part.y * s + inset;
    const size = s - inset * 2;

    ctx.fillStyle = isHead ? '#c7ff7d' : '#83c94e';
    this.roundRect(x, y, size, size, isHead ? 8 : 6);
    ctx.fill();

    if (!isHead) return;
    ctx.fillStyle = '#1b2b16';
    const d = model.direction;
    let eyes;
    if (d.x === 1) eyes = [[x + size * .68, y + size * .30], [x + size * .68, y + size * .68]];
    else if (d.x === -1) eyes = [[x + size * .32, y + size * .30], [x + size * .32, y + size * .68]];
    else if (d.y === -1) eyes = [[x + size * .30, y + size * .32], [x + size * .68, y + size * .32]];
    else eyes = [[x + size * .30, y + size * .68], [x + size * .68, y + size * .68]];
    eyes.forEach(([ex, ey]) => {
      ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI * 2); ctx.fill();
    });
  }

  drawApple(x, y, size) {
    const { ctx } = this;
    ctx.fillStyle = '#ff6f63';
    ctx.beginPath(); ctx.arc(x + size * .5, y + size * .55, size * .30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff9384';
    ctx.beginPath(); ctx.arc(x + size * .40, y + size * .45, size * .09, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a8e86a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + size * .51, y + size * .28);
    ctx.quadraticCurveTo(x + size * .54, y + size * .15, x + size * .66, y + size * .18); ctx.stroke();
  }

  roundRect(x, y, width, height, radius) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  setStatus(text, active = false) {
    this.statusText.textContent = text;
    this.statusDot.classList.toggle('active', active);
  }

  showOverlay(title, text, buttonText, icon = '●') {
    this.overlayTitle.textContent = title;
    this.overlayText.textContent = text;
    this.startButton.textContent = buttonText;
    this.overlayIcon.textContent = icon;
    this.overlay.classList.remove('hidden');
  }

  hideOverlay() {
    this.overlay.classList.add('hidden');
  }
}
