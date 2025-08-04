// animationUtils.ts

// Define easing function type
type EasingFunction = (t: number) => number;

// Define available easing types
export type EasingType =
  | "linear"
  | "easeOutCubic"
  | "easeOutBack"
  | "easeInOutCubic"
  | "easeOutQuart";

// Define animation properties - supports nested properties like 'scale.x'
export interface AnimationProperties {
  [key: string]: number;
}

// Define the animation control object
export interface AnimationControl {
  stop: () => void;
  pause: () => void;
  resume: () => void;
  progress: () => number;
}

// Define the target object (PIXI objects, DOM elements, etc.)
export interface AnimationTarget {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Easing functions collection
const easingFunctions: Record<EasingType, EasingFunction> = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack: (t: number) =>
    1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
};

// Helper function to get nested property value
const getNestedValue = (target: AnimationTarget, key: string): number => {
  if (key.includes(".")) {
    const [obj, prop] = key.split(".");
    return target[obj]?.[prop] ?? 0;
  }
  return target[key] ?? 0;
};

// Helper function to set nested property value
const setNestedValue = (
  target: AnimationTarget,
  key: string,
  value: number
): void => {
  if (key.includes(".")) {
    const [obj, prop] = key.split(".");
    if (target[obj]) {
      target[obj][prop] = value;
    }
  } else {
    target[key] = value;
  }
};

// Main animation function
export const createAnimation = (
  target: AnimationTarget,
  properties: AnimationProperties,
  duration: number,
  ease: EasingType = "easeOutCubic",
  onComplete?: () => void
): AnimationControl => {
  const startTime = Date.now();
  const startValues: Record<string, number> = {};
  let animationId: number | null = null;
  let isPaused = false;
  let pausedTime = 0;

  // Validate easing function
  if (!easingFunctions[ease]) {
    console.warn(
      `Unknown easing function: ${ease}. Using 'easeOutCubic' instead.`
    );
    ease = "easeOutCubic";
  }

  // Store starting values
  Object.keys(properties).forEach((key) => {
    startValues[key] = getNestedValue(target, key);
  });

  const easingFn = easingFunctions[ease];

  const animate = (): void => {
    if (isPaused) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const elapsed = Date.now() - startTime - pausedTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);

    // Apply animated values
    Object.keys(properties).forEach((key) => {
      const endValue = properties[key];
      const startValue = startValues[key];
      const currentValue = startValue + (endValue - startValue) * easedProgress;

      setNestedValue(target, key, currentValue);
    });

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
      onComplete?.();
    }
  };

  // Start the animation
  animate();

  // Return control object
  return {
    stop: (): void => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    pause: (): void => {
      if (!isPaused) {
        isPaused = true;
        pausedTime = Date.now() - startTime;
      }
    },
    resume: (): void => {
      if (isPaused) {
        isPaused = false;
        pausedTime = Date.now() - startTime - pausedTime;
      }
    },
    progress: (): number => {
      const elapsed = Date.now() - startTime - pausedTime;
      return Math.min(elapsed / duration, 1);
    },
  };
};

// Utility function for creating staggered animations
export const createStaggeredAnimation = (
  targets: AnimationTarget[],
  properties: AnimationProperties,
  duration: number,
  staggerDelay: number,
  ease: EasingType = "easeOutCubic",
  onAllComplete?: () => void
): AnimationControl[] => {
  const animations: AnimationControl[] = [];
  let completedCount = 0;

  targets.forEach((target, index) => {
    setTimeout(() => {
      const animation = createAnimation(
        target,
        properties,
        duration,
        ease,
        () => {
          completedCount++;
          if (completedCount === targets.length && onAllComplete) {
            onAllComplete();
          }
        }
      );
      animations.push(animation);
    }, index * staggerDelay);
  });

  return animations;
};

// Utility function for creating reverse staggered animations
export const createReverseStaggeredAnimation = (
  targets: AnimationTarget[],
  properties: AnimationProperties,
  duration: number,
  staggerDelay: number,
  ease: EasingType = "easeOutCubic",
  onAllComplete?: () => void
): AnimationControl[] => {
  const animations: AnimationControl[] = [];
  let completedCount = 0;
  const reversedTargets = [...targets].reverse();

  reversedTargets.forEach((target, index) => {
    setTimeout(() => {
      const animation = createAnimation(
        target,
        properties,
        duration,
        ease,
        () => {
          completedCount++;
          if (completedCount === targets.length && onAllComplete) {
            onAllComplete();
          }
        }
      );
      animations.push(animation);
    }, index * staggerDelay);
  });

  return animations;
};

// Utility function for creating sequence animations
export const createSequenceAnimation = (
  sequences: Array<{
    target: AnimationTarget;
    properties: AnimationProperties;
    duration: number;
    ease?: EasingType;
  }>,
  onAllComplete?: () => void
): AnimationControl => {
  let currentIndex = 0;
  let currentAnimation: AnimationControl | null = null;

  const runNext = (): void => {
    if (currentIndex >= sequences.length) {
      onAllComplete?.();
      return;
    }

    const sequence = sequences[currentIndex];
    currentAnimation = createAnimation(
      sequence.target,
      sequence.properties,
      sequence.duration,
      sequence.ease || "easeOutCubic",
      () => {
        currentIndex++;
        runNext();
      }
    );
  };

  runNext();

  return {
    stop: (): void => {
      currentAnimation?.stop();
    },
    pause: (): void => {
      currentAnimation?.pause();
    },
    resume: (): void => {
      currentAnimation?.resume();
    },
    progress: (): number => {
      const sequenceProgress = currentIndex / sequences.length;
      const currentProgress = currentAnimation?.progress() || 0;
      return sequenceProgress + currentProgress / sequences.length;
    },
  };
};

// PIXI-specific helper types (optional, if you want PIXI-specific typing)
export interface PixiSprite {
  x: number;
  y: number;
  alpha: number;
  scale: { x: number; y: number };
  rotation: number;
  visible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface PixiContainer {
  x: number;
  y: number;
  scale: { x: number; y: number; set: (value: number) => void };
  rotation: number;
  alpha: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
