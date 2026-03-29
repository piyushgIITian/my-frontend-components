import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SecondaryBubbleItem, ResolvedSecondaryBubble } from "./types";

const R2 = 130;

/** Compute evenly-spaced positions in a quarter-circle arc (up → left) */
function computeSecondaryPositions(
  count: number
): { x: number; y: number }[] {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: -R2 }];

  return Array.from({ length: count }, (_, i) => {
    const angle = (i / (count - 1)) * (Math.PI / 2);
    return {
      x: -Math.round(R2 * Math.sin(angle)),
      y: -Math.round(R2 * Math.cos(angle)),
    };
  });
}

/**
 * Returns an array of motion.button elements for secondary menu bubbles.
 * Must be spread as direct children of <AnimatePresence>.
 */
export function useSecondaryBubbles(
  items: SecondaryBubbleItem[],
  morePosition: { x: number; y: number },
  onBubbleClick?: (id: string) => void,
  onClose?: () => void
) {
  const resolved: ResolvedSecondaryBubble[] = useMemo(() => {
    const positions = computeSecondaryPositions(items.length);
    return items.map((item, i) => ({ ...item, position: positions[i] }));
  }, [items]);

  const handleClick = useCallback(
    (id: string) => {
      onBubbleClick?.(id);
      onClose?.();
    },
    [onBubbleClick, onClose]
  );

  const allStops = useMemo(
    () => [morePosition, ...resolved.map((b) => b.position)],
    [morePosition, resolved]
  );

  const lastIndex = resolved.length - 1;

  return resolved.map((bubble, index) => {
    // OPEN: drop-off pattern — each bubble visits prior stops on the way out
    const stopCount = index + 2;
    const xPath = allStops.slice(0, stopCount).map((s) => s.x);
    const yPath = allStops.slice(0, stopCount).map((s) => s.y);
    const scalePath = [0, ...Array<number>(stopCount - 1).fill(1)];
    const opacityPath = [0, ...Array<number>(stopCount - 1).fill(1)];
    const times = xPath.map((_, i) => {
      if (i === 0) return 0;
      if (i === 1) return 0.2;
      return 0.2 + ((i - 1) / (stopCount - 2)) * 0.8;
    });
    const duration = 0.35 + index * 0.12;

    // CLOSE: train pickup pattern — reverse through all stops
    const hopsBeforePickup = lastIndex - index;
    const hopDuration = 0.1;
    const exitDelay = hopsBeforePickup * hopDuration;

    const exitStops = allStops.slice(0, index + 2).reverse();
    const xExit = exitStops.map((s) => s.x);
    const yExit = exitStops.map((s) => s.y);
    const exitStopCount = exitStops.length;
    const scaleExit = [...Array<number>(exitStopCount - 1).fill(1), 0];
    const opacityExit = [...Array<number>(exitStopCount - 1).fill(1), 0];
    const timesExit = exitStops.map((_, i) => {
      if (exitStopCount <= 1) return i;
      if (i === exitStopCount - 1) return 1;
      return (i / (exitStopCount - 1)) * 0.85;
    });
    const exitDuration = 0.2 + (exitStopCount - 1) * 0.1;

    return (
      <motion.button
        key={bubble.id}
        initial={{
          x: morePosition.x,
          y: morePosition.y,
          scale: 0,
          opacity: 0,
        }}
        animate={{
          x: xPath,
          y: yPath,
          scale: scalePath,
          opacity: opacityPath,
          transition: { duration, ease: "easeOut", times },
        }}
        exit={{
          x: xExit,
          y: yExit,
          scale: scaleExit,
          opacity: opacityExit,
          transition: {
            duration: exitDuration,
            ease: "easeIn",
            times: timesExit,
            delay: exitDelay,
          },
        }}
        onClick={() => handleClick(bubble.id)}
        style={{ pointerEvents: "auto" }}
        className={cn(
          "absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border-0 cursor-pointer",
          "transition-colors duration-150",
          bubble.color || "bg-brand-blue",
          bubble.hoverColor || "hover:bg-brand-blue-600"
        )}
        title={bubble.label}
        aria-label={bubble.label}
      >
        {bubble.icon}
      </motion.button>
    );
  });
}
