import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { GooeyFilterDefs } from "./GooeyFilterDefs";
import { useSecondaryBubbles } from "./SecondaryMenu";
import type { GooeyFabProps, ResolvedBubble } from "./types";

const R1 = 70;

const OPEN_SPRING = { type: "spring" as const, stiffness: 300, damping: 20 };
const CLOSE_SPRING = { type: "spring" as const, stiffness: 400, damping: 28 };

const GOOEY_PRESETS = {
  low: { primary: 4, secondary: 3, alpha: 18, offset: -7 },
  medium: { primary: 6, secondary: 5, alpha: 22, offset: -9 },
  high: { primary: 9, secondary: 7, alpha: 25, offset: -11 },
} as const;

/** Compute evenly-spaced positions in a quarter-circle arc (up → left) */
function computePrimaryPositions(count: number): { x: number; y: number }[] {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: -R1 }];

  return Array.from({ length: count }, (_, i) => {
    const angle = (i / (count - 1)) * (Math.PI / 2);
    return {
      x: -Math.round(R1 * Math.sin(angle)),
      y: -Math.round(R1 * Math.cos(angle)),
    };
  });
}

export function GooeyFab({
  bubbles,
  mainButton,
  secondaryMenu,
  renderPanel,
  onBubbleClick,
  position = "bottom-right",
  gooeyIntensity = "medium",
}: GooeyFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [isSecondaryExiting, setIsSecondaryExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showSecondaryGoo = showSecondaryMenu || isSecondaryExiting;

  const moreControls = useAnimationControls();

  // Find the bubble that triggers the sub-menu (if any)
  const subMenuTrigger = bubbles.find((b) => b.hasSubMenu);

  // Resolve bubble positions
  const resolvedBubbles: ResolvedBubble[] = useMemo(() => {
    const positions = computePrimaryPositions(bubbles.length);
    return bubbles.map((b, i) => ({ ...b, position: positions[i] }));
  }, [bubbles]);

  // The sub-menu trigger bubble's position (for the "..." equivalent)
  const triggerBubble = resolvedBubbles.find((b) => b.hasSubMenu);
  const triggerPosition = triggerBubble?.position ?? { x: 0, y: -R1 };

  const closeSecondaryMenu = useCallback(() => {
    setShowSecondaryMenu(false);
    setIsOpen(false);
  }, []);

  const secondaryBubbleElements = useSecondaryBubbles(
    secondaryMenu?.bubbles ?? [],
    triggerPosition,
    onBubbleClick,
    closeSecondaryMenu
  );

  // Track secondary menu close for exit animations
  const prevShowSecondary = useRef(false);
  useEffect(() => {
    if (prevShowSecondary.current && !showSecondaryMenu) {
      setIsSecondaryExiting(true);
    }
    prevShowSecondary.current = showSecondaryMenu;
  }, [showSecondaryMenu]);

  // Fly sub-menu trigger to its position when menu opens
  useEffect(() => {
    if (isOpen && subMenuTrigger && triggerBubble) {
      requestAnimationFrame(() => {
        moreControls.start({
          scale: 1,
          opacity: 1,
          x: triggerBubble.position.x,
          y: triggerBubble.position.y,
          transition: { ...OPEN_SPRING, delay: 0 },
        });
      });
    }
  }, [isOpen, subMenuTrigger, triggerBubble, moreControls]);

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      if (showSecondaryMenu) {
        setShowSecondaryMenu(false);
        setTimeout(() => setIsOpen(false), 600);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(true);
    }
  }, [isOpen, showSecondaryMenu]);

  const handleBubbleClick = useCallback(
    (bubble: ResolvedBubble) => {
      if (bubble.hasSubMenu && secondaryMenu) {
        setShowSecondaryMenu((prev) => !prev);
        return;
      }

      if (bubble.opensPanel && renderPanel) {
        const closeAndShow = () => {
          setIsOpen(false);
          setShowPanel(true);
        };
        if (showSecondaryMenu) {
          setShowSecondaryMenu(false);
          setTimeout(closeAndShow, 600);
        } else {
          closeAndShow();
        }
        return;
      }

      // Generic click handler
      const doAction = () => {
        setIsOpen(false);
        onBubbleClick?.(bubble.id);
      };
      if (showSecondaryMenu) {
        setShowSecondaryMenu(false);
        setTimeout(doAction, 600);
      } else {
        doAction();
      }
    },
    [showSecondaryMenu, secondaryMenu, renderPanel, onBubbleClick]
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSecondaryMenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showPanel) setShowPanel(false);
        else if (showSecondaryMenu) setShowSecondaryMenu(false);
        else if (isOpen) setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, showPanel, showSecondaryMenu]);

  const gooey = GOOEY_PRESETS[gooeyIntensity];
  const isMoreActive = showSecondaryMenu;
  const fabSize = mainButton?.size ?? 56;
  const fabColor = mainButton?.color ?? "bg-brand-orange";
  const fabHover = mainButton?.hoverColor ?? "hover:bg-brand-orange-500";

  const positionClasses =
    position === "bottom-left" ? "fixed bottom-6 left-6" : "fixed bottom-6 right-6";

  // Separate sub-menu trigger from other bubbles for rendering
  const otherBubbles = resolvedBubbles.filter((b) => !b.hasSubMenu);

  return (
    <>
      {/* Panel */}
      <AnimatePresence key="panel">
        {showPanel ? renderPanel?.(() => setShowPanel(false)) : null}
      </AnimatePresence>

      <GooeyFilterDefs
        primaryStdDev={gooey.primary}
        secondaryStdDev={gooey.secondary}
        alphaMultiplier={gooey.alpha}
        alphaOffset={gooey.offset}
      />

      <div ref={containerRef} className={cn(positionClasses, "z-[100]")}>
        {/* Primary gooey group */}
        <div className="relative z-10" style={{ filter: isOpen ? "url(#gooey-primary)" : "none" }}>
          <AnimatePresence>
            {/* Sub-menu trigger bubble (the "..." equivalent) */}
            {isOpen && triggerBubble && (
              <motion.button
                key={triggerBubble.id}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={moreControls}
                exit={{
                  scale: 0, opacity: 0, x: 0, y: 0,
                  transition: { ...CLOSE_SPRING, delay: (resolvedBubbles.length - 1) * 0.1 },
                }}
                onClick={() => handleBubbleClick(triggerBubble)}
                className={cn(
                  "absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer",
                  "transition-colors duration-150",
                  isMoreActive
                    ? (triggerBubble.color ? triggerBubble.color.replace("bg-", "bg-") : "bg-brand-blue-700") + " ring-2 ring-brand-blue-600/40"
                    : cn(triggerBubble.color || "bg-brand-blue", triggerBubble.hoverColor || "hover:bg-brand-blue-600")
                )}
                title={triggerBubble.label}
                aria-label={triggerBubble.label}
              >
                {isMoreActive && triggerBubble.activeIcon ? (
                  <motion.div
                    key="active"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {triggerBubble.activeIcon}
                  </motion.div>
                ) : (
                  triggerBubble.icon
                )}
              </motion.button>
            )}

            {/* Other primary bubbles */}
            {isOpen &&
              otherBubbles.map((bubble) => {
                const globalIndex = resolvedBubbles.indexOf(bubble);
                const enterDelay = globalIndex * 0.1;
                const exitDelay = (resolvedBubbles.length - 1 - globalIndex) * 0.1;

                return (
                  <motion.button
                    key={bubble.id}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: 1, opacity: 1,
                      x: bubble.position.x, y: bubble.position.y,
                      transition: { ...OPEN_SPRING, delay: enterDelay },
                    }}
                    exit={{
                      scale: 0, opacity: 0, x: 0, y: 0,
                      transition: { ...CLOSE_SPRING, delay: exitDelay },
                    }}
                    onClick={() => handleBubbleClick(bubble)}
                    className={cn(
                      "absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer",
                      "transition-colors duration-150",
                      bubble.color || "bg-brand-orange-400",
                      bubble.hoverColor || "hover:bg-brand-orange-500"
                    )}
                    title={bubble.label}
                    aria-label={bubble.label}
                  >
                    {bubble.icon}
                  </motion.button>
                );
              })}
          </AnimatePresence>

          {/* Main FAB button */}
          <motion.button
            onClick={toggleOpen}
            className={cn(
              "relative rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-colors duration-150",
              fabColor,
              fabHover
            )}
            style={{ width: fabSize, height: fabSize }}
            whileTap={{ scale: 0.92 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {mainButton?.icon ?? <Plus className="w-7 h-7 text-white" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Secondary gooey group */}
        {secondaryMenu && (
          <div
            style={{
              filter: showSecondaryGoo ? "url(#gooey-secondary)" : "none",
              pointerEvents: "none",
            }}
            className="absolute bottom-0 right-0 z-0"
          >
            {showSecondaryGoo && (
              <div
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-brand-blue-700"
                style={{
                  transform: `translate(${triggerPosition.x}px, ${triggerPosition.y}px)`,
                }}
                aria-hidden="true"
              />
            )}
            <AnimatePresence onExitComplete={() => setIsSecondaryExiting(false)}>
              {showSecondaryMenu && secondaryBubbleElements}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
