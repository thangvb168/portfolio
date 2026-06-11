"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// ── Palette ───────────────────────────────────────────────────────────────────
const WALL = "#cc8e60"; // warm peach/amber
const FLOOR = "#18100a"; // dark walnut floor
const WALNUT = "#5a3a1a"; // walnut furniture
const STEEL = "#2c2c2c"; // dark metal
const STEEL2 = "#404046"; // mid metal

// ── Dashboard content (left monitor, horizontal) ──────────────────────────────
const DASH: { t: string; c: string; b?: boolean }[] = [
  { t: "NGINX ROUTING STATUS", c: "#f59e0b", b: true },
  { t: "  /api/auth    → :3001  ✓", c: "#4ade80" },
  { t: "  /api/courses → :3002  ✓", c: "#4ade80" },
  { t: "  /api/upload  → :3003  ✓", c: "#4ade80" },
  { t: "  /media       → cdn    ✓", c: "#4ade80" },
  { t: "", c: "" },
  { t: "DOCKER CONTAINERS", c: "#f59e0b", b: true },
  { t: "  postgres   Up 3d   :5432", c: "#94a3b8" },
  { t: "  redis      Up 3d   :6379", c: "#94a3b8" },
  { t: "  rabbitmq   Up 3d   :5672", c: "#94a3b8" },
  { t: "  minio      Up 2d   :9000", c: "#94a3b8" },
  { t: "  nginx      Up 3d   :443", c: "#94a3b8" },
  { t: "", c: "" },
  { t: "SERVER METRICS", c: "#f59e0b", b: true },
  { t: "  CPU  ████████░░  78%", c: "#22d3ee" },
  { t: "  MEM  ██████░░░░  61%", c: "#22d3ee" },
  { t: "  DSK  ████░░░░░░  41%", c: "#22d3ee" },
  { t: "", c: "" },
  { t: "RECENT LOGS", c: "#f59e0b", b: true },
  { t: "  [nginx]  GET /courses 200", c: "#64748b" },
  { t: "  [queue]  HLS chunk 4/12", c: "#64748b" },
  { t: "  [minio]  upload done 48MB", c: "#64748b" },
  { t: "  [nginx]  POST /auth 200", c: "#64748b" },
];
const DASH_D = [...DASH, ...DASH];

// ── PHP + SQL code (right monitor, vertical/portrait) ─────────────────────────
const CODE: { t: string; c: string }[] = [
  { t: "<?php", c: "#c084fc" },
  { t: "namespace App\\Service;", c: "#94a3b8" },
  { t: "", c: "" },
  { t: "class VideoService", c: "#38bdf8" },
  { t: "{", c: "#e2e8f0" },
  { t: "  private PDO $db;", c: "#94a3b8" },
  { t: "", c: "" },
  { t: "  public function getLessons(", c: "#4ade80" },
  { t: "    int $cid,", c: "#fbbf24" },
  { t: "    int $uid", c: "#fbbf24" },
  { t: "  ): array {", c: "#4ade80" },
  { t: "    $stmt = $this->db", c: "#e2e8f0" },
  { t: "      ->prepare('", c: "#e2e8f0" },
  { t: "        SELECT l.id,", c: "#fb923c" },
  { t: "          l.title,", c: "#fb923c" },
  { t: "          l.hls_url,", c: "#fb923c" },
  { t: "          p.completed_at", c: "#fb923c" },
  { t: "        FROM lessons l", c: "#fb923c" },
  { t: "        LEFT JOIN progress p", c: "#fb923c" },
  { t: "          ON p.lid = l.id", c: "#fb923c" },
  { t: "         AND p.uid = :uid", c: "#fb923c" },
  { t: "        WHERE l.cid = :cid", c: "#fb923c" },
  { t: "        ORDER BY l.sort_order'", c: "#fb923c" },
  { t: "    );", c: "#e2e8f0" },
  { t: "    $stmt->execute([", c: "#e2e8f0" },
  { t: "      ':cid' => $cid,", c: "#94a3b8" },
  { t: "      ':uid' => $uid,", c: "#94a3b8" },
  { t: "    ]);", c: "#e2e8f0" },
  { t: "    return $stmt->fetchAll();", c: "#4ade80" },
  { t: "  }", c: "#e2e8f0" },
  { t: "}", c: "#38bdf8" },
];
const CODE_D = [...CODE, ...CODE];

