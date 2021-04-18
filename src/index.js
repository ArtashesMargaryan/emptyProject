/**
 * A Box2D / Planck.js demo
 *
 **/
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
      radius: 0.3,
    };
    this.ballFixtureDef = {};
    this.ballFixtureDef.density = 10.0;
    this.ballFixtureDef.position = this.planck.Vec2(0.0, 0.0);

    this.world = this.planck.World(this.planck.Vec2(0, 9.8), true);
    this.addBoundaries();

    setInterval(() => {
      this.addBall();
    }, 500);

    this.addBall();

    /*for(let i = 0;i<120;++i){
  addBall();
  }*/

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
    // const sprite = PIXI.Sprite.from('/assets/ball.png');
    const sprite = PIXI.Sprite.from(this.bouildBall());

    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    return sprite;
  }

  addEdge(body, w, angle) {
    const { x, y } = body.getPosition();
    console.warn(x, y);
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
    body.setPosition(this.planck.Vec2(4, 0));
    /*const fd = {};
      fd.density = 10.0;
      fd.position = Vec2(0.0, 0.0);*/
    body.createFixture(this.planck.Circle(this.config.radius), this.ballFixtureDef);

    const pos = body.getPosition();
    const circle = this.addCircle(pos.x, pos.y);
    circle.body = body;

    this.board.addChild(circle);
  }

  addBoundaries() {
    const boundaryBottom = this.world.createBody();
    let width = this.getGameSize(this.stage.width);
    let height = this.getGameSize(this.stage.height);
    boundaryBottom.createFixture(
      this.planck.Edge(this.planck.Vec2(-width / 2, 0.0), this.planck.Vec2(width / 2, 0.0)),
      0.0
    );
    boundaryBottom.setPosition(this.planck.Vec2(width / 2.0, height));
    const bottom = this.addEdge(boundaryBottom, this.stage.width, 0);

    this.boundaries.push(bottom);

    const boundaryMid = this.world.createBody();
    let x = 5;
    let y = 8;
    let edgeWidth = 10;
    boundaryMid.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryMid.setPosition(this.planck.Vec2(x, y));
    boundaryMid.setAngle(0.2);
    const mid = this.addEdge(boundaryMid, this.getPlanckSize(edgeWidth), 0.2);
    this.boundaries.push(mid);

    let x2 = x + 14;
    let y2 = y + 9;
    const boundaryMid2 = this.world.createBody();
    boundaryMid2.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryMid2.setPosition(this.planck.Vec2(x2, y2));
    boundaryMid2.setAngle(-0.2);
    const mid2 = this.addEdge(boundaryMid2, this.getPlanckSize(edgeWidth), -0.2);
    this.boundaries.push(mid2);

    edgeWidth = height;
    const boundaryleft = this.world.createBody();
    boundaryleft.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryleft.setPosition(this.planck.Vec2(0, height / 2));
    boundaryleft.setAngle(1.5708);
    const left = this.addEdge(boundaryleft, this.getPlanckSize(edgeWidth), 1.5708);
    this.boundaries.push(left);

    const boundaryright = this.world.createBody();
    boundaryright.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryright.setPosition(this.planck.Vec2(width, height / 2));
    boundaryright.setAngle(1.5708);
    const right = this.addEdge(boundaryright, this.getPlanckSize(edgeWidth), 1.5708);
    this.boundaries.push(right);

    this.boundaries.forEach((child) => this.stage.addChild(child));
  }

  updateWorld() {
    for (let i = 0; i < this.board.children.length; i++) {
      const sprite = this.board.children[i];
      const pos = sprite.body.getPosition();
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
