import { Container, Sprite, Text, Texture } from 'pixi.js';
import Matter from './matter';

export default class BoxContainer extends Container {
  constructor(config, app) {
    super();
    this.app = app;
    const { i, j } = config;
    this.app.ticker.add(this.updatePosition, this);
    this.createSprite(i);
    this.createBody(this.sprite.x, 80, 80, 80, 1, 2);
    this.createText(config.power, this.sprite);
  }

  createSprite(i) {
    const texture = new Texture.from('../assets/farfor.png');
    const sprite = new Sprite(texture);
    sprite.position.set(80 * i + 80, 80);
    sprite.anchor.set(0.5, 0.5);

    this.addChild((this.sprite = sprite));
  }

  static() {
    this._body.isStatic = false;
  }

  moving() {
    this.prevPosition = this.body.position.y + 80;
    if (this.body.isStatic) {
      this.body.isStatic = false;
      this.body.position.y += 8;
      // this.body.isStatic = true;
    }
  }

  createBody(x, y, w, h, i, j) {
    const body = Matter.Bodies.rectangle(x, y, w, h, {
      name: 'box',
      isStatic: true,
      frictionAir: 0,
      friction: 0,
      restitution: 1,
      render: {
        visible: true,
        fillStyle: '#fff',
      },
    });
    this.body = body;
    // Matter.World.add(this._engine.world, body);
  }

  createText(text, cont) {
    const newText = new Text(text, {
      fontSize: 80,
      fill: 0xff1010,
      align: 'center',
      x: cont.x,
      y: cont.y,
    });
    newText.anchor.set(0.5);
    this.sprite.addChild(newText);
    // text.x = -25;
    // text.y = -30;
  }

  updatePosition() {
    // console.warn(this.body.position.y);
    if (this.body.position.y - this.prevPosition >= 8) {
      this.body.isStatic = true;
    } else {
      this.sprite.y = this.body.position.y;
      this.sprite.x = this.body.position.x;
    }
  }
}
