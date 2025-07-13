import { useApplication } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import React, { useEffect, useState } from "react";
import Matter, { Mouse, MouseConstraint, Vector } from "matter-js";

const vertexMap = new Map<string, Vector[]>([
  [
    "cake",
    [
      { x: 27, y: 51 },
      { x: 80, y: 15 },
      { x: 125, y: 55 },
      { x: 102, y: 113 },
      { x: 12, y: 103 },
    ],
  ],
  [
    "chicken",
    [
      { x: 30, y: 30 },
      { x: 57, y: 17 },
      { x: 120, y: 41 },
      { x: 105, y: 81 },
      { x: 99, y: 83 },
      { x: 72, y: 122 },
      { x: 50, y: 121 },
      { x: 25, y: 105 },
      { x: 18, y: 94 },
      { x: 30, y: 50 },
    ],
  ],
  [
    "fries",
    [
      { x: 6, y: 15 },
      { x: 20, y: 4 },
      { x: 60, y: 7 },
      { x: 93, y: 19 },
      { x: 82, y: 48 },
      { x: 90, y: 55 },
      { x: 83, y: 98 },
      { x: 68, y: 111 },
      { x: 15, y: 102 },
    ],
  ],
  [
    "hamburger",
    [
      { x: 24, y: 64 },
      { x: 41, y: 34 },
      { x: 75, y: 24 },
      { x: 96, y: 37 },
      { x: 113, y: 77 },
      { x: 110, y: 90 },
      { x: 84, y: 108 },
      { x: 58, y: 114 },
      { x: 45, y: 110 },
    ],
  ],
  [
    "hotdog",
    [
      { x: 77, y: 17 },
      { x: 91, y: 1 },
      { x: 104, y: 93 },
      { x: 112, y: 15 },
      { x: 112, y: 39 },
      { x: 61, y: 111 },
      { x: 32, y: 115 },
      { x: 21, y: 103 },
      { x: 22, y: 78 },
      { x: 71, y: 13 },
    ],
  ],
  [
    "pancake",
    [
      { x: 31, y: 71 },
      { x: 50, y: 44 },
      { x: 90, y: 28 },
      { x: 117, y: 34 },
      { x: 126, y: 50 },
      { x: 147, y: 59 },
      { x: 147, y: 76 },
      { x: 113, y: 108 },
      { x: 60, y: 126 },
      { x: 32, y: 121 },
      { x: 25, y: 111 },
      { x: 36, y: 87 },
    ],
  ],
  [
    "pizza",
    [
      { x: 22, y: 7 },
      { x: 69, y: 17 },
      { x: 95, y: 44 },
      { x: 87, y: 56 },
      { x: 76, y: 57 },
      { x: 16, y: 84 },
      { x: 10, y: 77 },
      { x: 21, y: 23 },
    ],
  ],
  [
    "sandwich",
    [
      { x: 11, y: 18 },
      { x: 90, y: 12 },
      { x: 105, y: 44 },
      { x: 111, y: 77 },
      { x: 37, y: 91 },
      { x: 4, y: 55 },
    ],
  ],
]);

const FallingFood = () => {
  const { app } = useApplication();

  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    // if (scrollY != 0) return;
    const engine = Matter.Engine.create();
    const world = engine.world;

    app.stage.removeChildren();
    const container = new Container();
    app.stage.addChild(container);

    const objects: { s: Sprite; b: Matter.Body }[] = [];

    const initFood = async (x: number, y: number) => {
      const i = Math.floor(Math.random() * 8);
      const randFood = [
        "cake",
        "chicken",
        "fries",
        "hamburger",
        "hotdog",
        "pancake",
        "pizza",
        "sandwich",
      ][i];
      const texture = await Assets.load(`/assets/foods/${randFood}.png`);
      const sprite = new Sprite(texture);
      sprite.x = x;
      sprite.y = y;
      sprite.scale = 1;
      sprite.anchor.set(0.5);
      container.addChild(sprite);

      let body = Matter.Bodies.circle(x, y, sprite.height / 2.2, {
        restitution: 0.75,
        friction: 0.5,
        mass: 1,
      });
      body = Matter.Bodies.fromVertices(
        x,
        y,
        [vertexMap.get(randFood) ?? [{ x: 0, y: 0 }]],
        {
          restitution: 0.5,
          friction: 0.5,
          mass: 1,
        }
      );

      Matter.World.add(world, body);

      objects.push({ s: sprite, b: body });
    };

    const foodCount = Math.floor(
      Math.min(app.renderer.height, app.renderer.width) / 20
    );
    const foods = Array.from({ length: foodCount }, () => {
      const x = Math.min(
        Math.random() * app.renderer.width,
        app.renderer.width - 100
      );
      const y = (Math.random() * -app.renderer.height) / 1.25 - 100;
      return { x, y };
    });

    Promise.all(foods.map(({ x, y }) => initFood(x, y)));

    const floor = Matter.Bodies.rectangle(
      app.renderer.width / 2,
      app.renderer.height,
      app.renderer.width - 10,
      10,
      { id: 0, isStatic: true }
    );
    let floorExists = true;

    Matter.World.add(world, floor);

    const ceiling = Matter.Bodies.rectangle(
      app.renderer.width / 2,
      -app.renderer.height,
      app.renderer.width,
      20,
      { isStatic: true }
    );
    Matter.World.add(world, ceiling);

    const leftWall = Matter.Bodies.rectangle(
      0,
      0,
      10,
      app.renderer.height * 4,
      { isStatic: true }
    );
    Matter.World.add(world, leftWall);

    const rightWall = Matter.Bodies.rectangle(
      app.renderer.width,
      0,
      10,
      app.renderer.height * 4,
      { isStatic: true }
    );
    Matter.World.add(world, rightWall);

    const mouse = Matter.Mouse.create(app.canvas) as Mouse & {
      mousewheel: (event: WheelEvent) => void;
    };
    app.canvas.removeEventListener("wheel", mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.World.add(world, mouseConstraint);

    const MAX_VELOCITY = 40;

    const clampVelocity = (body: Matter.Body) => {
      const { x, y } = body.velocity;
      const clampedX = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, x));
      const clampedY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, y));
      if (x !== clampedX || y !== clampedY) {
        Matter.Body.setVelocity(body, { x: clampedX, y: clampedY });
      }
    };

    const ticker = app.ticker.add(() => {
      Matter.Engine.update(engine, 500 / 60);
      objects.map((ob) => {
        clampVelocity(ob.b);
        ob.s.x = ob.b.position.x;
        ob.s.y = ob.b.position.y;
        ob.s.rotation = ob.b.angle;
      });
      app.stage.y = floorExists ? -scrollY : -app.renderer.height * 0.8;
      if (scrollY > app.renderer.height * 0.8 && floorExists) {
        Matter.World.remove(world, floor);
        floorExists = false;
      }

      const viewBottom = scrollY + app.renderer.height;

      objects.forEach((ob) => {
        const y = ob.b.position.y;
        if (y > viewBottom * 4) {
          Matter.World.remove(world, ob.b);
          container.removeChild(ob.s);
        }
      });
    });

    return () => {
      ticker.destroy();
      app.stage.removeChild(container);
      container.destroy({ children: true });
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
    // init();
  }, [app]);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("/assets/foods/sandwich.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  return <></>;
};

export default FallingFood;
