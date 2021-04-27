import { Texture } from 'pixi.js';
import Matter from './matter';
import PhysicsSprite from './sprite-matter';

export class World {
  constructor(engine, app) {
    this._engine = engine;
    this.config = {
      width: 2400,
      height: 1600,
    };
    this.app = app;
    this._engine.gravity.y = 1;
    this.buildBall('ball1');
    this.buildBoarder();
    this.app.ticker.add(this.update, this);
  }

  update() {
    !!this.player && this.player.update();
  }

  buildBall(id) {
    let playerTexture = new Texture.from('../assets/ball.png');
    this.player = new PhysicsSprite(id, this._engine, 0x001, 1200, 1630, 40, 40, playerTexture, false, 'circle');

    Matter.World.add(this._engine.world, this.player.body);

    // speed: 0,
    // angularSpeed: 0,
    // velocity: { x: 0, y: 0 },
    // angularVelocity: 0,
    this.app.stage.addChild(this.player.sprite);
  }

  buildBoarder() {
    const bottom = new Texture.from('../assets/wall.png');
    this.bottomBoarder = [];
    for (let i = 1; i < 62; i++) {
      const spriteB = new PhysicsSprite(
        'bottom' + i,
        this._engine,
        0x001,
        40 * i,
        this.config.height + 50,
        3,
        3,
        bottom,
        true,
        'rectangle'
      );
      const spriteT = new PhysicsSprite('bottom' + i, this._engine, 0x001, 40 * i, 50, 3, 3, bottom, true, 'rectangle');
      this.app.stage.addChild(spriteB.sprite);
      this.bottomBoarder.push(spriteB.body);
      this.app.stage.addChild(spriteT.sprite);
      this.bottomBoarder.push(spriteT.body);
    }
    for (let i = 1; i < 40; i++) {
      const spriteB = new PhysicsSprite(
        'bottom' + i,
        this._engine,
        0x001,
        40,
        40 * i + 50,
        3,
        3,
        bottom,
        true,
        'rectangle'
      );
      const spriteT = new PhysicsSprite(
        'bottom' + i,
        this._engine,
        0x001,
        this.config.width + 40,
        40 * i + 50,
        3,
        3,
        bottom,
        true,
        'rectangle'
      );
      this.app.stage.addChild(spriteB.sprite);
      this.bottomBoarder.push(spriteB.body);
      this.app.stage.addChild(spriteT.sprite);
      this.bottomBoarder.push(spriteT.body);
    }
    Matter.World.add(this._engine.world, this.bottomBoarder);
  }

  getBallPosition() {
    return { x: this.player.sprite.position.x, y: this.player.sprite.position.y };
  }
}
