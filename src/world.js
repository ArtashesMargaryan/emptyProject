import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import Matter from './matter';
import PhysicsSprite from './sprite-matter';
import { coefficient } from './utils';

export class World {
  constructor(engine, app) {
    this._engine = engine;
    this.config = {
      width: 1600,
      height: 1200,
    };

    this.ball = { x: this.config.width / 2 - 400, y: this.config.height - 65 };
    this.app = app;
    this._engine.gravity.y = 1;
    this.buildBall('ball1');
    this.buildBoarder();
    this.app.ticker.add(this.update, this);
  }

  update() {
    !!this.player && this.player.update();

    // !!this.player && this.player.static(false) && this.player.update();
  }

  worldUpdate(matrix) {}

  buildBall(id = '1') {
    let playerTexture = new Texture.from('../assets/ball.png');
    this.player = new PhysicsSprite({
      id: id,
      density: 0.001,
      isStatic: false,
      engine: this._engine,
      category: 0x001,
      x: this.ball.x,
      y: this.ball.y,
      width: 40,
      height: 40,
      texture: playerTexture,

      type: 'circle',
    });

    Matter.World.add(this._engine.world, this.player.body);

    this._engine.world.gravity.y = 0;
    this.player.sprite.name = 'ball';
    this.app.stage.addChild(this.player.sprite);
  }

  buildBoarder() {
    const config = [
      {
        id: 'bottom',
        engine: this._engine,
        category: 0x001,
        x: 800,
        y: 1180,
        width: 1600,
        height: 40,
        texture: new Texture.from('../assets/bottom.png'),

        type: 'rec',
      },
      {
        id: 'top',
        engine: this._engine,
        category: 0x001,
        x: 800,
        y: -10,
        width: 1600,
        height: 40,
        texture: new Texture.from('../assets/bottom.png'),

        type: 'rec',
      },
      {
        id: 'right',
        engine: this._engine,
        category: 0x001,
        x: 1580,
        y: 580,
        width: 40,
        height: 1200,
        texture: new Texture.from('../assets/left.png'),

        type: 'rec',
      },
      {
        id: 'left',
        engine: this._engine,
        category: 0x001,
        x: 0,
        y: 580,
        width: 40,
        height: 1200,
        texture: new Texture.from('../assets/left.png'),

        type: 'rec',
      },
    ];
    const left = new Texture.from('../assets/left.png');
    const bottom = new Texture.from('../assets/bottom.png');
    this.bottomBoarder = [];
    config.forEach((sprite, index) => {
      const spriteL = new PhysicsSprite(sprite);

      this.app.stage.addChild(spriteL.sprite);
      this.bottomBoarder.push(spriteL.body);
    });

    Matter.World.add(this._engine.world, this.bottomBoarder);
  }

  getBallPosition() {
    return { x: this.player.sprite.position.x, y: this.player.sprite.position.y };
  }

  stroke(pointA, maxCoefficient) {
    this.player.body.density = 0.001;
    this.player.body.angle = 0;
    this.player.body.speed = 0;

    this.ball.x = this.player.body.position.x;
    this.ball.y = this.player.body.position.y;
    const coeff = coefficient(pointA, { x: this.ball.x, y: this.ball.y }, maxCoefficient);
    this.player.body.isStatic = false;
    this.player.body.force.y = coeff.y;
    this.player.body.force.x = coeff.x;
  }

  ballRebuild() {
    if (!!this.player) {
      // this.player.body.force.y = -this.player.body.force.y;
      // this.player.body.force.x = -this.player.body.force.x;
      console.warn(this.app.stage.children.filter((child) => child['name'] == 'ball'));
      const ball = this.app.stage.children.filter((child) => child['name'] == 'ball');

      const position = this.player.positionObj;
      this.player.destroy();
      this.ball.x = position.x;
      this.ball.y = position.y;
      // this.app.stage.removeChild(this.app.stage.children.filter((child) => child['name'] == 'ball'));
      this.buildBall();
      console.warn(position);
      this.buildBox({ power: 5, i: 5, j: 5, color: '0x11aa11' });
    }
  }

  buildBox(config) {
    const { power, i, j, color } = config;
    const container = new PIXI.Container();
    const gr = new PIXI.Graphics();
    gr.beginFill(color);
    gr.drawRect(0, 0, 40, 40);
    gr.endFill();
    container.id = `${i}-${j}`;
    container.addChild(gr);
    gr.addChild(new PIXI.Text(power));
    // this._body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    const body = Matter.Bodies.rectangle(container.position.x, container.position.y, 40, 40, {
      id: container.id,
      isStatic: true,
    });
    container.body = body;
    console.warn(body);
    Matter.World.add(this._engine.world, body);

    container.position.set(i * 40, j * 40);
    this.app.stage.addChild(container);
  }

  getBall() {
    return this.player;
  }
}