// ── Book data for shelf 3 ─────────────────────────────────────────────────────
const SHELF_BOOKS: [number, number, string][] = [
  [0.042, 0.21, "#dc2626"],
  [0.034, 0.23, "#2563eb"],
  [0.048, 0.18, "#16a34a"],
  [0.038, 0.22, "#d97706"],
  [0.044, 0.19, "#0891b2"],
  [0.032, 0.24, "#7c3aed"],
  [0.04, 0.2, "#db2777"],
  [0.046, 0.21, "#0d9488"],
];
const BOOK_TITLES = [
  "PostgreSQL",
  "SOLID",
  "Architecture",
  "Clean Code",
  "DDD",
  "HTTP/2",
  "Nginx",
  "Redis",
];

// ── Smoke particles (coffee steam) ───────────────────────────────────────────
function SmokeParticles({ position }: { position: [number, number, number] }) {
  const N = 9;
  const refs = useRef<(THREE.Mesh | null)[]>(Array(N).fill(null));

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = (t * 0.45 + i / N) % 1;
      mesh.position.set(
        Math.sin(t * 0.7 + (i / N) * Math.PI * 2) * 0.012,
        p * 0.22,
        Math.cos(t * 0.5 + (i / N) * Math.PI * 2) * 0.008,
      );
      mesh.scale.setScalar(0.009 + p * 0.016);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.36;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: N }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[1, 5, 5]} />
          <meshBasicMaterial color="#d4bfa0" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ── Blinking LED ──────────────────────────────────────────────────────────────
