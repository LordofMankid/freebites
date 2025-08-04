import { extend, useApplication } from "@pixi/react";
import { Container, Text, Graphics, Assets, Texture, Sprite } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  createAnimation,
  // createStaggeredAnimation,
  // AnimationControl,
} from "@/lib/util/customAnimationUtils";

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
  initialState?: PhoneState;
}

// Define the ref interface that parent components can use
// we use a ref interface to avoid triggering state refreshes that mess with other animation instances
export interface AnimatedPhoneRef {
  fireAnimation: (animationType: string, direction: string) => void;
  updateScrollProgress: (progress: number) => void;
  getAnimationState: () => {
    swipeComplete: boolean;
    notificationsComplete: boolean;
  };
}

const AnimatedPhone = forwardRef<AnimatedPhoneRef, AnimatedPhoneProps>(
  (props, ref) => {
    const { isIdling = true } = props;

    const [textures, setTextures] = useState<Record<string, Texture>>({});
    const [notificationTextures, setNotificationTextures] = useState<Texture[]>(
      []
    );

    // Store current state internally without React state
    const currentAnimations = useRef(new Map()); // Track active animations
    const animationState = useRef({
      swipeComplete: false,
      notificationsComplete: false,
    });

    const mainSpriteRef = useRef<Sprite | null>(null);
    const secondSpriteRef = useRef<Sprite | null>(null);
    const containerRef = useRef<Container | null>(null);
    const idleTimeRef = useRef(0);
    const notificationSpritesRef = useRef<Sprite[]>([]);
    // Store ticker function references for proper cleanup
    const animateIdleRef = useRef<((delta: number) => void) | null>(null);
    const animateTransitionRef = useRef<((delta: number) => void) | null>(null);

    const { app } = useApplication();

    // Load all textures
    useEffect(() => {
      const loadTextures = async () => {
        try {
          const [texture1, texture2] = await Promise.all([
            await Assets.load("/assets/FreebitesScreen.png"),
            await Assets.load("/assets/FreebitesShare.png"),
          ]);
          const textureMap: Record<string, Texture> = {
            screen1: texture1,
            screen2: texture2,
          };

          if (mainSpriteRef.current && textureMap.screen1) {
            mainSpriteRef.current.texture = textureMap.screen1;
          }

          // Any other immediate setup can use textureMap
          if (secondSpriteRef.current && textureMap.screen2) {
            secondSpriteRef.current.texture = textureMap.screen2;
          }

          const notifTextures = await Promise.all([
            Assets.load("/assets/Notif_1.png"),
            Assets.load("/assets/Notif_2.png"),
            Assets.load("/assets/Notif_3.png"),
            Assets.load("/assets/Notif_4.png"),
            Assets.load("/assets/Notif_5.png"),
          ]);
          setTextures(textureMap);
          setNotificationTextures(notifTextures);
        } catch (error) {
          console.error("Failed to load textures:", error);
        }
      };

      loadTextures();
    }, []);

    useEffect(() => {
      if (notificationTextures.length > 0 && containerRef.current) {
        notificationSpritesRef.current.forEach((sprite) => {
          if (sprite.parent) sprite.parent.removeChild(sprite);
        });

        const sprites = notificationTextures.map((texture, index) => {
          const sprite = new Sprite(texture);
          sprite.anchor.set(0.5);
          sprite.x = 0;
          sprite.y = index * 70 - 140;
          sprite.alpha = 0;
          sprite.scale.set(0.8);
          sprite.visible = false;
          containerRef.current?.addChild(sprite);
          return sprite;
        });

        notificationSpritesRef.current = sprites;
      }
    }, [notificationTextures]);

    // Fire specific animations
    const fireAnimation = useCallback(
      (animationType: string, direction: string) => {
        // Stop any existing animation of this type
        if (currentAnimations.current.has(animationType)) {
          currentAnimations.current.get(animationType).stop();
        }

        if (
          animationType === "swipe" &&
          secondSpriteRef.current &&
          mainSpriteRef.current
        ) {
          if (direction === "forward") {
            // Quick swipe animation
            if (textures.screen2) {
              secondSpriteRef.current.texture = textures.screen2;
              secondSpriteRef.current.visible = true;
              secondSpriteRef.current.x = 300;
              secondSpriteRef.current.alpha = 0;
            }

            // Animate main sprite out
            createAnimation(
              mainSpriteRef.current,
              {
                x: -300,
                alpha: 0,
              },
              400,
              "easeOutCubic"
            );

            // Animate second sprite in
            createAnimation(
              secondSpriteRef.current,
              {
                x: 0,
                alpha: 1,
              },
              400,
              "easeOutCubic",
              () => {
                animationState.current.swipeComplete = true;
              }
            );

            currentAnimations.current.set(animationType, { stop: () => {} });
          } else {
            // reverse
            // Reverse swipe animation
            createAnimation(
              mainSpriteRef.current,
              {
                x: 0,
                alpha: 1,
              },
              400,
              "easeOutCubic"
            );

            createAnimation(
              secondSpriteRef.current,
              {
                x: 300,
                alpha: 0,
              },
              400,
              "easeOutCubic",
              () => {
                if (secondSpriteRef.current) {
                  secondSpriteRef.current.visible = false;
                  animationState.current.swipeComplete = false;
                }
              }
            );

            currentAnimations.current.set(animationType, { stop: () => {} });
          }
        }

        if (animationType === "notifications" && secondSpriteRef.current) {
          if (direction === "forward") {
            // Staggered notification animation

            // Animate second sprite out
            createAnimation(
              secondSpriteRef.current,
              {
                x: 0,
                alpha: 0,
              },
              400,
              "easeOutCubic",
              () => {
                animationState.current.swipeComplete = true;
              }
            );
            notificationSpritesRef.current.forEach((sprite, index) => {
              sprite.visible = true;
              sprite.alpha = 0;
              sprite.scale.set(0.8);

              setTimeout(() => {
                createAnimation(
                  sprite,
                  {
                    alpha: 1,
                    "scale.x": 1,
                    "scale.y": 1,
                  },
                  300,
                  "easeOutBack"
                );
              }, index * 100); // 100ms stagger
            });

            // Mark complete after last animation
            setTimeout(
              () => {
                animationState.current.notificationsComplete = true;
              },
              (notificationSpritesRef.current.length - 1) * 100 + 300
            );
          } else {
            // reverse
            // Reverse notification animation (bottom to top)

            // Animate second sprite in
            createAnimation(
              secondSpriteRef.current,
              {
                x: 0,
                alpha: 1,
              },
              400,
              "easeOutCubic",
              () => {
                animationState.current.swipeComplete = true;
              }
            );
            const reversedSprites = [
              ...notificationSpritesRef.current,
            ].reverse();
            reversedSprites.forEach((sprite, index) => {
              setTimeout(() => {
                createAnimation(
                  sprite,
                  {
                    alpha: 0,
                    "scale.x": 0.8,
                    "scale.y": 0.8,
                  },
                  200,
                  "easeOutCubic",
                  () => {
                    sprite.visible = false;
                  }
                );
              }, index * 80); // Faster reverse
            });

            setTimeout(
              () => {
                animationState.current.notificationsComplete = false;
              },
              reversedSprites.length * 80 + 200
            );
          }
        }
      },
      [textures] // FIXED: Added textures to dependency array
    );

    // Optional: Handle any scroll-dependent effects (like parallax)
    const updateScrollProgress = (progress: number) => {
      // You can still use scroll progress for subtle effects
      if (containerRef.current) {
        // Subtle parallax or floating effect
        containerRef.current.y = 400 + Math.sin(progress * Math.PI) * 10;
      }
    };

    // Expose methods to parent
    useImperativeHandle(
      ref,
      () => ({
        fireAnimation,
        updateScrollProgress,
        getAnimationState: () => animationState.current,
      }),
      [fireAnimation]
    );

    // Setup idle animation
    useEffect(() => {
      if (!containerRef.current) return;

      // Clean up existing idle animation
      if (animateIdleRef.current) {
        app.ticker.remove(() => animateIdleRef.current);
        animateIdleRef.current = null;
      }

      const animateIdle = (delta: number) => {
        if (!isIdling || !containerRef.current) return;

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

      animateIdleRef.current = animateIdle;
      app.ticker.add(() => animateIdle(0.5));

      return () => {
        if (animateIdleRef.current) {
          app.ticker.remove(() => animateIdleRef.current);
          animateIdleRef.current = null;
        }
      };
    }, [app.ticker, isIdling]);

    // Reset idle state
    useEffect(() => {
      if (!isIdling && containerRef.current) {
        const container = containerRef.current;
        container.scale.set(1);
        container.y = 400;
        container.rotation = 0;
      }
    }, [isIdling]);

    // Cleanup all animations on unmount
    useEffect(() => {
      return () => {
        if (animateTransitionRef.current) {
          app.ticker.remove(() => animateTransitionRef.current);
          animateTransitionRef.current = null;
        }
        if (animateIdleRef.current) {
          app.ticker.remove(() => animateIdleRef.current);
          animateIdleRef.current = null;
        }
      };
    }, [app.ticker]);

    return (
      <pixiContainer ref={containerRef} x={400} y={400}>
        <pixiSprite
          ref={mainSpriteRef}
          texture={textures.screen1 || Texture.EMPTY}
          anchor={0.5}
          x={0}
          y={0}
        />

        <pixiSprite
          ref={secondSpriteRef}
          texture={Texture.EMPTY}
          anchor={0.5}
          x={0}
          y={0}
          visible={false}
        />
      </pixiContainer>
    );
  }
);

AnimatedPhone.displayName = "AnimatedPhone";

export default AnimatedPhone;
