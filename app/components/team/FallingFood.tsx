import { useApplication } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import React, { useEffect, useState } from "react";
import Matter, { MouseConstraint } from "matter-js";

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
      const i = Math.floor(Math.random() * 6);
      const randFood = [
        "Sandwich",
        "Cookie",
        "Pizza",
        "Donut",
        "Taco",
        "Burger",
      ][i];
      const texture = await Assets.load(`/assets/${randFood}.png`);
      const sprite = new Sprite(texture);
      sprite.x = x;
      sprite.y = y;
      sprite.anchor.set(0.5);
      container.addChild(sprite);

      const body = Matter.Bodies.circle(x, y, sprite.height / 2.2, {
        restitution: 0.5,
        friction: 0.2,
      });

      Matter.World.add(world, body);

      objects.push({ s: sprite, b: body });
    };

    const foods = Array.from({ length: 35 }, () => {
      const x = Math.min(
        Math.random() * app.renderer.width,
        app.renderer.width - 150
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
      // { inertia: Infinity, friction: 1, frictionStatic: 1, mass: 1000 }
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
      20,
      app.renderer.height * 4,
      { isStatic: true }
    );
    Matter.World.add(world, leftWall);

    const rightWall = Matter.Bodies.rectangle(
      app.renderer.width,
      0,
      20,
      app.renderer.height * 4,
      { isStatic: true }
    );
    Matter.World.add(world, rightWall);

    const mouse = Matter.Mouse.create(app.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.5,
        render: {
          visible: false,
        },
      },
    });

    Matter.World.add(world, mouseConstraint);

    const ticker = app.ticker.add(() => {
      Matter.Engine.update(engine, 800 / 60);
      objects.map((ob) => {
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
        if (y > viewBottom + 200) {
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
      Assets.load("/assets/Sandwich.png").then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  return <></>;
};

export default FallingFood;