function BlinkingLED({
  position,
  color,
  phase,
}: {
  position: [number, number, number];
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const on = Math.sin(clock.elapsedTime * 2.8 + phase) > 0.1;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = on
      ? 0.95
      : 0.08;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.006, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

// ── NAS mini-server ───────────────────────────────────────────────────────────
function NASUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.2, 0.11, 0.25]} />
        <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Drive bay slots */}
      {[-0.055, 0, 0.055].map((z, i) => (
        <mesh key={i} position={[0, 0, z + 0.127]}>
          <boxGeometry args={[0.16, 0.07, 0.002]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
      <BlinkingLED position={[0.082, 0.022, 0.127]} color="#4ade80" phase={0} />
      <BlinkingLED
        position={[0.082, 0.002, 0.127]}
        color="#f87171"
        phase={1.8}
      />
      <BlinkingLED
        position={[0.082, -0.018, 0.127]}
        color="#4ade80"
        phase={3.4}
      />
    </group>
  );
}

// ── Bookshelf ─────────────────────────────────────────────────────────────────
function Bookshelf({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const shelfY = [0.0, 0.38, 0.76, 1.14, 1.52];

  return (
    <group position={position} rotation={rotation}>
      {/* Side panels */}
      {([-0.38, 0.38] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]}>
          <boxGeometry args={[0.026, 1.8, 0.38]} />
          <meshStandardMaterial color={WALNUT} roughness={0.65} />
        </mesh>
      ))}
      {/* Top + bottom */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.786, 0.026, 0.38]} />
        <meshStandardMaterial color={WALNUT} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.786, 0.026, 0.38]} />
        <meshStandardMaterial color={WALNUT} roughness={0.65} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 0.9, -0.177]}>
        <boxGeometry args={[0.786, 1.8, 0.018]} />
        <meshStandardMaterial color="#1a0d05" roughness={0.85} />
      </mesh>
      {/* Shelf boards */}
      {shelfY.map((y, i) => (
        <mesh key={i} position={[0, y + 0.36, 0]}>
          <boxGeometry args={[0.76, 0.02, 0.37]} />
          <meshStandardMaterial color={WALNUT} roughness={0.65} />
        </mesh>
      ))}

      {/* Shelf 0: NAS + kraft box */}
      <NASUnit position={[0.06, 0.065, 0.02]} />
      <mesh position={[-0.24, 0.073, 0]}>
        <boxGeometry args={[0.14, 0.12, 0.21]} />
        <meshStandardMaterial color="#b87c4a" roughness={0.85} />
      </mesh>

      {/* Shelf 1: box + NAS */}
      <mesh position={[-0.2, 0.446, 0]}>
        <boxGeometry args={[0.16, 0.13, 0.23]} />
        <meshStandardMaterial color="#c4956a" roughness={0.85} />
      </mesh>
      <NASUnit position={[0.1, 0.455, 0.02]} />

      {/* Shelf 2: Books with titles */}
      {(() => {
        let x = -0.35;
        return SHELF_BOOKS.map(([w, h, color], bi) => {
          const cx = x + w / 2;
          x += w + 0.005;
          return (
            <group key={bi} position={[cx, shelfY[2] + 0.02 + h / 2, 0]}>
              <mesh>
                <boxGeometry args={[w, h, 0.3]} />
                <meshStandardMaterial color={color} roughness={0.65} />
              </mesh>
              {bi < BOOK_TITLES.length && (
                <Html
                  transform
                  position={[0, 0, 0.152]}
                  scale={0.015}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.88)",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {BOOK_TITLES[bi]}
                  </div>
                </Html>
              )}
            </group>
          );
        });
      })()}

      {/* Shelf 3: Pothos plant + decorative figure */}
      <group position={[-0.22, shelfY[3] + 0.13, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.052, 0.042, 0.1, 9]} />
          <meshStandardMaterial color="#5c3d1e" roughness={0.8} />
        </mesh>
        {(
          [
            [0, 0.17, 0, 0.08],
            [-0.07, 0.1, 0.04, 0.063],
            [0.08, 0.11, -0.03, 0.068],
            [-0.1, 0.04, 0.01, 0.05],
            [0.11, 0.05, 0.02, 0.054],
          ] as [number, number, number, number][]
        ).map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 7, 7]} />
            <meshStandardMaterial
              color={i < 3 ? "#166534" : "#16a34a"}
              roughness={0.85}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[0.27, shelfY[3] + 0.067, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.1, 7]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.27, shelfY[3] + 0.154, 0]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Shelf 4: More Pothos */}
      <group position={[0, shelfY[4] + 0.14, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.057, 0.047, 0.105, 9]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {(
          [
            [0, 0.19, 0, 0.09],
            [-0.08, 0.12, 0.05, 0.068],
            [0.09, 0.13, -0.04, 0.072],
            [-0.12, 0.05, 0.01, 0.054],
            [0.13, 0.06, 0.03, 0.058],
          ] as [number, number, number, number][]
        ).map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 7, 7]} />
            <meshStandardMaterial
              color={i < 3 ? "#15803d" : "#16a34a"}
              roughness={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Desk lamp ─────────────────────────────────────────────────────────────────
function DeskLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.062, 0.072, 0.034, 12]} />
        <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.22, 0.02]} rotation={[0.24, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.38, 6]} />
        <meshStandardMaterial color={STEEL2} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.44, -0.08]} rotation={[-0.28, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.26, 6]} />
        <meshStandardMaterial color={STEEL2} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.52, -0.17]} rotation={[Math.PI * 0.55, 0, 0]}>
        <coneGeometry args={[0.07, 0.095, 14, 1, true]} />
        <meshStandardMaterial
          color="#b45309"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <pointLight
        position={[0, 0.5, -0.17]}
        color="#fde68a"
        intensity={4.5}
        distance={3.5}
        decay={1.8}
      />
    </group>
  );
}

