import * as Matter from 'matter-js';

export class Game {
  constructor() {
    this.view = document.createElement('div');
    document.body.appendChild(this.view);
    this.view.style.backgroundColor = 'red';
    this.view.setAttribute('id', 'board1');
    this.view.style.width = 100;
    this.view.style.height = 100;
    this.mouseConstraint = Matter.MouseConstraint;
    this.mouse = Matter.Mouse;
    this.init();
    this.runRender();
    this.buildWord();
    this.build();
    this.ball;
  }

  init() {
    this.config = {
      world: {
        AX: 500,
        AY: 10,

        BX: 1000,
        BY: 20,
        CX: 1000,
        CY: 510,
        DX: 500,
        DY: 520,
      },
      colors: {
        WINDOW: '#f8f9fa',
        BAR: '#868e96',
        DOT: '#f8f9fa',
        HEADER: '#868e96',
        TEXT: '#ced4da',
        SOCIAL: '#f06595',
        IMAGE: '#22b8cf',
      },
      defElement: [
        {
          x: 600,
          y: 40,
          r: 35,
        },
        {
          x: 700,
          y: 100,
          r: 35,
        },
        {
          x: 750,
          y: 140,
          r: 35,
        },
      ],
    };
    this.engine = Matter.Engine.create(this.view);
    this.world = this.engine.world;
  }

  runRender() {
    this.render = Matter.Render.create({
      element: document.body,
      engine: this.engine,

      options: {
        width: 2000,
        height: 2000,

        wireframes: false, // need this or various render styles won't take
        background: 0xffffff,
        showAngleIndicato: true,
      },
    });
    Matter.Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: 2000, y: 2000 },
    });
    Matter.Render.run(this.render);
    this.runner();
  }

  addBB() {
    const body = Matter.Bodies.polygon(150, 200, 5, 30);

    const constraint = Matter.Constraint.create({
      pointA: { x: 150, y: 100 },
      bodyB: body,
      pointB: { x: -10, y: -10 },
    });

    Matter.Composite.add(this.world, [body, constraint]);
  }

  runner() {
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  wall(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: { visible: true, color: '#f8f9fa' },
    });
  }

  buildWord() {
    Matter.Composite.add(this.engine.world, [
      // boundaries (top, bottom, left, right)
      this.wall(700, 120, 1000, 20),
      this.wall(700, 620, 1000, 20),
      this.wall(200, 370, 30, 520),
      this.wall(1200, 370, 30, 520),
      this.wall(700, 820, 1000, 20),
      this.wall(700, 1220, 1000, 20),
      this.wall(200, 1020, 30, 420),
      this.wall(1200, 1020, 30, 420),
    ]);

    // bodies
  }

  build() {
    this.createCircle();
    Matter.World.add(this.engine.world, this.circles);
  }

  createCircle() {
    this.circles = [];
    this.circles.push(this.circl(300, 200, 40, '#aaddaa'));
    this.circles.push(this.circl(900, 1000, 40, '#44ddaa'));
    console.warn(this.circles[0]);
    setTimeout(() => {
      this.setCirecle();
      this.play();
    }, 2000);
  }

  setCirecle() {
    this.circles.forEach((circle) => {
      Matter.Body.setStatic(circle, false);
      Matter.Body.setVelocity(circle, {
        x: this.getRandom(-4, 4),
        y: this.getRandom(-6, -4),
      });
      Matter.Body.setAngularVelocity(circle, this.getRandom(-0.05, 0.05));
    });
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  circl(x, y, radius, color) {
    return Matter.Bodies.circle(x, y, radius, {
      isStatic: false,
      restitution: 1,
      render: { fillStyle: color },
    });
  }

  play() {
    const mouse = Matter.Mouse.create(this.render.canvas),
      mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Matter.Composite.add(this.world, mouseConstraint);
    this.render.mouse = mouse;
  }
}

// (() => {
//   const MouseConstraint = Matter.MouseConstraint;
//   const Mouse = Matter.Mouse;

//   // constants
//   const COLOR = {
//     WINDOW: '#f8f9fa',
//     BAR: '#868e96',
//     DOT: '#f8f9fa',
//     HEADER: '#868e96',
//     TEXT: '#ced4da',
//     SOCIAL: '#f06595',
//     IMAGE: '#22b8cf',
//   };

//   // variables
//   let canvas, elements;

//   function init() {
//     // engine
//     let engine = Matter.Engine.create();
//     engine.world.gravity.y = 0;

//     // render
//     let render = Matter.Render.create({
//       element: document.getElementById('container'),
//       engine: engine,
//       options: {
//         width: 1500,
//         height: 900,
//         wireframes: false, // need this or various render styles won't take
//         background: 0xffffff,
//       },
//     });
//     Matter.Render.run(render);

//     // runner
//     let runner = Matter.Runner.create();
//     Matter.Runner.run(runner, engine);

//     // fixed bodies
//     Matter.World.add(engine.world, [
//       // boundaries (top, bottom, left, right)
//       wall(400, 30, 800, 20),
//       wall(400, 610, 800, 20),
//       wall(30, 300, 20, 600),
//       wall(810, 300, 20, 600),
//     ]);
//     // bodies to toss around
//     elements = [
//       // header icon
//       // circ(80, 120, 40, COLOR.IMAGE),

//       // circ(740, 100, 20, COLOR.SOCIAL),
//       // circ(740, 150, 20, COLOR.SOCIAL),
//       circ(740, 200, 20, COLOR.SOCIAL),
//     ];

//     Matter.World.add(engine.world, elements);

//     canvas = document.createElement('canvas');
//     // run();

//     const mouse = Mouse.create(render.canvas),
//       mouseConstraint = MouseConstraint.create(engine, {
//         mouse: mouse,
//         constraint: {
//           stiffness: 0.2,
//           render: {
//             visible: false,
//           },
//         },
//       });
//     render.mouse = mouse;
//     Matter.World.add(engine.world, mouseConstraint);
//   }

//   function run() {
//     canvas.classList.add('slam');
//     setTimeout(slam, 2000);
//   }

//   function slam() {
//     // let the bodies hit the floor
//     elements.forEach((body) => {
//       Matter.Body.setStatic(body, false);
//       Matter.Body.setVelocity(body, {
//         x: rand(-4, 4),
//         y: rand(-6, -4),
//       });
//       Matter.Body.setAngularVelocity(body, rand(-0.05, 0.05));
//     });

//     // repeat
//     //   canvas.classList.remove('slam');
//     //   setTimeout(run, 5000);
//   }

//   // matter.js has a built in random range function, but it is deterministic
//   function rand(min, max) {
//     return Math.random() * (max - min) + min;
//   }

//   function wall(x, y, width, height) {
//     return Matter.Bodies.rectangle(x, y, width, height, {
//       isStatic: true,
//       render: { visible: true },
//     });
//   }

//   function rect(x, y, width, height, color) {
//     return Matter.Bodies.rectangle(x, y, width, height, {
//       isStatic: true,
//       restitution: 1,
//       render: { fillStyle: color },
//     });
//   }

//   function circ(x, y, radius, color) {
//     return Matter.Bodies.circle(x, y, radius, {
//       isStatic: true,
//       restitution: 1,
//       render: { fillStyle: color },
//     });
//   }

//   window.addEventListener('load', init, false);
// })();

new Game();
