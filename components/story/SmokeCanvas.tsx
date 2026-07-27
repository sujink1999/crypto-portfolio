"use client";

import { useEffect, useRef } from "react";

/**
 * The living light: fbm smoke on a raw WebGL quad, per the shader rules in
 * CLAUDE.md - half-resolution canvas upscaled by CSS, DPR capped at 1,
 * 3 noise octaves, rAF stopped when the tab is hidden. Output is dithered
 * in-shader so the dark falloff never bands into rings. Rest density stays
 * faint (~0.12): a haze in a black room, not a plasma ball.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 res;
uniform float time;
uniform float density;
uniform vec3 tint;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / res;
  vec2 q = uv * vec2(res.x / res.y, 1.0) * 2.2;

  /* domain-warped fbm: the warp is what makes it curl like smoke */
  vec2 warp = vec2(
    fbm(q + vec2(0.0, time * 0.12)),
    fbm(q + vec2(5.2, 1.3) - vec2(time * 0.08, 0.0))
  );
  float smoke = fbm(q + 1.6 * warp + vec2(0.0, -time * 0.16));

  /* remap the midtones so wisps separate from the void instead of
     averaging into an even haze */
  smoke = smoothstep(0.28, 0.92, smoke);

  /* falloff toward a light hanging low-center, so the room keeps one source */
  float d = distance(uv, vec2(0.5, 0.42));
  float glow = smoothstep(0.85, 0.1, d);

  float v = smoke * glow * density;

  /* blue-noise-ish dither breaks the dark ramp into invisible speckle
     instead of visible bands */
  float dither = (hash(gl_FragCoord.xy + fract(time)) - 0.5) / 255.0;

  vec3 col = tint * v + dither;
  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export default function SmokeCanvas({
  accent,
  density = 0.12,
}: {
  accent: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const densityRef = useRef(density);
  densityRef.current = density;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "res");
    const uTime = gl.getUniformLocation(prog, "time");
    const uDensity = gl.getUniformLocation(prog, "density");
    const uTint = gl.getUniformLocation(prog, "tint");

    /* smoke tint: mostly white, a breath of the company accent */
    const [r, g, b] = hexToRgb(accent);
    gl.uniform3f(uTint, 0.72 + r * 0.28, 0.72 + g * 0.28, 0.72 + b * 0.28);

    /* half-res, DPR capped at 1 - CSS upscales */
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth / 2));
      const h = Math.max(1, Math.floor(canvas.clientHeight / 2));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const frame = (now: number) => {
      /* ~30fps is plenty for slow smoke; halves the GPU cost */
      if (now - last >= 33) {
        last = now;
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.uniform1f(uDensity, densityRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        /* one still frame - haze without motion */
        gl.uniform1f(uTime, 12.0);
        gl.uniform1f(uDensity, densityRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else run();
    };
    document.addEventListener("visibilitychange", onVis);
    run();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