// ── Floor lamp ────────────────────────────────────────────────────────────────
function FloorLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.15, 0.17, 0.08, 12]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 1.84, 8]} />
        <meshStandardMaterial color={STEEL2} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.97, 0]}>
        <cylinderGeometry args={[0.24, 0.07, 0.22, 16, 1, true]} />
        <meshStandardMaterial
          color="#92400e"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 2.08, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.018, 16]} />
        <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.5} />
      </mesh>
      <pointLight
        position={[0, 1.96, 0]}
        color="#fbbf24"
        intensity={3.5}
        distance={5.5}
        decay={1.7}
      />
    </group>
  );
}

// ── Fan ───────────────────────────────────────────────────────────────────────
function Fan({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (bladesRef.current) bladesRef.current.rotation.z += dt * 4.8;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.09, 12]} />
        <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.9, 8]} />
        <meshStandardMaterial color={STEEL2} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.19, 0.014, 8, 20]} />
        <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.1, 0.03]}>
        <cylinderGeometry args={[0.038, 0.038, 0.036, 10]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.5} />
      </mesh>
      <group ref={bladesRef} position={[0, 1.1, 0.036]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
            <boxGeometry args={[0.22, 0.036, 0.009]} />
            <meshStandardMaterial
              color="#52525b"
              transparent
              opacity={0.8}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Chair (hover / click to spin 360°) ───────────────────────────────────────
function Chair({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const spinning = useRef(false);
  const angle = useRef(0);

  useFrame((_, dt) => {
    if (!spinning.current || !ref.current) return;
    angle.current += dt * 4.8;
    ref.current.rotation.y = angle.current;
    if (angle.current >= Math.PI * 2) {
      angle.current = 0;
      ref.current.rotation.y = 0;
      spinning.current = false;
    }
  });

  const startSpin = () => {
    if (!spinning.current) {
      angle.current = 0;
      spinning.current = true;
    }
  };

  return (
    <group
      ref={ref}
      position={position}
      onClick={startSpin}
      onPointerEnter={startSpin}
    >
      {/* Seat */}
      <mesh>
        <boxGeometry args={[0.5, 0.052, 0.5]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.85} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.36, -0.22]}>
        <boxGeometry args={[0.5, 0.64, 0.048]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.85} />
      </mesh>
      {/* Lumbar */}
      <mesh position={[0, 0.18, -0.2]}>
        <boxGeometry args={[0.46, 0.1, 0.065]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>
      {/* Headrest */}
      <mesh position={[0, 0.72, -0.2]}>
        <boxGeometry args={[0.38, 0.14, 0.056]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>
      {/* Armrests */}
      {([-0.27, 0.27] as number[]).map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.09, 0]}>
            <boxGeometry args={[0.04, 0.12, 0.34]} />
            <meshStandardMaterial
              color="#374151"
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[x, 0.156, 0.02]}>
            <boxGeometry args={[0.055, 0.025, 0.2]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Gas cylinder */}
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.027, 0.042, 0.44, 8]} />
        <meshStandardMaterial color={STEEL2} metalness={0.65} roughness={0.3} />
      </mesh>
      {/* 5-star base */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.2, -0.49, Math.cos(a) * 0.2]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.32, 0.02, 0.054]} />
            <meshStandardMaterial
              color={STEEL2}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      {/* Casters */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.27, -0.503, Math.cos(a) * 0.27]}
          >
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Left monitor – horizontal, dashboard ─────────────────────────────────────
function MonitorLeft({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stand base */}
      <mesh>
        <boxGeometry args={[0.2, 0.014, 0.13]} />
        <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.028, 0.32, 0.028]} />
        <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0.47, 0]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.82, 0.5, 0.022]} />
        <meshStandardMaterial color="#18181b" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Display panel */}
      <mesh position={[0, 0.47, 0.013]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.76, 0.44, 0.001]} />
        <meshStandardMaterial
          color="#050810"
          emissive="#0d1b2a"
          emissiveIntensity={1.4}
          roughness={0}
        />
      </mesh>
      <Html
        transform
        position={[0, 0.47, 0.016]}
        rotation={[-0.06, 0, 0]}
        scale={0.038}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: "444px",
            height: "258px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="term-scroll"
            style={{
              position: "absolute",
              bottom: 0,
              padding: "5px 8px",
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: "10px",
              lineHeight: "1.5",
              whiteSpace: "nowrap",
            }}
          >
            {DASH_D.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.c || "#475569",
                  fontWeight: line.b ? "bold" : "normal",
                }}
              >
                {line.t || " "}
              </div>
            ))}
          </div>
        </div>
      </Html>
      <pointLight
        position={[0, 0.47, 0.65]}
        color="#22d3ee"
        intensity={1.0}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

