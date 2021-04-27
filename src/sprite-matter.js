import { Sprite } from 'pixi.js';
import Matter from './matter';

export default class PhysicsSprite {
  constructor(
    id,
    engine,
    category,
    x,
    y,
    width,
    height,
    texture,
    isStatic,
    type = 'rectangle',
    friction = 0,
    gravity = 0
  ) {
    this._id = id;
    this._engine = engine;
    this.category = '0x000';

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
      positionImpulse: { x: 0, y: 0 },
      constraintImpulse: { x: 0, y: -20, angle: 0 },
      isStatic: this.isStatic,
      frictionAir: 0,
      friction: this.friction,
      inertia: Infinity,
      isSensor: false,
      label: this._id,
      mass: 5,
      restitution: 1,
      collisionFilter: {
        category: 1,
      },
    };

    if (this.type === 'circle') {
      console.warn(Matter);
      this._body = Matter.Bodies.circle(this.x, this.y, this.width, options);
    } else {
      this._body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    }
  }

  createSprite() {
    this._sprite = new Sprite(this.texture);
    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
    this._sprite.x = this.x;
    this._sprite.y = this.y;
  }

  update() {
    if (this._body) {
      this._sprite.x = this._body.position.x;
      this._sprite.y = this._body.position.y;
      this._sprite.rotation = this._body.angle;
    }
  }

  destroy() {
    Matter.World.remove(this._engine.world, this._body);
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
}
