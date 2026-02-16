"use client";

import { useState, useMemo } from "react";
import type { ProjectArchitecture, ArchNode, ArchEdge } from "./architecture-data";

const NODE_W = 130;
const NODE_H = 52;

/** Convert percentage-based x/y to SVG coordinates */
function toSvg(node: ArchNode) {
  return { cx: node.x * 10, cy: node.y * 5 };
}

/** Compute the point where a line from (cx,cy) toward (tx,ty) exits the node rect */
function borderPoint(
  cx: number,
  cy: number,
  tx: number,
  ty: number,
  hw: number,
  hh: number,
) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  // Scale factors for hitting the rect edges
  const sx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);

  return { x: cx + dx * s, y: cy + dy * s };
}

const EDGE_DURATIONS = [3.0, 3.4, 2.8, 3.2, 3.6, 2.6];

function Edge({
  edge,
  nodes,
  hovered,
  index,
}: {
  edge: ArchEdge;
  nodes: ArchNode[];
  hovered: string | null;
  index: number;
}) {
  const fromNode = nodes.find((n) => n.id === edge.from)!;
  const toNode = nodes.find((n) => n.id === edge.to)!;
  const from = toSvg(fromNode);
  const to = toSvg(toNode);

  const hw = NODE_W / 2 + 4; // half-width + gap
  const hh = NODE_H / 2 + 4;

  const start = borderPoint(from.cx, from.cy, to.cx, to.cy, hw, hh);
  const end = borderPoint(to.cx, to.cy, from.cx, from.cy, hw, hh);

  const bothWorked = fromNode.worked && toNode.worked;
  const isConnected = hovered === edge.from || hovered === edge.to;
  const highlighted = hovered ? isConnected : bothWorked;

  const strokeColor = highlighted
    ? "rgba(74, 222, 128, 0.3)"
    : "rgba(255, 255, 255, 0.07)";
  const dotColor = highlighted ? "rgba(74,222,128,0.6)" : "rgba(255,255,255,0.1)";
  const labelColor = highlighted ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.13)";

  const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  const dur = EDGE_DURATIONS[index % EDGE_DURATIONS.length];

  // Label position — offset perpendicular to avoid overlap with line
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const isVertical = Math.abs(end.x - start.x) < 10;
  const labelX = isVertical ? midX + 14 : midX;
  const labelY = isVertical ? midY : midY - 10;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1}
        markerEnd={highlighted ? "url(#arrow-green)" : "url(#arrow-dim)"}
        style={{ transition: "stroke 0.3s ease" }}
      />
      {/* Marching ants */}
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={0.8}
        strokeDasharray="4 12"
        style={{
          animation: "arch-flow 2s linear infinite",
          transition: "stroke 0.3s ease",
        }}
      />
      {/* Traveling dot */}
      <circle r={2} fill={dotColor} opacity={0.8} style={{ transition: "fill 0.3s ease" }}>
        <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
      </circle>
      {/* Label */}
      {edge.label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fill={labelColor}
          fontSize={9}
          fontFamily="var(--font-geist-mono), monospace"
          style={{ transition: "fill 0.3s ease" }}
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

function Node({
  node,
  hovered,
  onHover,
}: {
  node: ArchNode;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const { cx, cy } = toSvg(node);
  const isHovered = hovered === node.id;

  const fill = node.worked ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.02)";
  const stroke = node.worked ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.06)";
  const textColor = node.worked ? "rgba(74,222,128,0.85)" : "rgba(255,255,255,0.22)";
  const subtitleColor = node.worked ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.1)";

  return (
    <g
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      <g
        transform={`translate(${cx}, ${cy})`}
        style={{
          transition: "transform 0.2s ease",
          ...(isHovered ? { transform: `translate(${cx}px, ${cy}px) scale(1.05)` } : {}),
        }}
      >
        <rect
          x={-NODE_W / 2}
          y={-NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx={12}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          style={{ transition: "fill 0.3s, stroke 0.3s" }}
        />
        {node.worked && (
          <rect
            x={-NODE_W / 2}
            y={-NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx={12}
            fill="none"
            stroke="rgba(74,222,128,0.12)"
            strokeWidth={1}
            filter="url(#glow)"
          />
        )}
        <text
          y={-4}
          textAnchor="middle"
          fill={textColor}
          fontSize={13}
          fontWeight={500}
          fontFamily="var(--font-space-grotesk), sans-serif"
          style={{ transition: "fill 0.3s" }}
        >
          {node.label}
        </text>
        <text
          y={14}
          textAnchor="middle"
          fill={subtitleColor}
          fontSize={9}
          fontFamily="var(--font-geist-mono), monospace"
          style={{ transition: "fill 0.3s" }}
        >
          {node.category}
        </text>
      </g>
    </g>
  );
}

export default function ArchitectureDiagram({
  architecture,
}: {
  architecture: ProjectArchitecture;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Memoize to avoid re-creating on every render
  const { nodes, edges } = useMemo(() => architecture, [architecture]);

  return (
    <svg viewBox="0 0 1000 450" className="w-full h-auto">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arrow-green"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(74,222,128,0.35)" />
        </marker>
        <marker
          id="arrow-dim"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(255,255,255,0.08)" />
        </marker>
      </defs>

      {/* Edges layer */}
      {edges.map((edge, i) => (
        <Edge
          key={`${edge.from}-${edge.to}`}
          edge={edge}
          nodes={nodes}
          hovered={hovered}
          index={i}
        />
      ))}

      {/* Nodes layer */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          hovered={hovered}
          onHover={setHovered}
        />
      ))}

      {/* Legend */}
      <g transform="translate(20, 418)">
        <rect x={0} y={0} width={14} height={14} rx={4} fill="rgba(74,222,128,0.12)" stroke="rgba(74,222,128,0.3)" strokeWidth={1} />
        <text x={22} y={12} fill="rgba(74,222,128,0.45)" fontSize={14} fontFamily="var(--font-geist-mono), monospace">Built by me</text>
        <rect x={155} y={0} width={14} height={14} rx={4} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        <text x={177} y={12} fill="rgba(255,255,255,0.18)" fontSize={14} fontFamily="var(--font-geist-mono), monospace">External / third-party</text>
      </g>
    </svg>
  );
}
