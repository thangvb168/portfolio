'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Scene data ───────────────────────────────────────────────────────────────

type Tier = 0 | 1 | 2

interface NodeDef {
  id: string
  label: string
  pos: [number, number, number]
  size: number
  tier: Tier
}

const NODES: NodeDef[] = [
  { id: 'hub', label: 'API Gateway',     pos: [0, 0, 0],          size: 0.22, tier: 0 },
  { id: 'n1',  label: 'Auth Service',    pos: [-1.8, 1.2, 0.3],   size: 0.14, tier: 1 },
  { id: 'n2',  label: 'Business Logic',  pos: [1.5, 1.0, -0.4],   size: 0.14, tier: 1 },
  { id: 'n3',  label: 'Notifications',   pos: [1.8, -0.8, 0.6],   size: 0.14, tier: 1 },
  { id: 'n4',  label: 'Data Service',    pos: [-1.2, -1.5, 0.2],  size: 0.14, tier: 1 },
  { id: 'n5',  label: 'Redis Cache',     pos: [0.3, 1.9, -0.8],   size: 0.09, tier: 2 },
  { id: 'n6',  label: 'PostgreSQL',      pos: [-0.7, -0.4, 1.6],  size: 0.09, tier: 2 },
  { id: 'n7',  label: 'Elasticsearch',   pos: [0.6, -0.2, -1.8],  size: 0.09, tier: 2 },
  { id: 'n8',  label: 'RabbitMQ',        pos: [-1.6, 0.5, -1.0],  size: 0.09, tier: 2 },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 5], [1, 8],
  [2, 5],
  [3, 6], [3, 7],
  [4, 6],
]

const PACKET_EDGES: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4]]

const TIER_CFG: Record<Tier, { color: number; emissive: number; ei: number }> = {
  0: { color: 0x0e7490, emissive: 0x22d3ee, ei: 0.9 },
  1: { color: 0x3f3f46, emissive: 0xa1a1aa, ei: 0.28 },
  2: { color: 0x27272a, emissive: 0x717171, ei: 0.16 },
}

// Precompute adjacency list for selection highlighting
const ADJACENCY: Set<number>[] = NODES.map(() => new Set<number>())
EDGES.forEach(([a, b]) => {
  ADJACENCY[a].add(b)
  ADJACENCY[b].add(a)
})

