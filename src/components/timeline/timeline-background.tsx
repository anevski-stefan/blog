"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function TimelineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 200
    const posArray = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    )
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x5865f2,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(particleCount * 6)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const i6 = i * 6
      const nextI3 = ((i + 1) % particleCount) * 3

      linePositions[i6] = posArray[i3]
      linePositions[i6 + 1] = posArray[i3 + 1]
      linePositions[i6 + 2] = posArray[i3 + 2]

      linePositions[i6 + 3] = posArray[nextI3]
      linePositions[i6 + 4] = posArray[nextI3 + 1]
      linePositions[i6 + 5] = posArray[nextI3 + 2]
    }

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    )

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5865f2,
      transparent: true,
      opacity: 0.05,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

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
    window.addEventListener("scroll", handleScroll)

    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      currentX += (targetX - currentX) * 0.02
      currentY += (targetY - currentY) * 0.02

      particles.rotation.y = currentX * 0.2
      particles.rotation.x = currentY * 0.2
      particles.rotation.z += 0.0003

      lines.rotation.y = currentX * 0.1
      lines.rotation.x = currentY * 0.1
      lines.rotation.z += 0.0002

      camera.position.y = -scrollY * 0.01
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)

      particlesGeometry.dispose()
      particlesMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
