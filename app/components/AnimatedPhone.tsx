import { extend, useApplication } from "@pixi/react";
import { Container, Text, Graphics, Assets, Texture, Sprite } from "pixi.js";
import React, { useCallback, useEffect, useRef, useState } from "react";

extend({
  Container,
  Graphics,
  Text,
  Texture,
  Sprite,
});

export enum PhoneState {
  SCREEN1 = "Screen1",
  SCREEN2 = "Screen2",
  SCREEN3 = "Screen3",
}

export enum TransitionType {
  FADE = "fade",
  SLIDE_LEFT = "slideLeft",
  SLIDE_RIGHT = "slideRight",
  SWIPE_UP = "swipeUp",
}

interface AnimatedPhoneProps {
  isIdling?: boolean;
  currentState?: PhoneState;
  transitionType?: TransitionType;
}

const AnimatedPhone = (props: AnimatedPhoneProps) => {
  const {
    isIdling = true,
    currentState = PhoneState.SCREEN1,
    transitionType = TransitionType.FADE,
  } = props;

  const [textures, setTextures] = useState<Record<string, Texture>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mainSpriteRef = useRef<Sprite | null>(null);
  const transitionSpriteRef = useRef<Sprite | null>(null);
  const containerRef = useRef<Container | null>(null);
  const idleTimeRef = useRef(0);
  const animateRef = useRef<((delta: number) => void) | null>(null);
  const transitionRef = useRef<((delta: number) => void) | null>(null);

  const { app } = useApplication();

  // Load all textures
  useEffect(() => {
    const loadTextures = async () => {
      try {
        const textureMap = {
          [PhoneState.SCREEN1]: await Assets.load(
            "/assets/FreebitesScreen.png"
          ),
          [PhoneState.SCREEN2]: await Assets.load("/assets/FreebitesShare.png"), // Add your other screens
          [PhoneState.SCREEN3]: await Assets.load("/assets/Notif_1.png"),
        };
        setTextures(textureMap);
      } catch (error) {
        console.error("Failed to load textures:", error);
      }
    };

    loadTextures();
  }, []);

  const startTransition = useCallback(
    (newTexture: Texture) => {
      if (
        !mainSpriteRef.current ||
        !transitionSpriteRef.current ||
        !containerRef.current
      )
        return;

      setIsTransitioning(true);
      const mainSprite = mainSpriteRef.current;
      const transitionSprite = transitionSpriteRef.current;

      // Setup transition sprite
      transitionSprite.texture = newTexture;
      transitionSprite.anchor.set(0.5);
      transitionSprite.x = 0; // Relative to container
      transitionSprite.y = 0;
      transitionSprite.visible = true;

      // Reset any previous transition state
      mainSprite.alpha = 1;
      transitionSprite.alpha = 0;

      let transitionTime = 0;
      const transitionDuration = 1000; // 1 second

      const animateTransition = (delta: number) => {
        transitionTime += delta * 16; // Convert to milliseconds
        const progress = Math.min(transitionTime / transitionDuration, 1);

        switch (transitionType) {
          case TransitionType.FADE:
            mainSprite.alpha = 1 - progress;
            transitionSprite.alpha = progress;
            break;

          case TransitionType.SLIDE_LEFT:
            mainSprite.x = -progress * 800; // Slide out left
            transitionSprite.x = (1 - progress) * 800; // Slide in from right
            transitionSprite.alpha = 1;
            break;

          case TransitionType.SLIDE_RIGHT:
            mainSprite.x = progress * 800; // Slide out right
            transitionSprite.x = -(1 - progress) * 800; // Slide in from left
            transitionSprite.alpha = 1;
            break;

          case TransitionType.SWIPE_UP:
            mainSprite.y = -progress * 800; // Slide out up
            transitionSprite.y = (1 - progress) * 800; // Slide in from bottom
            transitionSprite.alpha = 1;
            break;
        }

        if (progress >= 1) {
          // Transition complete
          mainSprite.texture = newTexture;
          mainSprite.alpha = 1;
          mainSprite.x = 0;
          mainSprite.y = 0;

          transitionSprite.visible = false;
          transitionSprite.alpha = 0;
          transitionSprite.x = 0;
          transitionSprite.y = 0;

          app.ticker.remove(() => animateTransition);
          setIsTransitioning(false);
        }
      };

      transitionRef.current = animateTransition;
      app.ticker.add(() => animateTransition);
    },
    [app.ticker, transitionType]
  );
  // Handle state transitions
  useEffect(() => {
    if (!textures[currentState] || !mainSpriteRef.current || isTransitioning)
      return;

    const currentTexture = textures[currentState];
    const mainSprite = mainSpriteRef.current;

    // If it's the same texture, no transition needed
    if (mainSprite.texture === currentTexture) return;

    startTransition(currentTexture);
  }, [currentState, isTransitioning, startTransition, textures]);

  // Setup idle animation
  useEffect(() => {
    if (!containerRef.current) return;

    const animate = (delta: number) => {
      if (!isIdling || !containerRef.current || isTransitioning) return;

      idleTimeRef.current += delta * 0.01;
      const time = idleTimeRef.current;
      const container = containerRef.current;

      // Apply idle animations to the entire container
      const scaleOffset = Math.sin(time) * 0.02;
      container.scale.x = 1 + scaleOffset;
      container.scale.y = 1 + scaleOffset;

      const floatOffset = Math.sin(time * 0.7) * 3;
      container.y = 400 + floatOffset;

      container.rotation = Math.sin(time * 0.5) * 0.03;
    };

    animateRef.current = animate;
    app.ticker.add(() => animate(0.5));

    return () => {
      if (animateRef.current) {
        app.ticker.remove(() => animateRef.current);
        animateRef.current = null;
      }
    };
  }, [app.ticker, isIdling, isTransitioning]);

  // Reset idle state
  useEffect(() => {
    if (!isIdling && containerRef.current) {
      const container = containerRef.current;
      container.scale.set(1);
      container.y = 400;
      container.rotation = 0;
    }
  }, [isIdling]);

  // Cleanup transition on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        app.ticker.remove(() => transitionRef.current);
      }
    };
  }, [app.ticker]);

  const currentTexture = textures[currentState] || Texture.EMPTY;

  return (
    <pixiContainer ref={containerRef} x={400} y={400}>
      {/* Main sprite */}
      <pixiSprite
        ref={mainSpriteRef}
        texture={currentTexture}
        anchor={0.5}
        x={0}
        y={0}
        eventMode="static"
      />

      {/* Transition sprite (hidden by default) */}
      <pixiSprite
        ref={transitionSpriteRef}
        texture={Texture.EMPTY}
        anchor={0.5}
        x={0}
        y={0}
        visible={false}
        eventMode="static"
      />
    </pixiContainer>
  );
};

export default AnimatedPhone;
