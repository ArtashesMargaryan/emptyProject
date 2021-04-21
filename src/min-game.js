import * as PIXI from 'pixi.js';
import * as planck from 'planck-js';

class Game extends PIXI.Application {
  constructor() {
    super({
      width: 640,
      height: 640,
      backgroundColor: 0xaa99aa,
      autoResize: true,
      resolution: window.devicePixelRatio,
      antialias: true,
    });
    document.body.appendChild(this.view);
    this.globalScale = 30;
    this.stage.interactive = true;
    this.stage.hitArea = this.screen;
    this.planck = planck;
    this.boundaries = [];

    this.bouildBoard();
    this.init();

    this.board;
  }

  init() {
    this.stage.scale.x = 1;
    this.stage.scale.y = 1;
    this.config = {
      radius: 0.65,
    };
    this.ballFixtureDef = {};
    this.ballFixtureDef.density = 10.0;
    this.ballFixtureDef.position = this.planck.Vec2(0.0, 0.0);

    this.world = this.planck.World(this.planck.Vec2(0, 9.8), true);
    this.addBoundaries();

    const setInt = setInterval(() => {
      this.addBall();
    }, 500);

    this.addBall();

    /*for(let i = 0;i<120;++i){
  addBall();
  }*/

    setTimeout(() => {
      clearInterval(setInt);
    }, 400);

    this.ticker.add(() => {
      this.play();
    });
  }

  play() {
    this.world.step(1 / 60, this.ticker.elapsedMS / 1000);
    this.updateWorld();
  }

  getPlanckSize(value) {
    return value * this.globalScale;
  }

  getGameSize(value) {
    return value / this.globalScale;
  }

  bouildBoard() {
    this.board = new PIXI.Container();
    this.stage.addChild(this.board);
  }

  bouildBall() {
    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = this.getPlanckSize(this.config.radius) * 2;
    ballCanvas.height = this.getPlanckSize(this.config.radius) * 2;
    this.ballCanvas = ballCanvas;
    const ctx = ballCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(
      this.getPlanckSize(this.config.radius),
      this.getPlanckSize(this.config.radius),
      this.getPlanckSize(this.config.radius),
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.stroke();
    return ballCanvas;
  }

  addCircle(x, y) {
    const sprite = PIXI.Sprite.from('/assets/ball1.png');
    // const sprite = PIXI.Sprite.from(this.bouildBall());

    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    // sprite.rotation = angle;

    return sprite;
  }

  addEdge(body, w, angle) {
    const { x, y } = body.getPosition();
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff, 1);
    g.lineStyle(0);
    g.drawRect(0, 0, w, 2);
    g.endFill();

    const t = this.renderer.generateTexture(g);
    const boundary = PIXI.Sprite.from(t);
    boundary.anchor.set(0.5);
    boundary.position.set(this.getPlanckSize(x), this.getPlanckSize(y));
    boundary.rotation = angle;
    boundary.body = body;
    return boundary;
  }

  addBall() {
    const body = this.world.createBody().setDynamic();
    console.warn(body.m_angularVelocity);

    body.setPosition(this.planck.Vec2(4, 0));
    /*const fd = {};
      fd.density = 10.0;
      fd.position = Vec2(0.0, 0.0);*/
    body.createFixture(this.planck.Circle(this.config.radius), this.ballFixtureDef);

    const pos = body.getPosition();
    const circle = this.addCircle(pos.x, pos.y);
    circle.body = body;
    circle.name = 'circle';
    this.board.addChild(circle);
  }

  addBoundaries() {
    // const boundaryBottom = this.world.createBody();
    // let width = this.getGameSize(this.board.width);
    // let height = this.getGameSize(this.board.height);
    // boundaryBottom.createFixture(this.planck.Edge(this.planck.Vec2(0.0, 0.0), this.planck.Vec2(width, 0.0)), 0.0);
    // boundaryBottom.setPosition(this.planck.Vec2(width / 2.0, 8));
    // const bottom = this.addEdge(boundaryBottom, this.board.width, 0);

    // this.boundaries.push(bottom);

    const boundaryBottom = this.world
      .createBody({
        gravityScale: 10,
        linearDamping: 10,
        angularDamping: 0.1,
      })
      .setStatic();
    let x = 20;
    let y = 20;
    let edgeWidth = 25;
    boundaryBottom.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth, 0.0), this.planck.Vec2(edgeWidth, 0.0)),
      0.0
    );
    boundaryBottom.setPosition(this.planck.Vec2(x / 2, y));
    boundaryBottom.setAngle(0);

    const mid = this.addEdge(boundaryBottom, this.getPlanckSize(edgeWidth), 0);
    this.boundaries.push(mid);

    ////left

    const boundaryLeft = this.world.createBody().setStatic();
    let xLeft = 0;
    let yLeft = 11.4;
    let edgeWidthLeft = 17;
    boundaryLeft.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidthLeft, yLeft), this.planck.Vec2(edgeWidthLeft, yLeft)),
      0.0
    );
    boundaryLeft.setPosition(this.planck.Vec2(xLeft + 1, yLeft));
    boundaryLeft.setAngle(0);

    const midLeft = this.addEdge(boundaryLeft, this.getPlanckSize(edgeWidthLeft), Math.PI / 2);
    this.boundaries.push(midLeft);

    ///rigth
    const boundaryRight = this.world.createBody();
    let xRight = 3;
    let yRight = 11.4;
    let edgeWidthRight = 17;
    boundaryRight.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidthRight, yRight), this.planck.Vec2(edgeWidthRight, yRight)),
      0.0
    );
    boundaryRight.setPosition(this.planck.Vec2(xRight + edgeWidthRight, yRight));
    boundaryRight.setAngle(0);

    const midRight = this.addEdge(boundaryRight, this.getPlanckSize(edgeWidthRight), Math.PI / 2);
    this.boundaries.push(midRight);

    this.boundaries.forEach((child) => this.board.addChild(child));
  }

  updateWorld() {
    for (let i = 0; i < this.board.children.length; i++) {
      const sprite = this.board.children[i];
      const angle = sprite.body.m_angularVelocity;
      if (sprite.name === 'circle') {
        sprite.rotation = angle;
      }
      const pos = sprite.body.getPosition();
      // const angle = sprite.body.rotation;
      /*if (pos.x < -10 || pos.x > global.width + 10) {
          group.removeChild(sprite);
          boundaries.splice(boundaries.indexOf(sprite.body), 1);
          i--;
        } else*/
      sprite.position.set(this.getPlanckSize(pos.x), this.getPlanckSize(pos.y));
    }
  }
}

new Game();
