"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// ── Terminal log lines ────────────────────────────────────────────────────────
const TERM_LINES = [
  "$ docker compose up -d",
  "[nginx]     ✓ running",
  "[postgres]  ✓ running",
  "[redis]     ✓ running",
  "$ nest start --watch",
  "[NestJS] Starting application...",
  "[DB] Connected to PostgreSQL",
  "[Redis] Connected :6379",
  "[Queue] Worker initialized",
  "[Server] Listening :3000",
  "GET  /api/users        200  11ms",
  "POST /api/auth/login   200  43ms",
  "GET  /api/courses      200   8ms",
  "$ pg_dump mydb > bak.sql",
  "[pg] Backup complete 48MB",
  "$ redis-cli info replication",
  "role:master connected_slaves:2",
  "$ npm run test:unit",
  "PASS auth.service.spec.ts",
  "PASS user.service.spec.ts",
  "Tests: 47 passed, 0 failed",
  "$ git push origin main",
  "Everything up-to-date",
];
const TERM_DOUBLED = [...TERM_LINES, ...TERM_LINES];

// ── Book data (deterministic, no Math.random) ─────────────────────────────────
const BOOKS: [number, number, string][][] = [
  [
    [0.044, 0.19, "#dc2626"],
    [0.036, 0.22, "#2563eb"],
    [0.05, 0.16, "#16a34a"],
    [0.04, 0.21, "#d97706"],
    [0.046, 0.18, "#0891b2"],
    [0.034, 0.23, "#7c3aed"],
    [0.042, 0.17, "#db2777"],
    [0.048, 0.2, "#0d9488"],
    [0.038, 0.19, "#ea580c"],
  ],
  [
    [0.04, 0.2, "#7c3aed"],
    [0.05, 0.17, "#0891b2"],
    [0.036, 0.22, "#dc2626"],
    [0.044, 0.18, "#16a34a"],
    [0.038, 0.21, "#d97706"],
    [0.046, 0.16, "#db2777"],
    [0.042, 0.23, "#2563eb"],
    [0.034, 0.19, "#059669"],
  ],
  [
    [0.048, 0.18, "#2563eb"],
    [0.038, 0.21, "#dc2626"],
    [0.044, 0.17, "#d97706"],
    [0.036, 0.22, "#0891b2"],
    [0.05, 0.19, "#16a34a"],
    [0.04, 0.2, "#7c3aed"],
    [0.042, 0.16, "#ea580c"],
    [0.034, 0.23, "#0d9488"],
    [0.046, 0.18, "#db2777"],
  ],
];

// ── Bookshelf ─────────────────────────────────────────────────────────────────
function Bookshelf({ position }: { position: [number, number, number] }) {
  const frame = "#1a1a1e";
  const shelfY = [0.03, 0.52, 0.98, 1.44];

  return (
    <group position={position}>
      {/* Frame: left, right, top, bottom panels */}
      <mesh position={[-0.42, 0.88, 0]}>
        <boxGeometry args={[0.03, 1.76, 0.52]} />
        <meshStandardMaterial color={frame} roughness={0.55} />
      </mesh>
      <mesh position={[0.42, 0.88, 0]}>
        <boxGeometry args={[0.03, 1.76, 0.52]} />
        <meshStandardMaterial color={frame} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.76, 0]}>
        <boxGeometry args={[0.87, 0.03, 0.52]} />
        <meshStandardMaterial color={frame} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.87, 0.03, 0.52]} />
        <meshStandardMaterial color={frame} roughness={0.55} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 0.88, -0.245]}>
        <boxGeometry args={[0.87, 1.76, 0.025]} />
        <meshStandardMaterial color="#111118" roughness={0.7} />
      </mesh>
      {/* Horizontal shelves */}
      {shelfY.map((y, i) => (
        <mesh key={i} position={[0, y + 0.455, 0]}>
          <boxGeometry args={[0.84, 0.025, 0.5]} />
          <meshStandardMaterial color={frame} roughness={0.55} />
        </mesh>
      ))}
      {/* Books on each shelf */}
      {BOOKS.map((shelfBooks, si) => {
        let x = -0.38;
        return shelfBooks.map(([w, h, color], bi) => {
          const cx = x + w / 2;
          x += w + 0.006;
          return (
            <mesh
              key={`${si}-${bi}`}
              position={[cx, shelfY[si] + 0.015 + h / 2, 0]}
            >
              <boxGeometry args={[w, h, 0.42]} />
              <meshStandardMaterial color={color} roughness={0.65} />
            </mesh>
          );
        });
      })}
    </group>
  );
}

