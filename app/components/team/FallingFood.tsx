import { useApplication } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import React, { useEffect, useState } from "react";
import Matter from "matter-js";

const FallingFood = () => {
  const { app } = useApplication();

  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
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
      const sandwichSprite = new Sprite(texture);
      sandwichSprite.x = x;
      sandwichSprite.y = y;
      sandwichSprite.anchor.set(0.5);
      container.addChild(sandwichSprite);

      const body = Matter.Bodies.circle(x, y, sandwichSprite.height / 2.2, {
        restitution: 0.5,
        friction: 0.2,
      });

      Matter.World.add(world, body);

      objects.push({ s: sandwichSprite, b: body });
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
      app.renderer.width,
      10,
      { isStatic: true }
    );
    Matter.World.add(world, floor);

    const leftWall = Matter.Bodies.rectangle(
      0,
      app.renderer.height / 2,
      10,
      app.renderer.height,
      { isStatic: true }
    );
    Matter.World.add(world, leftWall);

    const rightWall = Matter.Bodies.rectangle(
      app.renderer.width,
      app.renderer.height / 2,
      10,
      app.renderer.height,
      { isStatic: true }
    );
    Matter.World.add(world, rightWall);

    const ticker = app.ticker.add(() => {
      Matter.Engine.update(engine, 800 / 60);
      objects.map((ob) => {
        ob.s.x = ob.b.position.x;
        ob.s.y = ob.b.position.y;
        ob.s.rotation = ob.b.angle;
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
