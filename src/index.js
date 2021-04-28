import * as PIXI from 'pixi.js';
import Matter from './matter';
import { getNextPointer } from './utils';
import { World } from './world';
export class Game extends PIXI.Application {
  constructor() {
    super({ width: window.innerWidth, height: innerHeight, backgroundColor: '0xf11112f' });
    document.body.appendChild(this.view);
    document.body.addEventListener('mousemove', this.buildAim.bind(this));
    document.body.addEventListener('pointerdown', this.fire.bind(this));
    this.mouseConstraint = Matter.MouseConstraint;
    this.mouse = Matter.Mouse;
    this.init();
    this.runRender();
    // this.buildWord();
    this.build();

    this.angularF;
  }

  fire(e) {
    this.world.stroke({ x: Math.round(e.clientX), y: Math.round(e.clientY) }, this.config.maxCoefficient);
  }

  buildAim(e) {
    let startPosition;
    const path = [];
    if (this.world) {
      startPosition = { x: this.world.getBallPosition().x, y: this.world.getBallPosition().y };
    }
    this.startPosition = startPosition;
    path.push({ x: startPosition.x, y: startPosition.y });
    let x, y;
    this.buildPath(startPosition, { x: e.clientX, y: e.clientY });
    // this.stage.removeChildren(this.stage.children.length - 2, this.stage.children.length - 1);
  }

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
    console.warn(endX, endY);
    let x, y;
    if (endX < 40) {
      x = 40;
    } else if (endX > 1560) {
      x = 1560;
    } else {
      x = endX;
    }

    if (endY < 40) {
      y = 40;
    } else if (endY > 1100) {
      y = 1100;
    } else {
      y = endY;
    }

    if (y != 40) {
      const pointA = getNextPointer(startPoint, { x: x, y: y }, 40);
      console.warn(pointA);
      path.push({ x: x, y: y });
    }

    this.clearLine();
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