// ── Desk lamp ─────────────────────────────────────────────────────────────────
function DeskLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.036, 14]} />
        <meshStandardMaterial color="#27272a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Arm lower */}
      <mesh position={[0, 0.22, 0]} rotation={[0.22, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.38, 6]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Arm upper */}
      <mesh position={[0, 0.44, -0.1]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.28, 6]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.52, -0.18]} rotation={[Math.PI * 0.55, 0, 0]}>
        <coneGeometry args={[0.075, 0.1, 16, 1, true]} />
        <meshStandardMaterial
          color="#d97706"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Warm bulb glow */}
      <pointLight
        position={[0, 0.5, -0.18]}
        color="#fde68a"
        intensity={3.5}
        distance={3.2}
        decay={1.8}
      />
    </group>
  );
}

// ── Fan ───────────────────────────────────────────────────────────────────────
function Fan({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (bladesRef.current) bladesRef.current.rotation.z += dt * 4.5;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.085, 12]} />
        <meshStandardMaterial color="#27272a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.023, 0.023, 0.9, 8]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.06, 16]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.4} />
      </mesh>
      <group ref={bladesRef} position={[0, 1.06, 0.04]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
            <boxGeometry args={[0.23, 0.038, 0.01]} />
            <meshStandardMaterial
              color="#52525b"
              transparent
              opacity={0.82}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Chair (click/hover to spin) ───────────────────────────────────────────────
function Chair({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const spinning = useRef(false);
  const angle = useRef(0);

  useFrame((_, dt) => {
    if (!spinning.current || !groupRef.current) return;
    angle.current += dt * 5;
    groupRef.current.rotation.y = angle.current;
    if (angle.current >= Math.PI * 2) {
      angle.current = 0;
      groupRef.current.rotation.y = 0;
      spinning.current = false;
    }
  });

  const start = () => {
    if (!spinning.current) {
      angle.current = 0;
      spinning.current = true;
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={start}
      onPointerEnter={start}
    >
      <mesh>
        <boxGeometry args={[0.48, 0.052, 0.48]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.32, -0.21]}>
        <boxGeometry args={[0.48, 0.58, 0.052]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.26, 0]}>
        <cylinderGeometry args={[0.027, 0.044, 0.44, 8]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.6} roughness={0.3} />
      </mesh>
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.18, -0.47, Math.cos(a) * 0.18]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.3, 0.02, 0.052]} />
            <meshStandardMaterial
              color="#3f3f46"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Monitor with live terminal ────────────────────────────────────────────────
function Monitor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.26, 0.018, 0.16]} />
        <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.036, 0.36, 0.036]} />
        <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.86, 0.52, 0.026]} />
        <meshStandardMaterial color="#18181b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0.015]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.8, 0.46, 0.002]} />
        <meshStandardMaterial
          color="#07070e"
          emissive="#083344"
          emissiveIntensity={0.8}
          roughness={0}
        />
      </mesh>
      <Html
        transform
        position={[0, 0.5, 0.017]}
        rotation={[-0.08, 0, 0]}
        scale={0.041}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: "408px",
            height: "222px",
            overflow: "hidden",
            position: "relative",
            background: "transparent",
          }}
        >
          <div
            className="term-scroll"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "5px 8px",
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: "10.5px",
              lineHeight: "1.58",
            }}
          >
            {TERM_DOUBLED.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith("$")
                    ? "#a3e635"
                    : line.startsWith("PASS") || line.includes("✓")
                      ? "#4ade80"
                      : line.startsWith("GET") || line.startsWith("POST")
                        ? "#94a3b8"
                        : "#22d3ee",
                  whiteSpace: "nowrap",
                  opacity: 0.9,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </Html>
      {/* Cyan monitor glow */}
      <pointLight
        position={[0, 0.5, 0.55]}
        color="#22d3ee"
        intensity={1.0}
        distance={2.4}
        decay={2}
      />
    </group>
  );
}

