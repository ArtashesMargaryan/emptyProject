import { Sprite } from 'pixi.js';
import emitter from './emitter';
import Matter from './matter';

export default class PhysicsSprite {
  constructor(config) {
    this.touchDown = false;
    const {
      id,
      engine,
      isStatic = true,
      x,
      y,
      width,
      height,
      texture,
      type,
      friction,
      gravity = 0,
      density = 0.005,
    } = config;
    this._id = id;
    this.config = config;
    this._engine = engine;
    this.category = '0x000';
    this.density = density;
    this.x = x;
    this.y = y;
    this.isStatic = isStatic;

    this.width = width;
    this.height = height;

    this.texture = texture;
    this.type = type;
    this.friction = friction;
    this.gravity = gravity;
    this.createPhysics();
    this.createSprite();
  }

  createPhysics() {
    let options = {
      density: this.density,
      isStatic: this.isStatic,
      frictionAir: 0,
      friction: 0,
      restitution: 1,
      label: this._id,
    };

    if (this.type === 'circle') {
      this._body = Matter.Bodies.circle(this.x, this.y, this.width, options);
    } else {
      this._body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    }
    return this._body;
  }

  createSprite() {
    this._sprite = new Sprite(this.texture);
    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
    this._sprite.x = this.x;
    this._sprite.y = this.y;
  }

  static() {
    this._body.isStatic = false;
  }

  update() {
    if (!!this._body) {
      if (Math.abs(this._body.velocity.y) > 50) {
        this._body.velocity.y = (this._body.velocity.y / Math.abs(this._body.velocity.y)) * 50;
      }
      if (this._body.position.y >= 1120 && this.touchDown) {
        this._body.isStatic = true;
        this._body.force.y = 0;
        this._body.force.x = 0;
        emitter.emit('newStep');
        this.touchDown = false;
        return;
      }
      this._sprite.x = this._body.position.x;
      this._sprite.y = this._body.position.y;
      if (this._body.position.y < 1120) {
        this.touchDown = true;
      }
      this._sprite.rotation = this._body.angle;
    }
  }

  destroy() {
    Matter.World.remove(this._engine.world, this._body);
    this._body = null;

    this._sprite.destroy();
    this._sprite = null;
    // this._sprite.destroy();
  }

  get body() {
    return this._body;
  }

  set body(newBody) {
    this._body = newBody;
  }

  get sprite() {
    return this._sprite;
  }

  set sprite(newSprite) {
    this._sprite = newSprite;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get positionObj() {
    return this._body.position;
  }
}
