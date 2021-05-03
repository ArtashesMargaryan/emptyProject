import { Texture } from 'pixi.js';
import BoxContainer from './box-sprite-matter';
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
    this.boxNum = { i: 0, j: 0 };
    this.ball = { x: this.config.width / 2 - 400, y: this.config.height - 65 };
    this.boxes = [];
    this.app = app;
    this._engine.gravity.y = 1;
    this.buildBall('ball1');
    this.buildBoarder();
    this.buildBox({ power: this.buildBoxPower(), i: this.boxNum.i, j: this.boxNum.j, color: '0x11aa11' });
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
        y: 0,
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
        x: 19,
        y: 580,
        width: 40,
        height: 1200,
        texture: new Texture.from('../assets/left.png'),

        type: 'rec',
      },
    ];

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
      const ball = this.app.stage.children.filter((child) => child['name'] == 'ball');

      const position = this.player.positionObj;
      this.player.destroy();
      this.ball.x = position.x;
      this.ball.y = position.y;
      this.buildBall();
      this.updateBoard();
    }
  }

  buildBox(config) {
    const box = new BoxContainer(config, this.app);

    this.boxes.push(box);
    this.app.stage.addChild(box);
    Matter.World.add(this._engine.world, box.body);
    console.warn(this._engine.world);
    Matter.Events.on(this._engine.world, 'collisionStart', (e) => {
      console.warn(e);
    });
    this.nextRow();
  }

  getBall() {
    return this.player;
  }

  updateBoard() {
    if (this.boxes.length > 0) {
      this.boxes.forEach((box) => {
        box.moving();
      });
    }
    console.warn(1);
    // } else {
    this.buildBox({ power: this.buildBoxPower(), i: this.boxNum.i, j: this.boxNum.j, color: '0x11aa11' });
  }

  buildBoxPower() {
    return Math.min(this.boxNum.i, this.boxNum.j) + 1;
  }

  nextRow() {
    if (this.boxNum.i == 18) {
      this.boxNum.j++;
      this.boxNum.i == 0;
    } else {
      this.boxNum.i++;
    }
  }

  buildRectBody(x, y, w, h, i, j) {
    const body = Matter.Bodies.rectangle(x, y, w, h, {
      id: `${i}-${j}`,
      isStatic: true,
      frictionAir: 0,
      friction: 0,
      restitution: 1,
      render: {
        visible: true,
        fillStyle: '#fff',
      },
    });
    return body;
  }

  updatePosition(body) {
    console.warn(body);
  }
}
