import * as PIXI from 'pixi.js';
import emitter from './emitter';
import Matter from './matter';
import { getEndPointer, getNextPointer } from './utils';
import { World } from './world';

export class Game extends PIXI.Application {
  constructor() {
    super({ width: window.innerWidth, height: innerHeight, backgroundColor: '0xf11112f' });
    document.body.appendChild(this.view);
    this.addListenerBody();
    this.mouseConstraint = Matter.MouseConstraint;
    this.mouse = Matter.Mouse;
    this.pointer;
    this.boardSize = {
      row: 30,
      col: 40,
      size: 40,
    };
    this.eventIs = true;
    this.init();
    this.runRender();
    // this.buildWord();
    this.build();
    emitter.on('newStep', () => {
      this.addListenerBody();
    });
    this.board = [];
    this.buildBoard();
    this.angularF;
  }

  buildBoard() {
    for (let i = 0; i < this.boardSize.col; i++) {
      this.board[i] = [];
      const arr = [];
      for (let j = 0; j < this.boardSize.col; j++) {
        arr.push({ i: i, j: j });
      }
      this.board[i].push([...arr]);
      arr.length = 0;
    }

    console.warn(this.board);
  }

  addListenerBody() {
    this.rebuildBall();
    document.body.addEventListener('mousemove', this.buildAim);
    document.body.addEventListener('pointerdown', this.fire);
  }

  removeListenerBody() {
    document.body.removeEventListener('mousemove', this.buildAim);
    document.body.removeEventListener('pointerdown', this.fire);
    this.eventIs = !this.eventIs;
  }

  rebuildBall() {
    !!this.world && !!this.world.getBall && this.world.ballRebuild();
  }

  fire = (e) => {
    console.warn('a');
    this.eventIs = !this.eventIs;
    this.clearLine();
    this.world.stroke({ x: Math.round(e.clientX), y: Math.round(e.clientY) }, this.config.maxCoefficient);
    this.removeListenerBody();
  };

  buildAim = (e) => {
    let startPosition;
    if (this.world) {
      startPosition = { x: this.world.getBallPosition().x, y: this.world.getBallPosition().y };
    }
    this.startPosition = startPosition;
    let x, y;
    const path = this.buildPath(startPosition, { x: e.clientX, y: e.clientY });
    this.clearLine();

    this.renderLine(path[0], path[1]);
    if (path[1].y != 40) {
      const path1 = getEndPointer(path[1]);
      if (path1) {
        this.renderLine(path1, path[1]);
      }
    }
    // this.stage.removeChildren(this.stage.children.length - 2, this.stage.children.length - 1);
  };

  init() {
    this.config = {
      maxCoefficient: 0.5,
    };
    this.engine = Matter.Engine.create(this.view);
    // this.world = this.engine.world;
  }

  runRender() {
    this.render = Matter.Render.create({
      element: this.view,
      engine: this.engine,

      options: {
        width: '100%',
        height: '100%',

        wireframes: false, // need this or various render styles won't take
        background: 0xffffff,
        showAngleIndicato: true,
      },
    });
    Matter.Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: 2000, y: 2000 },
    });
    Matter.Render.run(this.render);
    this.runner();
  }

  buildPath(startPoint, endPoint) {
    const { x: endX, y: endY } = endPoint;
    const path = [];
    path.push(startPoint);

    const pointerTwoo = getNextPointer(startPoint, endPoint);
    if (pointerTwoo) {
      this.pointer = pointerTwoo;
    }
    path.push(this.pointer);
    return path;
  }

  renderLine(pointStart, pointEnd) {
    const gr = new PIXI.Graphics();
    gr.lineStyle(4, 0xffd900, 1);
    gr.moveTo(pointStart.x, pointStart.y);
    gr.lineTo(pointEnd.x, pointEnd.y);
    gr.closePath();
    gr.endFill();
    gr.name = 'line';

    this.stage.addChild(gr);
  }

  clearLine() {
    const lines = this.stage.children.filter((child) => child.name && child.name === 'line'),
      len = lines.length;
    for (let i = 0; i < len; i++) {
      lines[len - 1 - i].destroy();
    }
  }

  getNextPointer(start, end) {
    const nextPointer = getNextPointer(start, end);
  }

  runner() {
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  build() {
    this.world = new World(this.engine, this);

    // Matter.World.add(this.engine.world, world);
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}

new Game();
