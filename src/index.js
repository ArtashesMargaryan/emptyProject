export TWO_PI=2*Math.PI
export class Main {
  constructor() {
    this.canvas = document.querySelector(`canvas`);
    this.context = canvas.getContext('2d');
    this.width, this.height;
    this.mouse;
    this.dots=[]
    this.canvas.addEventListener('mousemove', setPos);
    this.canvas.addEventListener('mousedown', isDown, this);
    this.canvas.addEventListener('mouseup', isDown, this);
    this.buildConfig();
    this.init();
    this.buildCell();
  }

  init() {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    this.mouse = { x: width / 2, y: height / 2, down: false };
  }

  buildConfig() {
    this.config = {
      dotMinRed: 6,
      dotMaxRed: 20,
      massGravity: 0.002,
      color: 'rgba(250,10,10,0.8)',
    };
  }

  buildCell() {
    const cell = new Cell(this);
  }

  setPos({ pointerX, pointerY }) {
    (this.mouse.x = pointerX), (this.mouse.y = pointerY);
  }

  loop() {
    this.context.clearRect(0,0,this.width,this.height)
    if(this.mouse.down){
      this.dots
    }
  }

  isDown() {
    this.mouse.down = !this.mouse.down;
  }
}

export class Cell {
  constructor(context) {
    this.context=context
    this.pos = { x: context.mouse.x, y: context.mouse.y };
    this.vel = { x: 0, y: 0 };
    this.radius = random(context.config.dotMinRed, context.config.dotMaxRed);
    this.mass = this.radius * context.config.massGravity;
    this.color = context.config.color;
  }

  draw() {
    this.createCircle(this.pos.x, this.pos.y, this.radius, true, this.color);
    this.createCircle(this.pos.x, this.pos.y, this.radius, false, this.color);
  }

  createCircle(x, y, radius, fill, color) {
    const ctx=this.context.context
    ctx.fillStyle=ctx.strokeStyle=color
    ctx.beginPath();
    ctx.arc(x,y,red,0,TWO_PI);
    ctx.closePath();
    fill?ctx.fill():ctx.stroke();

  }
}

export function random(min, max) {
  return Math.random() * (max - min) + min;
}

const game = new Main();