// ── Right monitor – vertical / portrait, PHP code ────────────────────────────
function MonitorRight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stand base */}
      <mesh>
        <boxGeometry args={[0.16, 0.014, 0.12]} />
        <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.026, 0.38, 0.026]} />
        <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Bezel – portrait orientation */}
      <mesh position={[0, 0.65, 0]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.38, 0.64, 0.022]} />
        <meshStandardMaterial color="#18181b" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Display panel */}
      <mesh position={[0, 0.65, 0.013]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.33, 0.58, 0.001]} />
        <meshStandardMaterial
          color="#080b10"
          emissive="#0f1117"
          emissiveIntensity={1.4}
          roughness={0}
        />
      </mesh>
      <Html
        transform
        position={[0, 0.65, 0.016]}
        rotation={[-0.06, 0, 0]}
        scale={0.026}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: "280px",
            height: "498px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="code-scroll"
            style={{
              position: "absolute",
              top: 0,
              padding: "5px 8px",
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: "9.5px",
              lineHeight: "1.5",
              whiteSpace: "nowrap",
            }}
          >
            {CODE_D.map((line, i) => (
              <div key={i} style={{ color: line.c || "#475569" }}>
                {line.t || " "}
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ── Whiteboard on back wall ───────────────────────────────────────────────────
function Whiteboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.92, 0.58, 0.028]} />
        <meshStandardMaterial color="#292524" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Marker tray */}
      <mesh position={[0, -0.3, 0.022]}>
        <boxGeometry args={[0.8, 0.028, 0.04]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Board surface */}
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[0.86, 0.52, 0.004]} />
        <meshStandardMaterial color="#f0ede6" roughness={0.88} />
      </mesh>
      <Html
        transform
        position={[0, 0, 0.024]}
        scale={0.044}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            width: "432px",
            height: "258px",
            fontFamily: "monospace",
            fontSize: "9px",
            color: "#1e293b",
            padding: "10px 12px",
            boxSizing: "border-box",
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            E-Learning Video Pipeline
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "8px",
              marginBottom: "8px",
            }}
          >
            {(
              [
                { l: "Upload\nAPI", bg: "#f1f5f9" },
                null,
                { l: "RabbitMQ\nQueue", bg: "#fef9c3" },
                null,
                { l: "FFmpeg\nWorker", bg: "#f0fdf4" },
                null,
                { l: "HLS\nStream", bg: "#eff6ff" },
              ] as ({ l: string; bg: string } | null)[]
            ).map((item, i) =>
              item ? (
                <div
                  key={i}
                  style={{
                    border: "1.5px solid #64748b",
                    borderRadius: "3px",
                    padding: "3px 5px",
                    background: item.bg,
                    textAlign: "center",
                    whiteSpace: "pre",
                    lineHeight: 1.3,
                  }}
                >
                  {item.l}
                </div>
              ) : (
                <div key={i} style={{ color: "#64748b" }}>
                  &#8594;
                </div>
              ),
            )}
          </div>
          <div
            style={{ fontSize: "7.5px", color: "#475569", marginBottom: "2px" }}
          >
            Storage: MinIO Object Store (s3-compatible)
          </div>
          <div
            style={{ fontSize: "7.5px", color: "#475569", marginBottom: "7px" }}
          >
            CDN: Nginx proxy_pass + cache_control headers
          </div>
          <div
            style={{
              borderTop: "1.5px dashed #cbd5e1",
              paddingTop: "6px",
              fontSize: "7.5px",
              color: "#374151",
            }}
          >
            <div>lessons (id, course_id, hls_url, duration, sort)</div>
            <div>progress (user_id, lesson_id, pct, completed_at)</div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// ── PC Tower under desk ───────────────────────────────────────────────────────
function PCTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.2, 0.44, 0.4]} />
        <meshStandardMaterial
          color="#18181c"
          roughness={0.65}
          metalness={0.3}
        />
      </mesh>
      {/* Tempered glass side panel */}
      <mesh position={[0.102, 0, 0]}>
        <boxGeometry args={[0.001, 0.42, 0.38]} />
        <meshStandardMaterial
          color="#a5f3fc"
          transparent
          opacity={0.1}
          roughness={0}
        />
      </mesh>
      {/* Internal LED glow */}
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.28]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} />
      </mesh>
      {/* Power button */}
      <mesh position={[0, 0.19, 0.202]}>
        <cylinderGeometry args={[0.016, 0.016, 0.008, 10]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <pointLight
        position={[0.26, 0, 0]}
        color="#f59e0b"
        intensity={0.5}
        distance={0.85}
        decay={2}
      />
    </group>
  );
}

// ── Rug under chair ───────────────────────────────────────────────────────────
function Rug({ position }: { position: [number, number, number] }) {
  return (
    <group>
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.35, 1.35]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.95} />
      </mesh>
      {/* Geometric border ring */}
      <mesh
        position={[position[0], position[1] + 0.001, position[2]]}
        rotation={[-Math.PI / 2, Math.PI / 4, 0]}
      >
        <ringGeometry args={[0.54, 0.6, 4]} />
        <meshStandardMaterial color="#b45309" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ── Main Scene ────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.85} color="#ffe4b0" />
      {/* Main warm ceiling key */}
      <pointLight
        position={[-0.5, 3.1, -0.5]}
        color="#fde68a"
        intensity={5}
        distance={9}
        decay={1.5}
      />
      {/* Wide overhead fill */}
      <pointLight
        position={[1.2, 3.0, 0.8]}
        color="#fff5d6"
        intensity={3}
        distance={9}
        decay={1.5}
      />
      {/* Cool front accent */}
      <pointLight
        position={[2.5, 2.2, 2.5]}
        color="#c7d2fe"
        intensity={0.8}
        distance={7}
        decay={2}
      />

      {/* Floor – dark walnut */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color={FLOOR} roughness={0.85} />
      </mesh>

      {/* Back wall – warm peach */}
      <mesh position={[0, 1.7, -3.0]}>
        <planeGeometry args={[9, 3.5]} />
        <meshStandardMaterial
          color={WALL}
          roughness={0.88}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Left wall */}
      <mesh position={[-3.0, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 3.5]} />
        <meshStandardMaterial
          color={WALL}
          roughness={0.88}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Baseboard trim */}
      <mesh position={[0, 0.04, -2.98]}>
        <boxGeometry args={[9, 0.08, 0.018]} />
        <meshStandardMaterial color="#3d2b1a" roughness={0.7} />
      </mesh>
      <mesh position={[-2.98, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[9, 0.08, 0.018]} />
        <meshStandardMaterial color="#3d2b1a" roughness={0.7} />
      </mesh>

      {/* Rug under chair */}
      <Rug position={[0.18, 0.002, 0.24]} />

      {/* DESK */}
      <group position={[0.1, 0.78, -0.94]}>
        {/* Tabletop – walnut */}
        <mesh>
          <boxGeometry args={[1.96, 0.046, 0.88]} />
          <meshStandardMaterial
            color={WALNUT}
            roughness={0.5}
            metalness={0.06}
          />
        </mesh>
        {/* U-frame steel legs */}
        {([-0.91, 0.91] as number[]).map((x, i) => (
          <group key={i} position={[x, -0.43, 0]}>
            <mesh position={[0, 0, -0.38]}>
              <boxGeometry args={[0.04, 0.82, 0.04]} />
              <meshStandardMaterial
                color={STEEL}
                metalness={0.75}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0, 0.38]}>
              <boxGeometry args={[0.04, 0.82, 0.04]} />
              <meshStandardMaterial
                color={STEEL}
                metalness={0.75}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, -0.41, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.8]} />
              <meshStandardMaterial
                color={STEEL}
                metalness={0.75}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
        {/* Dual monitors */}
        <MonitorLeft position={[-0.4, 0.025, -0.22]} />
        <MonitorRight position={[0.56, 0.025, -0.24]} />
        {/* Mechanical keyboard + RGB strip */}
        <mesh position={[0.06, 0.03, 0.19]}>
          <boxGeometry args={[0.58, 0.017, 0.2]} />
          <meshStandardMaterial
            color="#111118"
            roughness={0.55}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0.06, 0.039, 0.19]}>
          <boxGeometry args={[0.54, 0.002, 0.16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} />
        </mesh>
        {/* Ergonomic mouse */}
        <mesh position={[0.66, 0.028, 0.17]}>
          <boxGeometry args={[0.082, 0.02, 0.118]} />
          <meshStandardMaterial
            color="#27272a"
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
        {/* White ceramic coffee mug */}
        <mesh position={[-0.74, 0.079, 0.13]}>
          <cylinderGeometry args={[0.037, 0.033, 0.1, 12]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.35} />
        </mesh>
        <mesh position={[-0.72, 0.06, 0.13]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.022, 0.006, 6, 10, Math.PI]} />
          <meshStandardMaterial color="#e8e8e0" roughness={0.35} />
        </mesh>
        <SmokeParticles position={[-0.74, 0.14, 0.13]} />
        {/* Notebooks */}
        <mesh position={[0.7, 0.036, -0.06]}>
          <boxGeometry args={[0.145, 0.025, 0.19]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.65} />
        </mesh>
        <mesh position={[0.7, 0.062, -0.06]}>
          <boxGeometry args={[0.135, 0.019, 0.175]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.65} />
        </mesh>
        {/* Fountain pen */}
        <mesh position={[0.78, 0.075, 0.06]} rotation={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.0048, 0.0048, 0.155, 6]} />
          <meshStandardMaterial
            color="#1e1e2e"
            metalness={0.75}
            roughness={0.2}
          />
        </mesh>
        {/* Desk lamp */}
        <DeskLamp position={[0.82, 0.025, 0.06]} />
      </group>

      {/* PC Tower under desk */}
      <PCTower position={[0.62, 0.22, -1.5]} />

      {/* Chair */}
      <Chair position={[0.2, 0.475, 0.28]} />

      {/* Bookshelf on left wall – rotated to face room */}
      <Bookshelf position={[-2.56, 0, -0.55]} rotation={[0, Math.PI / 2, 0]} />

      {/* Retro fan beside bookshelf */}
      <Fan position={[-1.82, 0, -2.08]} />

      {/* Whiteboard on back wall, right of center */}
      <Whiteboard position={[1.15, 1.9, -2.97]} />

      {/* Floor lamp in corner */}
      <FloorLamp position={[-2.72, 0, -2.64]} />

      {/* Warm LED strip at wall/floor joints */}
      <mesh position={[-2.97, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[9, 0.007, 0.004]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0.005, -2.97]}>
        <boxGeometry args={[9, 0.007, 0.004]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} />
      </mesh>

      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.45}
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.95, -0.65]}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function HeroScene3D() {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs text-zinc-600 animate-pulse">
              loading scene...
            </span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [3.2, 2.8, 3.8], fov: 44 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
