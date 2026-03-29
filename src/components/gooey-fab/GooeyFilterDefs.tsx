interface GooeyFilterDefsProps {
  primaryStdDev?: number;
  secondaryStdDev?: number;
  alphaMultiplier?: number;
  alphaOffset?: number;
}

/**
 * SVG gooey filter definitions.
 * feGaussianBlur merges nearby circle edges,
 * feColorMatrix sharpens the alpha channel back to crisp edges,
 * feComposite atop preserves original icons on top of the goo.
 */
export function GooeyFilterDefs({
  primaryStdDev = 6,
  secondaryStdDev = 5,
  alphaMultiplier = 22,
  alphaOffset = -9,
}: GooeyFilterDefsProps) {
  const matrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaMultiplier} ${alphaOffset}`;

  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="gooey-primary" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={primaryStdDev} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values={matrix} result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <filter id="gooey-secondary" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={secondaryStdDev} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values={matrix} result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
