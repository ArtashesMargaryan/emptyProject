// console.warn('mtav');

// (() => {
//   const config = {
//     dotMinRad: 6,
//     dotMaxRad: 20,
//     bigDotRed: 35,
//     masFactor: 0.002,
//     defColor: `rgba(250,10,30,0.9)`,
//     smooth: 0.95,
//     mouseSize: 120,
//     spherDest: 300,
//   };
//   const canvas = document.querySelector(`canvas`);
//   const ctx = canvas.getContext(`2d`);
//   let w, h, mouse, dots;

//   class Dot {
//     constructor(rad) {
//       this.pos = { x: mouse.x, y: mouse.y };
//       this.vel = { x: 0, y: 0 };
//       this.rad = rad || random(config.dotMinRad, config.dotMaxRad);
//       this.mass = this.rad * config.masFactor;
//       this.color = config.defColor;
//     }

//     draw(x, y) {
//       this.pos.x = x || this.pos.x + this.vel.x;
//       this.pos.y = y || this.pos.y + this.vel.y;
//       this.createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
//       this.createCircle(this.pos.x, this.pos.y, this.rad, false, config.color);
//     }

//     createCircle(x, y, rad, fill, color) {
//       ctx.fillStyle = ctx.strokeStyle = color;
//       ctx.beginPath();
//       ctx.arc(x, y, rad, 0, 2 * Math.PI);
//       ctx.closePath();
//       fill ? ctx.fill() : ctx.stroke();
//     }
//   }

//   function updateDats() {
//     for (let i = 1; i < dots.length; i++) {
//       let acc = { x: 0, y: 0 };
//       for (let j = 0; j < dots.length; j++) {
//         if (i == j) {
//           continue;
//         }
//         let [a, b] = [dots[i], dots[j]];
//         let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
//         let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
//         let force = ((dist - config.spherDest) / dist) * b.mass;

//         if (j == 0) {
//           let alpha = config.mouseSize / dist;
//           a.color = `rgba(250,10,30,${alpha})`;
//           dist < config.mouseSize ? (force = (dist - config.mouseSize) * b.mass) : (force = a.mass);
//         }

//         acc.x += delta.x * force;
//         acc.y += delta.y * force;
//       }
//       dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
//       dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
//     }
//     dots.map((e) => {
//       e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw();
//     });
//   }

//   function random(min, max) {
//     return Math.random() * (max - min) + min;
//   }

//   function init() {
//     w = canvas.width = innerWidth;
//     h = canvas.height = innerHeight;
//     mouse = { x: w / 2, y: h / 2, down: false };
//     dots = [];
//     dots.push(new Dot(config.bigDotRed));
//   }

//   function loop() {
//     ctx.clearRect(0, 0, w, h);
//     if (mouse.down) {
//       dots.push(new Dot());
//     }
//     updateDats();

//     window.requestAnimationFrame(loop);
//   }

//   init();
//   loop();

//   function setPos({ layerX, layerY }) {
//     [mouse.x, mouse.y] = [layerX, layerY];
//   }

//   function isDown() {
//     mouse.down = !mouse.down;
//   }

//   canvas.addEventListener(`pointermove`, setPos);
//   canvas.addEventListener(`pointerdown`, isDown);
//   canvas.addEventListener(`pointerup`, isDown);
// })();
// // class Main {
// //   constructor() {
// //     this.canvas = document.querySelector(`canvas`);
// //     this.context = canvas.getContext(`2d`);
// //     this.width, this.height;
// //     this.mouse;
// //     this.dots = [];
// //     this.canvas.addEventListener('mousemove', this.setPos);
// //     this.canvas.addEventListener('mousedown', this.isDown, this);
// //     this.canvas.addEventListener('mouseup', this.isDown, this);
// //     this.buildConfig();
// //     this.init();
// //     this.loop();
// //   }

// //   init() {
// //     this.dots = [];
// //     this.width = canvas.width = innerWidth;
// //     this.height = canvas.height = innerHeight;
// //     this.mouse = { x: this.width / 2, y: this.height / 2, down: false };
// //   }

// //   buildConfig() {
// //     this.config = {
// //       dotMinRed: 6,
// //       dotMaxRed: 20,
// //       massGravity: 0.002,
// //       color: 'rgba(250,10,10,0.8)',
// //     };
// //   }

// //   buildCell() {
// //     const cell = new Cell(this);
// //     return cell;
// //   }

// //   setPos({ pointerX, pointerY }) {
// //     (this.mouse.x = pointerX), (this.mouse.y = pointerY);
// //   }

// //   loop() {
// //     this.context.clearRect(0, 0, this.width, this.height);
// //     if (this.mouse.down) {
// //       this.dots.push(this.buildCell());
// //     }
// //     this.dots.map((cell) => cell.draw());
// //     window.requestAnimationFrame(this.loop);
// //   }

// //   isDown() {
// //     this.mouse.down = !this.mouse.down;
// //   }
// // }

// // class Cell {
// //   constructor(context) {
// //     this.context = context;
// //     this.pos = { x: context.mouse.x, y: context.mouse.y };
// //     this.vel = { x: 0, y: 0 };
// //     this.radius = random(context.config.dotMinRed, context.config.dotMaxRed);
// //     this.mass = this.radius * context.config.massGravity;
// //     this.color = context.config.color;
// //   }

// //   draw() {
// //     this.createCircle(this.pos.x, this.pos.y, this.radius, true, this.color);
// //     this.createCircle(this.pos.x, this.pos.y, this.radius, false, this.color);
// //   }

// //   createCircle(x, y, radius, fill, color) {
// //     const ctx = this.context.context;
// //     ctx.fillStyle = ctx.strokeStyle = color;
// //     ctx.beginPath();
// //     ctx.arc(x, y, red, 0, 2 * Math.PI);
// //     ctx.closePath();
// //     fill ? ctx.fill() : ctx.stroke();
// //   }
// // }

// // function random(min, max) {
// //   return Math.random() * (max - min) + min;
// // }

// // console.warn('hasa');
// // const game = new Main();
