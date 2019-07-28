class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
    const fact = value / this.len;
    this.x *= fact;
    this.y *= fact;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.vel = new Vec();
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");

    this.ball = new Ball();

    this.players = [new Player(), new Player()];

    this.reset();

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    });

    let rolling = true;
    const callback = () => {
      if (rolling) this.update();
      requestAnimationFrame(callback);
    };
    callback();
  }
  collide(player, ball) {
    if (
      player.left < ball.right &&
      player.right > ball.left &&
      player.top < ball.bottom &&
      player.bottom > ball.top
    ) {
      const len = ball.vel.len;
      ball.vel.x = -ball.vel.x;
      ball.vel.y = 8 * (Math.random() * 2 - 1);
      ball.vel.len = len * 1.02;
    }
  }
  draw() {
    this._context.fillStyle = "#000";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }
  drawRect(rect) {
    this._context.fillStyle = "#fff";
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }
  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }
  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 8 * (Math.random() > 0.5 ? -1 : 1);
      this.ball.vel.y = 8 * (Math.random() * 2 - 1);
      this.ball.vel.len = 10;
    }
  }
  update() {
    this.ball.pos.x += this.ball.vel.x;
    this.ball.pos.y += this.ball.vel.y;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 ? 1 : 2;
      this.players[playerId].score++;
      this.reset();
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.players.forEach(player => {
      this.collide(player, this.ball);
    });

    this.draw();
  }
}
canvas = document.getElementById("stage");
const pong = new Pong(canvas);

canvas.addEventListener("mousemove", event => {
  pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener("click", () => {
  pong.start();
});
