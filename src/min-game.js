const pscale = 30;

function mpx(m) {
  return m * pscale;
}

function pxm(p) {
  return p / pscale;
}

import * as PIXI from 'pixi.js';
import * as Planck from 'planck-js';

export class ArtBooble extends PIXI.Application {
  constructor() {
    super({
      width: 850,
      height: 650,
      backgroundColor: 'rgb(120,100,100)',
    });
    document.body.appendChild(this.view);
    this.boundaries = [];
    console.warn(Planck);
    this.planck = Planck;
    this.config = {
      spiners: [
        { x: 400, y: 800, w: 150, h: 20, angl: Math.PI / 4, pivotX: 0.4, pivotY: 0.65 },
        { x: 700, y: 800, w: 150, h: 20, angl: Math.PI / 4, pivotX: 1, pivotY: 0.65 },
        { x: 700, y: 550, w: 150, h: 20, angl: Math.PI / 4, pivotX: 0.4, pivotY: 0.65 },
        { x: 300, y: 650, w: 150, h: 20, angl: Math.PI / 4, pivotX: 0.4, pivotY: 0.65 },
        { x: 190, y: 450, w: 150, h: 20, angl: Math.PI / 4, pivotX: 0.93, pivotY: 0.65 },
        { x: 600, y: 490, w: 150, h: 20, angl: Math.PI / 4, pivotX: 1.1, pivotY: 0.65 },
        { x: 600, y: 250, w: 150, h: 20, angl: Math.PI / 4, pivotX: 0.6, pivotY: 0.65 },
      ],

      gravity: Planck.Vec2(0.0, -10.0),
    };
    this.world = this.planck.World(this.planck.Vec2(0, 9.8), true);
    this.buildBoard();
    this.buildBalls();
    this.addBall();

    this.addBoundaries();

    setTimeout(() => {
      this.play();
    }, 1000);
    this.ticker.add(() => {
      this.addBall();
    }, this);
  }

  buildBoard() {
    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.buildWorld();
    this.config.spiners.forEach((spiner) => {
      this.buildSpiner(spiner.x, spiner.y, spiner.w, spiner.h, spiner.angl, spiner.pivotX, spiner.pivotY);
    });
  }