// ── Small potted plant ────────────────────────────────────────────────────────
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.05, 0.1, 10]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.052, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.01, 10]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
      {/* Leaves - 3 spheres */}
      {(
        [
          [0, 0.18, 0, 0.1],
          [-0.06, 0.13, 0.04, 0.07],
          [0.07, 0.14, -0.03, 0.075],
        ] as [number, number, number, number][]
      ).map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ── Full scene ────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={1.1} color="#ffe4b0" />

      {/* Main warm ceiling fill */}
      <pointLight
        position={[-0.5, 2.8, -0.5]}
        color="#fde68a"
        intensity={3.5}
        distance={7}
        decay={1.6}
      />
      {/* Wide overhead fill to reach dark corners */}
      <pointLight
        position={[1.0, 3.0, 0.8]}
        color="#fff5d6"
        intensity={2.2}
        distance={7}
        decay={1.6}
      />
      {/* Cool front fill for depth */}
      <pointLight
        position={[2.5, 2.2, 2.5]}
        color="#c7d2fe"
        intensity={0.7}
        distance={7}
        decay={2}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#1e1c2a" roughness={0.88} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.6, -2.6]}>
        <planeGeometry args={[7, 3.2]} />
        <meshStandardMaterial
          color="#252338"
          roughness={0.88}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-2.6, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7, 3.2]} />
        <meshStandardMaterial
          color="#252338"
          roughness={0.88}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Desk */}
      <group position={[0.08, 0.76, -0.88]}>
        <mesh>
          <boxGeometry args={[1.75, 0.04, 0.82]} />
          <meshStandardMaterial
            color="#1c1c1e"
            roughness={0.65}
            metalness={0.12}
          />
        </mesh>
        {(
          [
            [-0.8, -0.435, -0.36],
            [0.8, -0.435, -0.36],
            [-0.8, -0.435, 0.36],
            [0.8, -0.435, 0.36],
          ] as [number, number, number][]
        ).map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.045, 0.83, 0.045]} />
            <meshStandardMaterial
              color="#27272a"
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        ))}
        {/* Keyboard */}
        <mesh position={[0.12, 0.027, 0.2]}>
          <boxGeometry args={[0.52, 0.015, 0.185]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.55}
            metalness={0.3}
          />
        </mesh>
        {/* Mouse */}
        <mesh position={[0.55, 0.025, 0.18]}>
          <boxGeometry args={[0.082, 0.018, 0.115]} />
          <meshStandardMaterial
            color="#27272a"
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
        {/* Coffee mug */}
        <mesh position={[-0.62, 0.074, 0.14]}>
          <cylinderGeometry args={[0.04, 0.036, 0.095, 12]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.5} />
        </mesh>
        {/* Small book stack on desk */}
        <mesh position={[0.68, 0.038, -0.12]}>
          <boxGeometry args={[0.12, 0.022, 0.165]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
        </mesh>
        <mesh position={[0.68, 0.062, -0.12]}>
          <boxGeometry args={[0.115, 0.02, 0.16]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.6} />
        </mesh>
        {/* Desk lamp */}
        <DeskLamp position={[0.7, 0.022, 0.05]} />
        {/* Monitor */}
        <Monitor position={[-0.08, 0.022, -0.18]} />
        {/* Small plant on desk corner */}
        <Plant position={[-0.74, 0.053, -0.2]} />
      </group>

      {/* Chair */}
      <Chair position={[0.18, 0.472, 0.22]} />

      {/* Fan */}
      <Fan position={[1.12, 0, -1.88]} />

      {/* Bookshelf on back wall (right side) */}
      <Bookshelf position={[1.6, 0, -2.44]} />

      {/* Warm strip lights at wall/floor join */}
      <mesh position={[-2.58, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7, 0.008, 0.004]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0.005, -2.58]}>
        <boxGeometry args={[7, 0.008, 0.004]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.25} />
      </mesh>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-Math.PI / 3.2}
        maxAzimuthAngle={Math.PI / 3.2}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.78, -0.52]}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function HeroScene3D() {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs text-zinc-700 animate-pulse">
              loading scene...
            </span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [3.1, 2.7, 3.7], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
