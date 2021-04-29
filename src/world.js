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

  buildBall(id) {
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
    console.warn(this.player.body);
    this.player.body.isStatic = false;
    this.player.body.force.y = coeff.y;
    this.player.body.force.x = coeff.x;
  }

  ballRebuild() {
    !!this.player && this.player.destroy();
  }

  getBall() {
    return this.player;
  }
}
