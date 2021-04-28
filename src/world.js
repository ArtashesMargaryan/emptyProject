import Emitter from 'event-e3';
import { Texture } from 'pixi.js';
import Matter from './matter';
import PhysicsSprite from './sprite-matter';
import { coefficient } from './utils';
const emitt = new Emitter();

function emitter() {
  return emitt;
}
export class World {
  constructor(engine, app) {
    this._engine = engine;
    this.config = {
      width: 1600,
      height: 1200,
    };
    this.ball = { x: this.config.width / 2, y: this.config.height - 80 };
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
    const bottom = new Texture.from('../assets/wall.png');
    this.bottomBoarder = [];
    for (let i = 1; i < 41; i++) {
      const spriteB = new PhysicsSprite({
        id: 'bottom' + i,
        engine: this._engine,
        category: 0x001,
        x: 40 * i - 20,
        y: this.config.height - 20,
        width: 40,
        height: 40,
        texture: bottom,

        type: 'rec',
      });
      const spriteT = new PhysicsSprite({
        id: 'bottom' + i + '-' + i,
        engine: this._engine,
        category: 0x001,
        x: 40 * i - 20,
        y: 20,
        width: 40,
        height: 40,
        texture: bottom,

        type: 'rec',
      });
      this.app.stage.addChild(spriteB.sprite);
      this.bottomBoarder.push(spriteB.body);
      this.app.stage.addChild(spriteT.sprite);
      this.bottomBoarder.push(spriteT.body);
    }
    for (let i = 1; i < 30; i++) {
      const spriteB = new PhysicsSprite({
        id: 'bottom' + i + '_' + i,
        engine: this._engine,
        category: 0x001,
        x: 20,
        y: 40 * i - 20,
        width: 40,
        height: 40,
        texture: bottom,

        type: 'rec',
      });
      const spriteT = new PhysicsSprite({
        id: 'bottom' + i + '_' + i,
        engine: this._engine,
        category: 0x001,
        x: this.config.width - 20,
        y: 40 * i - 20,
        width: 40,
        height: 40,
        texture: bottom,
        type: 'rec',
      });
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

  stroke(pointA, maxCoefficient) {
    this.player.body.density = 0.001;
    this.ball.x = this.player.body.position.x;
    this.ball.y = this.player.body.position.y;
    const coeff = coefficient(pointA, { x: this.ball.x, y: this.ball.y }, maxCoefficient);
    // console.warn(pointA, { x: this.ball.x, y: this.ball.y }, maxCoefficient);
    console.warn(coeff);
    // this.player.body.velocity.x = coeff.x;
    // this.player.body.velocity.y = coeff.y;

    this.player.body.force.y = coeff.y;
    this.player.body.force.x = coeff.x;
    // torque: 0,
    // positionImpulse: { x: 0, y: 0 },
    // constraintImpulse: { x: 0, y: 0, angle: 0 },
    // totalContacts: 0,
    // speed: 0,
    // angularSpeed: 0,
    // velocity: { x: 0, y: 0 },
    // angularVelocity: 0,
    // isSensor: false,
    // isStatic: false,
    // isSleeping: false,
    // motion: 0,
    // sleepThreshold: 60,
    // density: 0.001,
    // restitution: 0,
    // friction: 0.1,
    // frictionStatic: 0.5,
    // frictionAir: 0.01,
  }

  ballStope() {}
}
