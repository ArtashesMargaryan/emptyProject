import { Texture } from 'pixi.js';
import BoxContainer from './box-sprite-matter';
import emitter from './emitter';
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
    this.balls = [];
    this.ballCount = 2;
    this._engine.gravity.y = 1;
    this.buildBalls('ball1');
    this.buildBoarder();
    this.app.ticker.add(this.update, this);
  }

  update() {
    if (!!this.balls && this.balls.length > 0) {
      this.balls.forEach((ball) => {
        ball.update();
      });
    }

    // !!this.players && this.players.static(false) && this.players.update();
  }

  worldUpdate(matrix) {}

  buildBalls() {
    let playerTexture = new Texture.from('../assets/ball.png');
    this.balls = [];
    for (let i = 0; i < 10; i++) {
      this.balls.push(
        new PhysicsSprite({
          density: 0.001,
          isStatic: false,
          engine: this._engine,
          category: 0x001,
          x: this.ball.x,
          y: this.ball.y,
          width: 30,
          height: 30,
          texture: playerTexture,
          type: 'circle',
        })
      );
    }
    this.balls.forEach((ball) => {
      Matter.World.add(this._engine.world, ball.body);

      this._engine.world.gravity.y = 0;
      ball.sprite.name = 'ball';
      this.app.stage.addChild(ball.sprite);
    });
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
    return { x: this.balls[0].sprite.position.x, y: this.balls[0].sprite.position.y };
  }

  stroke(pointA, maxCoefficient) {
    let i = 0;
    const int = setInterval(() => {
      if (!this.balls[i]) {
        clearInterval(int);
        return;
      }
      this.balls[i].body.density = 0.001;
      this.balls[i].body.angle = 0;
      this.balls[i].body.speed = 0;

      this.ball.x = this.balls[i].body.position.x;
      this.ball.y = this.balls[i].body.position.y;
      const coeff = coefficient(pointA, { x: this.ball.x, y: this.ball.y }, maxCoefficient);
      this.balls[i].body.isStatic = false;
      this.balls[i].body.force.y = coeff.y;
      this.balls[i].body.force.x = coeff.x;
      i++;
      if (int === this.ballCount) {
        clearInterval(int);
        return;
      }
    }, 60);
  }

  ballRebuild() {
    if (!!this.balls) {
      // const ball = this.app.stage.children.filter((child) => child['name'] == 'ball');
      const position = this.balls[0].positionObj;
      this.ball.x = position.x;
      this.ball.y = position.y;
      const ball = [];
      this.balls.forEach((ball) => {
        // bal const position = this.player.positionObj;
        ball.destroy();
      });
      this.buildBalls();
      this.updateBoard();

      // this.buildBalls();
      // this.updateBoard();
    }
  }

  buildBox(config) {
    const box = new BoxContainer(config, this.app);

    this.boxes.push(box);
    this.app.stage.addChild(box);
    Matter.World.add(this._engine.world, box.body);
    Matter.Events.on(this._engine.world, 'collisionStart', (e) => {
      console.warn(e);
    });
    this.nextRow();
  }

  getBall() {
    return this.balls;
  }

  boxUpdate(id) {
    this.boxes.forEach((box) => {
      if (box.body.id == id) {
        box.updatePower(this._engine.world);
      }
    });
  }

  updateBoard() {
    if (this.boxes.length > 0) {
      this.boxes.forEach((box) => {
        box.moving();
      });
    }
    // } else {
    emitter.emit('updateBoard');
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
