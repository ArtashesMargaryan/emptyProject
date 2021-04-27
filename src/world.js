import { Texture } from 'pixi.js';
import Matter from './matter';
import PhysicsSprite from './sprite-matter';

export class World {
  constructor(engine, app) {
    this._engine = engine;

    this.app = app;
    this.buildBall('ball1');
    this.app.ticker.add(this.update, this);
  }

  update() {
    !!this.player && this.player.update();
  }

  buildBall(id) {
    let playerTexture = new Texture.from('../assets/ball.png');
    this.player = new PhysicsSprite(id, this._engine, 0x001, 100, 100, 40, 40, playerTexture, 'circle');

    Matter.World.addBody(this._engine.world, this.player.body);

    this.app.stage.addChild(this.player.sprite);
  }

  buildBoarder() {}
}