  buildBalls() {
    const radius = 0.9; //meters!
    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = 100;
    ballCanvas.height = 100;

    const ctx = ballCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(mpx(radius), mpx(radius), mpx(radius), 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    const ballFixtureDef = {};
    ballFixtureDef.density = 10.0;
    ballFixtureDef.position = this.planck.Vec2(0.0, 0.0);

    this.ballFixtureDef = ballFixtureDef;
  }

  buildBall(pos) {
    const ball = new PIXI.Container();
    // if (!this.ball || this.ball.children.length === 0) {
    const gr = new PIXI.Graphics();
    gr.beginFill(0xdd1122);
    gr.drawCircle(60, 70, 30);
    ball.addChild(gr);
    // }
    ball.position.set(pos.x, pos.y);

    const t = this.renderer.generateTexture(gr);
    // const t = this.app.renderer.generateTexture(g);
    const boundary = PIXI.Sprite.from(t);
    boundary.anchor.set(0.5);
    return boundary;
  }

  updateWorld() {
    for (let i = 1; i < this.board.children.length; i++) {
      const sprite = this.board.children[i];
      if (!sprite.children[0]) {
        console.warn(1);
        continue;
      }
      const pos = { x: sprite.children[0].position.x, y: sprite.children[0].position.y };
      /*if (pos.x < -10 || pos.x > global.width + 10) {
           group.removeChild(sprite);
           boundaries.splice(boundaries.indexOf(sprite.body), 1);
           i--;
         } else*/
      sprite.position.set(pos.x, pos.y);
    }
  }

  addBall() {
    //////////////*********** */
    const ballFixtureDef = this.ballFixtureDef;
    const body = this.planck.World().createBody().setDynamic();
    body.setPosition(this.planck.Vec2(50, 0));
    /*const fd = {};
   fd.density = 10.0;
   fd.position = Vec2(0.0, 0.0);*/
    body.createFixture(this.planck.Circle(0.9), ballFixtureDef);

    const pos = body.getPosition();
    if (this.board.children.length < 10) {
      const circle = this.buildBall(pos);

      circle.anchor.set(0.5);
      circle.position.set(body.getPosition().x, body.getPosition().y);
      this.board.addChild((this.ball = circle));
      circle.body = body;
    }
  }

  buildWorld() {
    const board = new PIXI.Container();

    const gr = new PIXI.Graphics();
    gr.lineStyle(2, 0xffffff, 1);
    gr.beginFill(0x2d3b30);
    gr.drawRect(0, 0, 840, 600);
    gr.endFill();
    // board.addChild(gr);
    this.container.addChild((this.board = board));
    //////************************ */

    const world = this.planck.World(this.planck.Vec2(0, 9.8), true);
    const boundaryBottom = world.createBody();

    boundaryBottom.createFixture(
      this.planck.Edge(this.planck.Vec2(this.board.x, 0.0), this.planck.Vec2(this.board.x + this.board.width, 0.0)),
      0.0
    );
    boundaryBottom.setPosition(this.planck.Vec2(this.board.x, this.board.y + this.board.height));
    const bottom = this.addEdge(boundaryBottom, this.board.width, 0);
    this.boundaries.push(bottom);
    /////*********** */

    // const boundaryTop = world.createBody();
    // boundaryTop.createFixture(
    //   this.planck.Edge(this.planck.Vec2(this.board.x, 0.0), this.planck.Vec2(this.board.x + this.board.width, 0.0)),
    //   0.0
    // );
    // boundaryTop.setPosition(this.planck.Vec2(this.board.x, this.board.position.y));
    // const top = this.addEdge(boundaryTop, this.board.width, 0);

    // this.boundaries.push(top);
  }

  buildSpiner(x, y, w, h, angl, pivotX, pivotY) {
    const container = new PIXI.Container();
    const gr = new PIXI.Graphics();
    gr.lineStyle(1, 0xffffff, 1);
    gr.beginFill(0xff0303);
    gr.drawRect(x * Math.sin(angl), y * Math.cos(angl), w, h);
    // gr.pivot.set(pivotX, pivotY);
    gr.endFill();
    container.addChild(gr);

    const gr1 = new PIXI.Graphics();
    gr1.lineStyle(1, 0xffffff, 1);

    gr1.beginFill(0x2d3b30);
    gr1.drawCircle((x + pivotX * w) * Math.sin(angl), (y + pivotY * h) * Math.cos(angl), Math.min(w / 2, h / 2));
    gr1.endFill();
    container.addChild(gr1);
    container.pivot.set(container.width / 2, container.height / 2);
    const t = this.renderer.generateTexture(container);
    // container.rotation = 0.7;

    this.board.addChild(container);
  }

  addBoundaries() {
    return;
    const world = this.planck.World(this.planck.Vec2(0, 9.8), true);
    const boundaryBottom = world.createBody();
    let width = pxm(global.gameWidth);
    let height = pxm(global.gameHeight);
    boundaryBottom.createFixture(
      this.planck.Edge(this.planck.Vec2(-width / 2, 0.0), this.planck.Vec2(width / 2, 0.0)),
      0.0
    );
    boundaryBottom.setPosition(this.planck.Vec2(width / 2.0, height));
    const bottom = this.addEdge(boundaryBottom, global.gameWidth, 0);

    this.boundaries.push(bottom);

    const boundaryMid = world.createBody();
    let x = 5;
    let y = 8;
    let edgeWidth = 10;
    boundaryMid.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryMid.setPosition(this.planck.Vec2(x, y));
    boundaryMid.setAngle(0.2);
    const mid = this.addEdge(boundaryMid, mpx(edgeWidth), 0.2);
    this.boundaries.push(mid);

    let x2 = x + 14;
    let y2 = y + 9;
    const boundaryMid2 = world.createBody();
    boundaryMid2.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryMid2.setPosition(this.planck.Vec2(x2, y2));
    boundaryMid2.setAngle(-0.2);
    const mid2 = this.addEdge(boundaryMid2, mpx(edgeWidth), -0.2);
    this.boundaries.push(mid2);

    edgeWidth = height;
    const boundaryleft = world.createBody();
    boundaryleft.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryleft.setPosition(this.planck.Vec2(0, height / 2));
    boundaryleft.setAngle(1.5708);
    const left = this.addEdge(boundaryleft, mpx(edgeWidth), 1.5708);
    this.boundaries.push(left);
    const boundaryright = world.createBody();
    boundaryright.createFixture(
      this.planck.Edge(this.planck.Vec2(-edgeWidth / 2, 0.0), this.planck.Vec2(edgeWidth / 2, 0.0)),
      0.0
    );
    boundaryright.setPosition(this.planck.Vec2(width, height / 2));
    boundaryright.setAngle(-1.5708);
    const right = this.addEdge(boundaryright, mpx(edgeWidth), 1.5708);
    this.boundaries.push(right);

    this.boundaries.forEach((child) => this.stage.addChild(child));
  }

  addEdge(body, w, angle) {
    const { x, y } = body.getPosition();
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff, 1);
    g.lineStyle(0);
    g.drawRect(0, 0, w, 2);
    g.endFill();

    const t = this.renderer.generateTexture(g);
    // const t = this.app.renderer.generateTexture(g);
    const boundary = PIXI.Sprite.from(t);
    boundary.anchor.set(0.5);
    boundary.position.set(mpx(x), mpx(y));
    boundary.rotation = angle;
    boundary.body = body;
    return boundary;
  }

  play() {
    // console.warn(this.ball.body);
    // this.world.step(1 / 60, this.app.ticker.elapsedMS / 1000);
    this.world.step(1 / 60, this.ticker.elapsedMS / 1000);
    this.updateWorld();
  }
}
