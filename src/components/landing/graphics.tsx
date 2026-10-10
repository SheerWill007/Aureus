import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Isometric helpers                                                  */
/* ================================================================== */

type P3 = [number, number, number];
const COS30 = 0.866;
const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * COS30, (x + y) * 0.5 - z];
const pts = (arr: P3[]) =>
  arr
    .map((p) => iso(...p))
    .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
    .join(" ");

const LINE = "rgba(255,255,255,0.75)";

function Slab({
  x,
  y,
  z,
  w,
  d,
  h,
  top = "#000",
  right = "#0c0c0c",
  left = "#141414",
  stroke = LINE,
  dashed = false,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top?: string;
  right?: string;
  left?: string;
  stroke?: string;
  dashed?: boolean;
}) {
  const T = z + h;
  const common = {
    stroke,
    strokeWidth: 0.9,
    strokeLinejoin: "round" as const,
    strokeDasharray: dashed ? "3 3" : undefined,
  };
  return (
    <g>
      {h > 0 && (
        <>
          <polygon
            points={pts([
              [x + w, y, T],
              [x + w, y + d, T],
              [x + w, y + d, z],
              [x + w, y, z],
            ])}
            fill={right}
            {...common}
          />
          <polygon
            points={pts([
              [x, y + d, T],
              [x + w, y + d, T],
              [x + w, y + d, z],
              [x, y + d, z],
            ])}
            fill={left}
            {...common}
          />
        </>
      )}
      <polygon
        points={pts([
          [x, y, T],
          [x + w, y, T],
          [x + w, y + d, T],
          [x, y + d, T],
        ])}
        fill={top}
        {...common}
      />
    </g>
  );
}

function IsoRing({ cx, cy, z, r, stroke = LINE, fill = "none" }: { cx: number; cy: number; z: number; r: number; stroke?: string; fill?: string }) {
  const ring: P3[] = [];
  for (let a = 0; a < 360; a += 20) {
    const t = (a * Math.PI) / 180;
    ring.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]);
  }
  return <polygon points={pts(ring)} fill={fill} stroke={stroke} strokeWidth={0.8} />;
}

