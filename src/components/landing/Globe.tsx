import { useEffect, useRef } from "react";

/**
 * Wireframe globe with lime "node" cities linked by lifted great-circle arcs.
 * Rendered as plain SVG; a rAF loop rewrites path data through refs so React
 * never re-renders per frame. Pauses when off-screen / reduced-motion.
 */

const SIZE = 460;
const C = SIZE / 2;
const R = 180;
const TILT = (-12 * Math.PI) / 180; // lean the north pole toward the viewer
const ROLL = (18 * Math.PI) / 180; // axial tilt in screen plane
const DEG = Math.PI / 180;

const NODES: [number, number][] = [
  [37.7, -122.4], // San Francisco
  [40.7, -74.0], // New York
  [51.5, -0.1], // London
  [52.5, 13.4], // Berlin
  [25.2, 55.3], // Dubai
  [19.0, 72.8], // Mumbai
  [1.35, 103.8], // Singapore
  [35.7, 139.7], // Tokyo
  [-33.9, 151.2], // Sydney
  [-23.5, -46.6], // São Paulo
  [6.5, 3.4], // Lagos
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [6, 8],
  [1, 9],
  [9, 10],
  [10, 2],
  [0, 7],
];

type V3 = [number, number, number];

function toVec(lat: number, lon: number): V3 {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

function project(v: V3, spin: number, lift = 1): { x: number; y: number; z: number } {
  // spin around Y
  const cs = Math.cos(spin);
  const sn = Math.sin(spin);
  const x0 = v[0] * cs + v[2] * sn;
  const z0 = -v[0] * sn + v[2] * cs;
  const y0 = v[1];
  // tilt around X
  const y1 = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
  const z1 = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
  // roll in screen plane
  const x2 = x0 * Math.cos(ROLL) - y1 * Math.sin(ROLL);
  const y2 = x0 * Math.sin(ROLL) + y1 * Math.cos(ROLL);
  return { x: C + R * lift * x2, y: C - R * lift * y2, z: z1 };
}

function slerp(a: V3, b: V3, t: number): V3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

/** Turn a sampled curve into separate front/back path strings. */
function splitPath(pts: { x: number; y: number; z: number }[], front: string[], back: string[]) {
  let cur: string[] | null = null;
  let curFront = false;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const isFront = p.z >= 0;
    if (cur === null || isFront !== curFront) {
      // start a new run, continuing from previous point for continuity
      const prev = pts[i - 1];
      cur = isFront ? front : back;
      curFront = isFront;
      cur.push(prev ? `M${prev.x.toFixed(1)} ${prev.y.toFixed(1)}` : `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
    }
    cur.push(`L${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
}

// Precompute unit-sphere geometry once
const MERIDIANS: V3[][] = [];
for (let lon = 0; lon < 180; lon += 20) {
  const ring: V3[] = [];
  for (let a = 0; a <= 360; a += 6) {
    const t = a * DEG;
    ring.push([Math.cos(t) * Math.sin(lon * DEG), Math.sin(t), Math.cos(t) * Math.cos(lon * DEG)]);
  }
  MERIDIANS.push(ring);
}
const PARALLELS: V3[][] = [];
for (const lat of [-60, -30, 0, 30, 60]) {
  const ring: V3[] = [];
  for (let lon = 0; lon <= 360; lon += 6) ring.push(toVec(lat, lon));
  PARALLELS.push(ring);
}
const NODE_VECS = NODES.map(([la, lo]) => toVec(la, lo));
const ARCS: { v: V3; lift: number }[][] = LINKS.map(([a, b]) => {
  const pts: { v: V3; lift: number }[] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    pts.push({ v: slerp(NODE_VECS[a], NODE_VECS[b], t), lift: 1 + 0.12 * Math.sin(Math.PI * t) });
  }
  return pts;
});

export default function Globe({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gridFront = useRef<SVGPathElement>(null);
  const gridBack = useRef<SVGPathElement>(null);
  const arcFront = useRef<SVGPathElement>(null);
  const arcBack = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let spin = -0.6;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const draw = () => {
      const gf: string[] = [];
      const gb: string[] = [];
      for (const ring of MERIDIANS) splitPath(ring.map((v) => project(v, spin)), gf, gb);
      for (const ring of PARALLELS) splitPath(ring.map((v) => project(v, spin)), gf, gb);
      gridFront.current?.setAttribute("d", gf.join(""));
      gridBack.current?.setAttribute("d", gb.join(""));

      const af: string[] = [];
      const ab: string[] = [];
      for (const arc of ARCS) splitPath(arc.map((p) => project(p.v, spin, p.lift)), af, ab);
      arcFront.current?.setAttribute("d", af.join(""));
      arcBack.current?.setAttribute("d", ab.join(""));

      NODE_VECS.forEach((v, i) => {
        const g = nodeRefs.current[i];
        if (!g) return;
        const p = project(v, spin);
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        g.style.opacity = p.z >= 0 ? "1" : "0.12";
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      spin += dt * 0.00012;
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    draw();
    if (reduce) return;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    if (svgRef.current) io.observe(svgRef.current);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      role="img"
      aria-label="Wireframe globe showing Kiwi network nodes across the world"
    >
      <defs>
        <radialGradient id="globe-shade" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* orbit ring */}
      <ellipse
        cx={C}
        cy={C}
        rx={R + 34}
        ry={(R + 34) * 0.32}
        transform={`rotate(-24 ${C} ${C})`}
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeDasharray="2 5"
      />

      <circle cx={C} cy={C} r={R} fill="url(#globe-shade)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      <path ref={gridBack} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <path ref={gridFront} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.8" />
      <path ref={arcBack} fill="none" stroke="rgba(200,240,60,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <path ref={arcFront} fill="none" stroke="#C8F03C" strokeWidth="1.1" />

      {NODES.map((_, i) => (
        <g key={i} ref={(el) => (nodeRefs.current[i] = el)}>
          <circle r="7" fill="none" stroke="#C8F03C" strokeOpacity="0.45" />
          <circle r="2.8" fill="#C8F03C" />
        </g>
      ))}

      {/* satellite on orbit */}
      <g transform={`rotate(-24 ${C} ${C})`}>
        <circle r="4" fill="#000" stroke="#fff" strokeWidth="1">
          <animateMotion
            dur="18s"
            repeatCount="indefinite"
            path={`M ${C - (R + 34)} ${C} a ${R + 34} ${(R + 34) * 0.32} 0 1 0 ${2 * (R + 34)} 0 a ${R + 34} ${(R + 34) * 0.32} 0 1 0 ${-2 * (R + 34)} 0`}
          />
        </circle>
      </g>
    </svg>
  );
}
