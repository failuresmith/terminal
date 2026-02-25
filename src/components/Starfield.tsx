import { useMemo } from "react";
import { SparklesCore } from "@components/ui/sparkles";

export interface StarfieldProps {
  density?: number;
  speed?: number;
  twinkleRate?: number;
  layers?: number;
  enabled?: boolean;
  mode?: "ambient" | "constellation";
  focused?: boolean;
  visualScale?: number;
  themeTone?: "dark" | "light";
}

/**
 * Keep the old helper exported for compatibility with existing tests.
 * The legacy starfield/network subsystem remains in src/components/starfield
 * but is no longer used for runtime background rendering.
 */
export const removeDirectAdjacency = (
  adjacency: number[][],
  edges: Array<{ from: number; to: number; phase: number }>,
  senderNode: number,
  receiverNode: number,
) => {
  if (senderNode === receiverNode) return;
  if (adjacency[senderNode]) {
    adjacency[senderNode] = adjacency[senderNode].filter((n) => n !== receiverNode);
  }
  if (adjacency[receiverNode]) {
    adjacency[receiverNode] = adjacency[receiverNode].filter((n) => n !== senderNode);
  }
  for (let i = edges.length - 1; i >= 0; i -= 1) {
    const edge = edges[i];
    if (
      (edge.from === senderNode && edge.to === receiverNode) ||
      (edge.from === receiverNode && edge.to === senderNode)
    ) {
      edges.splice(i, 1);
    }
  }
};

export function Starfield({
  density = 4,
  speed = 1,
  twinkleRate = 0.4,
  layers = 3,
  enabled = true,
  focused = false,
  visualScale = 1,
  themeTone = "dark",
}: StarfieldProps) {
  const sparklesProps = useMemo(() => {
    const particleDensity = Math.max(40, Math.min(220, Math.round(density * 28)));
    const minSize = Math.max(0.4, 0.6 * visualScale);
    const maxSize = Math.max(minSize + 0.6, 1.8 * visualScale + layers * 0.08);
    const sparkleSpeed = 0.01 //Math.max(1, Math.min(8, 2 + speed * 4 + twinkleRate * 2));

    return {
      particleDensity,
      minSize,
      maxSize,
      sparkleSpeed,
    };
  }, [density, layers, speed, twinkleRate, visualScale]);

  if (!enabled) return null;

  return (
    <SparklesCore
      background="transparent"
      className={[
        "fixed inset-0 pointer-events-none z-[1] transition-all duration-300",
        focused ? "opacity-90 blur-0" : "opacity-40 blur-[1.4px]",
      ].join(" ")}
      particleColor={themeTone === "light" ? "#1f3f66" : "#cde7ff"}
      particleDensity={sparklesProps.particleDensity}
      minSize={sparklesProps.minSize}
      maxSize={sparklesProps.maxSize}
      speed={sparklesProps.sparkleSpeed}
    />
  );
}

export default Starfield;