const lerp = THREE.MathUtils.lerp

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    // ── Scene + Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const keyLight = new THREE.PointLight(0x22d3ee, 4)
    keyLight.position.set(3, 4, 2)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xa1a1aa, 1.8)
    fillLight.position.set(-3, -2, -3)
    scene.add(fillLight)

    // ── Cluster group ─────────────────────────────────────────────────────────
    const cluster = new THREE.Group()
    scene.add(cluster)

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const nodeMeshes: THREE.Mesh[] = []

    NODES.forEach((n, idx) => {
      const cfg  = TIER_CFG[n.tier]
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(n.size, 24, 24),
        new THREE.MeshStandardMaterial({
          color: cfg.color, emissive: cfg.emissive,
          emissiveIntensity: cfg.ei, roughness: 0.25, metalness: 0.75,
        })
      )
      mesh.position.set(...n.pos)
      mesh.userData.idx = idx
      cluster.add(mesh)
      nodeMeshes.push(mesh)
    })

    // ── Edges (separate Line per edge for individual highlighting) ────────────
    const edgeLines: THREE.Line[]                = []
    const edgeMats:  THREE.LineBasicMaterial[]   = []
    const edgeColors: THREE.Color[]              = EDGES.map(() => new THREE.Color(0x3f3f46))
    const edgeOpacities: number[]                = EDGES.map(() => 0.45)
    const colorDefault  = new THREE.Color(0x3f3f46)
    const colorHighlight = new THREE.Color(0x22d3ee)

    EDGES.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...NODES[a].pos),
        new THREE.Vector3(...NODES[b].pos),
      ])
      const mat = new THREE.LineBasicMaterial({ color: 0x3f3f46, transparent: true, opacity: 0.45 })
      const line = new THREE.Line(geo, mat)
      cluster.add(line)
      edgeLines.push(line)
      edgeMats.push(mat)
    })

    // ── Packets ───────────────────────────────────────────────────────────────
    const packetGeo = new THREE.SphereGeometry(0.024, 8, 8)

    type Packet = { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; speed: number; offset: number }
    const packets: Packet[] = []
    const packetMats: THREE.MeshBasicMaterial[] = []

    PACKET_EDGES.forEach(([a, b], ei) => {
      ;[0, 0.34, 0.67].forEach((off) => {
        const mat  = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 })
        const mesh = new THREE.Mesh(packetGeo, mat)
        cluster.add(mesh)
        packets.push({ mesh, from: new THREE.Vector3(...NODES[a].pos), to: new THREE.Vector3(...NODES[b].pos), speed: 0.30 + ei * 0.035, offset: off + ei * 0.09 })
        packetMats.push(mat)
      })
    })

    // ── Per-node lerp state ───────────────────────────────────────────────────
    const scales = NODES.map(() => 1)
    const eis    = NODES.map((n) => TIER_CFG[n.tier].ei)

    // ── Interaction state ─────────────────────────────────────────────────────
    const mouse       = new THREE.Vector2(0, 0)
    const camTarget   = new THREE.Vector3(0, 0, 5)
    const tooltipVec  = new THREE.Vector3()
    const raycaster   = new THREE.Raycaster()

    let rotY = 0
    let rotX = 0
    let isDragging      = false
    let pointerDownX    = 0
    let pointerDownY    = 0
    let lastPointerX    = 0
    let lastPointerY    = 0
    let lastInteraction = 0   // timestamp; auto-rotation resumes 3s after last drag
    let selectedIdx     = -1
    let hoveredIdx      = -1

    // ── Pointer events ────────────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      isDragging   = true
      pointerDownX = lastPointerX = e.clientX
      pointerDownY = lastPointerY = e.clientY
      el.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      // Always update mouse for hover + parallax
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

      if (!isDragging) return

      const dx = e.clientX - lastPointerX
      const dy = e.clientY - lastPointerY
      lastPointerX = e.clientX
      lastPointerY = e.clientY

      rotY += dx * 0.008
      rotX  = Math.max(-Math.PI / 3.5, Math.min(Math.PI / 3.5, rotX + dy * 0.008))
      lastInteraction = performance.now()
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      lastInteraction = performance.now()

      // Treat as a click if pointer barely moved
      const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY)
      if (dist < 6) {
        scene.updateMatrixWorld()
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(nodeMeshes)
        if (hits.length > 0) {
          const idx = hits[0].object.userData.idx as number
          selectedIdx = selectedIdx === idx ? -1 : idx   // toggle
        } else {
          selectedIdx = -1
        }
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup',   onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // Auto-rotate when user is idle (3 s after last drag)
      if (!isDragging && performance.now() - lastInteraction > 3000) {
        rotY += 0.0012
      }
      cluster.rotation.y = rotY
      cluster.rotation.x = rotX

      // Camera: parallax when not dragging
      if (!isDragging) {
        camTarget.set(mouse.x * 0.65, mouse.y * 0.45, 5)
        camera.position.lerp(camTarget, 0.022)
        camera.lookAt(0, 0, 0)
      }

      // Raycasting for hover
      scene.updateMatrixWorld()
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(nodeMeshes)
      hoveredIdx = hits.length > 0 ? (hits[0].object.userData.idx as number) : -1

      // Cursor
      el.style.cursor = isDragging ? 'grabbing' : hoveredIdx !== -1 ? 'pointer' : 'grab'

      // ── Node visual state ─────────────────────────────────────────────────
      nodeMeshes.forEach((mesh, i) => {
        const cfg = TIER_CFG[NODES[i].tier]
        let targetScale = 1
        let targetEI    = cfg.ei

        if (selectedIdx !== -1) {
          if (i === selectedIdx) {
            targetScale = 1.55
            targetEI    = cfg.ei * 4
          } else if (ADJACENCY[selectedIdx].has(i)) {
            targetScale = 1.1
            targetEI    = cfg.ei * 1.6
          } else {
            targetScale = 0.88
            targetEI    = cfg.ei * 0.25
          }
        } else if (hoveredIdx === i) {
          targetScale = 1.45
          targetEI    = cfg.ei * 3
        }

        scales[i] = lerp(scales[i], targetScale, 0.1)
        eis[i]    = lerp(eis[i],    targetEI,    0.1)
        mesh.scale.setScalar(scales[i])
        ;(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = eis[i]
      })

      // ── Edge visual state ─────────────────────────────────────────────────
      EDGES.forEach(([a, b], i) => {
        const mat = edgeMats[i]
        let tgtOpacity = 0.45
        let tgtColor   = colorDefault

        if (selectedIdx !== -1) {
          if (a === selectedIdx || b === selectedIdx) {
            tgtOpacity = 0.95
            tgtColor   = colorHighlight
          } else {
            tgtOpacity = 0.08
          }
        }

        edgeOpacities[i] = lerp(edgeOpacities[i], tgtOpacity, 0.1)
        mat.opacity       = edgeOpacities[i]
        edgeColors[i].lerp(tgtColor, 0.1)
        mat.color.copy(edgeColors[i])
        mat.needsUpdate = true
      })

      // ── Packets ───────────────────────────────────────────────────────────
      packets.forEach(({ mesh, from, to, speed, offset }) => {
        const p = (t * speed + offset) % 1
        mesh.position.lerpVectors(from, to, p)
        ;(mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.95
      })

      // ── Tooltip ───────────────────────────────────────────────────────────
      const tip = tooltipRef.current
      if (tip) {
        const showIdx = selectedIdx !== -1 ? selectedIdx : hoveredIdx
        if (showIdx !== -1) {
          tooltipVec.set(...NODES[showIdx].pos)
          tooltipVec.applyMatrix4(cluster.matrixWorld)
          tooltipVec.project(camera)
          const x = (tooltipVec.x + 1)    * 0.5 * el.clientWidth
          const y = -(tooltipVec.y - 1) * 0.5 * el.clientHeight
          tip.style.left    = `${x}px`
          tip.style.top     = `${y}px`
          tip.textContent   = NODES[showIdx].label
          tip.style.opacity = '1'
        } else {
          tip.style.opacity = '0'
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown',  onPointerDown)
      el.removeEventListener('pointermove',  onPointerMove)
      el.removeEventListener('pointerup',    onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      ro.disconnect()

      nodeMeshes.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
      edgeLines.forEach((l) => {
        l.geometry.dispose()
        ;(l.material as THREE.Material).dispose()
      })
      packetGeo.dispose()
      packetMats.forEach((m) => m.dispose())
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      {/* Floating service label tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full -mt-2
                   font-mono text-[11px] text-cyan-400 bg-zinc-950/85 border border-zinc-800
                   rounded px-2 py-0.5 opacity-0 whitespace-nowrap transition-opacity duration-150"
        style={{ left: 0, top: 0 }}
      />
    </div>
  )
}
