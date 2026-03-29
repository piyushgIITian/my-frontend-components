import type { ReactNode } from "react";

export interface BubbleItem {
  id: string;
  icon: ReactNode;
  label: string;
  /** Tailwind bg class. Defaults to "bg-brand-blue" */
  color?: string;
  /** Tailwind hover bg class. Defaults to "hover:bg-brand-blue-600" */
  hoverColor?: string;
  /** If true, this bubble triggers the secondary sub-menu */
  hasSubMenu?: boolean;
  /** Icon shown when this bubble's sub-menu is open (e.g. X icon) */
  activeIcon?: ReactNode;
  /** If true, clicking this bubble opens the panel component */
  opensPanel?: boolean;
}

export interface SecondaryBubbleItem {
  id: string;
  icon: ReactNode;
  label: string;
  /** Tailwind bg class. Defaults to "bg-brand-blue" */
  color?: string;
  /** Tailwind hover bg class */
  hoverColor?: string;
}

export interface GooeyFabProps {
  /** Primary bubbles that emerge from the main FAB button */
  bubbles: BubbleItem[];
  /** Main FAB button customization */
  mainButton?: {
    icon?: ReactNode;
    color?: string;
    hoverColor?: string;
    /** Diameter in px. Default 56 */
    size?: number;
  };
  /** Secondary menu config. Omit to disable sub-menus entirely. */
  secondaryMenu?: {
    bubbles: SecondaryBubbleItem[];
  };
  /** Render function for the panel. Receives onClose to dismiss the panel. */
  renderPanel?: (onClose: () => void) => ReactNode;
  /** Called when any bubble is clicked. Receives the bubble id. */
  onBubbleClick?: (id: string) => void;
  /** Screen corner for the FAB. Default "bottom-right" */
  position?: "bottom-right" | "bottom-left";
  /** Controls the gooey SVG filter intensity. Default "medium" */
  gooeyIntensity?: "low" | "medium" | "high";
}

/** Internal resolved position for a bubble */
export interface ResolvedBubble extends BubbleItem {
  position: { x: number; y: number };
}

export interface ResolvedSecondaryBubble extends SecondaryBubbleItem {
  position: { x: number; y: number };
}