function Leader({
  from,
  to,
  num,
  label,
  anchor = "start",
}: {
  from: [number, number];
  to: [number, number];
  num: string;
  label: string;
  anchor?: "start" | "end";
}) {
  const tx = anchor === "start" ? to[0] + 6 : to[0] - 6;
  // diagonal out of the anchor, then a horizontal run under the label
  const elbowX = from[0] + (to[0] - from[0]) * 0.45;
  return (
    <g fontFamily="'JetBrains Mono', monospace" fill="#fff">
      <polyline
        points={`${from[0]},${from[1]} ${elbowX},${to[1]} ${to[0]},${to[1]}`}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.8"
      />
      <circle cx={from[0]} cy={from[1]} r="2" fill="#fff" />
      <text x={tx} y={to[1] - 5} fontSize="9" fontWeight="700" textAnchor={anchor}>
        {num}
      </text>
      <text x={tx} y={to[1] + 7} fontSize="9" textAnchor={anchor} fill="rgba(255,255,255,0.8)">
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Exploded three-layer stack (section 02)                            */
/* ------------------------------------------------------------------ */

const HALF = 110;
const TILE = 36;
const GAP = 8;
const LIME_TILES = new Set(["0-3", "0-4", "1-4", "1-3", "0-2"]);

// The kiwi "blade" mark laid flat on the vault slab
const BLADE_A: [number, number][] = [
  [-16, -70],
  [12, -70],
  [-22, 70],
  [-50, 70],
];
const BLADE_B: [number, number][] = [
  [26, -70],
  [50, -70],
  [16, 70],
  [-8, 70],
];

export function IsoStack({ className }: { className?: string }) {
  const tiles: { i: number; j: number }[] = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) tiles.push({ i, j });
  // painter's order: far (small x+y) first
  tiles.sort((a, b) => a.i + a.j - (b.i + b.j));
  const start = -HALF + 4;

  const VAULT_Z = 120;
  const CLIENT_Z = 240;

  const corner = (x: number, y: number, z1: number, z2: number, key: string) => {
    const [ax, ay] = iso(x, y, z1);
    const [bx, by] = iso(x, y, z2);
    return (
      <line key={key} x1={ax} y1={ay} x2={bx} y2={by} stroke="rgba(255,255,255,0.35)" strokeDasharray="2 4" strokeWidth="0.8" />
    );
  };

  const [clientAnchorX, clientAnchorY] = iso(HALF, -HALF, CLIENT_Z);
  const [vaultAnchorX, vaultAnchorY] = iso(-HALF, HALF, VAULT_Z + 7);
  const [chainAnchorX, chainAnchorY] = iso(HALF, HALF - 40, 0);

  return (
    <svg
      viewBox="-330 -370 660 500"
      className={className}
      role="img"
      aria-label="Kiwi architecture: client layer, key vault and chain layer"
    >
      {/* corner guides */}
      {corner(HALF, -HALF, 16, VAULT_Z, "c1")}
      {corner(-HALF, HALF, 16, VAULT_Z, "c2")}
      {corner(HALF, HALF, 16, VAULT_Z, "c3")}
      {corner(HALF, -HALF, VAULT_Z + 14, CLIENT_Z, "c4")}
      {corner(-HALF, HALF, VAULT_Z + 14, CLIENT_Z, "c5")}
      {corner(HALF, HALF, VAULT_Z + 14, CLIENT_Z, "c6")}

      {/* 03 — chain layer */}
      <g>
        <Slab x={-HALF} y={-HALF} z={0} w={HALF * 2} d={HALF * 2} h={6} />
        {tiles.map(({ i, j }) => {
          const x = start + i * (TILE + GAP);
          const y = start + j * (TILE + GAP);
          const lime = LIME_TILES.has(`${i}-${j}`);
          return (
            <g key={`${i}-${j}`}>
              <Slab
                x={x}
                y={y}
                z={6}
                w={TILE}
                d={TILE}
                h={lime ? 16 : 9}
                top={lime ? "#D8FF55" : "#000"}
                right={lime ? "#9DBF22" : "#0c0c0c"}
                left={lime ? "#B6DC2E" : "#151515"}
                stroke={lime ? "#000" : LINE}
              />
              {!lime && (i + j) % 2 === 0 && (
                <IsoRing cx={x + TILE / 2} cy={y + TILE / 2} z={15} r={7} stroke="rgba(255,255,255,0.8)" />
              )}
              {!lime && (i + j) % 3 === 1 && (
                <polygon
                  points={pts([
                    [x + TILE / 2 - 5, y + TILE / 2, 15],
                    [x + TILE / 2, y + TILE / 2 - 5, 15],
                    [x + TILE / 2 + 5, y + TILE / 2, 15],
                    [x + TILE / 2, y + TILE / 2 + 5, 15],
                  ])}
                  fill="#fff"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* 02 — key vault */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <Slab x={-HALF} y={-HALF} z={VAULT_Z} w={HALF * 2} d={HALF * 2} h={14} />
        <polygon points={pts(BLADE_A.map(([u, v]) => [u, v, VAULT_Z + 14] as P3))} fill="#fff" />
        <polygon points={pts(BLADE_B.map(([u, v]) => [u, v, VAULT_Z + 14] as P3))} fill="rgba(255,255,255,0.55)" />
      </motion.g>

      {/* 01 — client layer */}
      <motion.g
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <Slab x={-HALF} y={-HALF} z={CLIENT_Z} w={HALF * 2} d={HALF * 2} h={0} top="rgba(0,0,0,0.6)" dashed />
        {/* laptop */}
        <Slab x={-96} y={-90} z={CLIENT_Z} w={110} d={76} h={5} />
        <Slab x={-88} y={-82} z={CLIENT_Z + 5} w={94} d={60} h={0} top="#0f0f0f" stroke="rgba(255,255,255,0.4)" />
        {/* phone */}
        <Slab x={34} y={-92} z={CLIENT_Z} w={40} d={78} h={7} />
        <Slab x={38} y={-86} z={CLIENT_Z + 7} w={32} d={60} h={0} top="#0f0f0f" stroke="rgba(255,255,255,0.4)" />
        {/* card */}
        <Slab x={-70} y={18} z={CLIENT_Z} w={120} d={70} h={3} />
        <Slab x={-60} y={30} z={CLIENT_Z + 3} w={30} d={10} h={0} top="#C8F03C" stroke="#000" />
      </motion.g>

      <Leader from={[clientAnchorX, clientAnchorY]} to={[clientAnchorX + 70, clientAnchorY - 40]} num="01" label="Client Layer" />
      <Leader from={[vaultAnchorX, vaultAnchorY]} to={[vaultAnchorX - 50, vaultAnchorY - 60]} num="02" label="Key Vault / HD" anchor="end" />
      <Leader from={[chainAnchorX, chainAnchorY]} to={[chainAnchorX + 80, chainAnchorY + 20]} num="03" label="ETH + SOL Chains" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Extruded isometric blade over a perspective floor (section 03)     */
/* ------------------------------------------------------------------ */

const BOLT: [number, number][] = [
  [-20, -150],
  [70, -150],
  [20, -30],
  [95, -30],
  [-60, 160],
  [-15, 25],
  [-90, 25],
];

export function IsoBolt({ className }: { className?: string }) {
  const H = 34;
  const rot = (-28 * Math.PI) / 180;
  const poly = BOLT.map(([u, v]) => [u * Math.cos(rot) - v * Math.sin(rot), u * Math.sin(rot) + v * Math.cos(rot)] as [number, number]);

  // orientation via shoelace → outward normals
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    area += x1 * y2 - x2 * y1;
  }
  const ccw = area > 0;

  const sides = poly
    .map((p, i) => {
      const q = poly[(i + 1) % poly.length];
      const ex = q[0] - p[0];
      const ey = q[1] - p[1];
      // outward normal
      const nx = ccw ? ey : -ey;
      const ny = ccw ? -ex : ex;
      const facing = nx + ny; // view direction is toward +x,+y in our iso
      return { p, q, facing, depth: p[0] + p[1] + q[0] + q[1], nx };
    })
    .filter((s) => s.facing > 0)
    .sort((a, b) => a.depth - b.depth);

  return (
    <svg viewBox="-260 -260 520 400" className={className} role="img" aria-label="Kiwi blade mark">
      <defs>
        <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="bolt-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </linearGradient>
      </defs>
      <polygon points={pts(poly.map(([x, y]) => [x, y, 0] as P3))} fill="#C8F03C" opacity="0.28" filter="url(#bolt-glow)" />
      <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        {sides.map((s, i) => (
          <polygon
            key={i}
            points={pts([
              [s.p[0], s.p[1], H],
              [s.q[0], s.q[1], H],
              [s.q[0], s.q[1], 0],
              [s.p[0], s.p[1], 0],
            ])}
            fill={s.nx > 0 ? "#0b0b0b" : "#1a1a1a"}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        ))}
        <polygon
          points={pts(poly.map(([x, y]) => [x, y, H] as P3))}
          fill="url(#bolt-top)"
          stroke="#000"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

/* ================================================================== */
/*  Layout helpers                                                     */
/* ================================================================== */

/** Thin connector drawn between sections. `points` are "x,y" in 0–100 space. */
export function Connector({
  points,
  height = 120,
  className,
  children,
}: {
  points: string | string[];
  height?: number;
  className?: string;
  children?: ReactNode;
}) {
  const lines = Array.isArray(points) ? points : [points];
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Points are authored in 0–100 space; convert to real pixels so the
  // pathLength draw-in animation isn't distorted by non-uniform scaling.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toPx = (p: string) =>
    p
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [x, y] = pair.split(",").map(Number);
        return `${((x / 100) * width).toFixed(1)},${((y / 100) * height).toFixed(1)}`;
      })
      .join(" ");

  return (
    <div ref={ref} className={cn("pointer-events-none relative mx-auto w-full max-w-6xl", className)} style={{ height }} aria-hidden="true">
      <svg viewBox={`0 0 ${width || 1} ${height}`} className="absolute inset-0 h-full w-full overflow-visible">
        {width > 0 && lines.map((p) => (
          <motion.polyline
            key={p}
            points={toPx(p)}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}

/** Absolutely position a node (BoltNode/NumberNode) on a Connector. */
export function At({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      {children}
    </div>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = items.map((t) => `${t} ////////// `).join("");
  return (
    <div className={cn("relative overflow-hidden border-y border-white/15 bg-black py-2.5", className)}>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1} className="text-[11px] uppercase tracking-[0.16em] text-white/85">
            {row}
            {row}
          </span>
        ))}
      </div>
    </div>
  );
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01ΞΣ";

/** Text that decodes from random glyphs when scrolled into view. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame++;
      const progress = frame / total;
      setOut(
        text
          .split("")
          .map((c, i) => (c === " " || i / text.length < progress ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (frame >= total) window.clearInterval(id);
    }, 35);
    return () => window.clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** Receding grid floor. Place inside a relative, overflow-hidden parent. */
export function GridFloor({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 overflow-hidden mask-fade-radial", className)} aria-hidden="true">
      <div className="grid-floor absolute -inset-x-1/2 top-0 h-[200%]" />
    </div>
  );
}
