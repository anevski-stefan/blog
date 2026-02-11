"use client"

import { useEffect, useRef } from "react"

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mediaQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null

    if (mediaQuery?.matches) {
      return
    }

    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const THREE = await import("three")
      if (cancelled) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 30

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const particlesGeometry = new THREE.BufferGeometry()
      const particleCount = 500
      const posArray = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100
      }
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      )
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x5865f2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })
      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)

      interface FloatingShape {
        mesh: import("three").Mesh
        rotationSpeed: { x: number; y: number }
        floatSpeed: number
        floatOffset: number
        startY: number
      }

      const shapes: FloatingShape[] = []
      const geometries = [
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.OctahedronGeometry(1.5, 0),
        new THREE.TorusGeometry(1.5, 0.4, 8, 24),
      ]

      for (let i = 0; i < 6; i++) {
        const geometry = geometries[i % geometries.length]
        const material = new THREE.MeshBasicMaterial({
          color: 0x5865f2,
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        })
        const mesh = new THREE.Mesh(geometry, material)
        const startX = (Math.random() - 0.5) * 60
        const startY = (Math.random() - 0.5) * 40
        const startZ = (Math.random() - 0.5) * 20

        mesh.position.set(startX, startY, startZ)
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
        scene.add(mesh)

        shapes.push({
          mesh,
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
          },
          floatSpeed: Math.random() * 0.002 + 0.001,
          floatOffset: Math.random() * Math.PI * 2,
          startY,
        })
      }

      let targetX = 0
      let targetY = 0
      let currentX = 0
      let currentY = 0

      const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2
        targetY = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener("mousemove", handleMouseMove)

      let scrollY = 0
      const handleScroll = () => {
        scrollY = window.scrollY
      }
      window.addEventListener("scroll", handleScroll, { passive: true })

      const clock = new THREE.Clock()
      let animationId = 0

      const tick = () => {
        if (cancelled) return
        if (document.hidden) {
          animationId = 0
          return
        }

        const elapsedTime = clock.getElapsedTime()

        currentX += (targetX - currentX) * 0.02
        currentY += (targetY - currentY) * 0.02

        particles.rotation.y = currentX * 0.3
        particles.rotation.x = currentY * 0.3
        particles.rotation.z += 0.0005

        shapes.forEach(shape => {
          shape.mesh.rotation.x += shape.rotationSpeed.x
          shape.mesh.rotation.y += shape.rotationSpeed.y
          shape.mesh.position.y =
            shape.startY +
            Math.sin(elapsedTime + shape.floatOffset) * shape.floatSpeed * 10
        })

        camera.position.y = -scrollY * 0.003
        camera.rotation.x = scrollY * 0.0001

        renderer.render(scene, camera)

        animationId = requestAnimationFrame(tick)
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (animationId) cancelAnimationFrame(animationId)
          animationId = 0
          return
        }

        if (!animationId) {
          animationId = requestAnimationFrame(tick)
        }
      }
      document.addEventListener("visibilitychange", handleVisibilityChange)

      animationId = requestAnimationFrame(tick)

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanup = () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        if (animationId) cancelAnimationFrame(animationId)

        particlesGeometry.dispose()
        particlesMaterial.dispose()
        shapes.forEach(s => {
          s.mesh.geometry.dispose()
          ;(s.mesh.material as import("three").Material).dispose()
        })
        renderer.dispose()
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="webgl"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
