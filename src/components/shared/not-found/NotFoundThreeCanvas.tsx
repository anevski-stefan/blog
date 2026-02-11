"use client"

import { useEffect, useRef } from "react"

export function NotFoundThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let cleanupThreeInner = () => {}

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
      camera.position.z = 50

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const brokenGeo = new THREE.IcosahedronGeometry(20, 1)
      const brokenMat = new THREE.MeshBasicMaterial({
        color: 0x5865f2,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      })
      const brokenMesh = new THREE.Mesh(brokenGeo, brokenMat)
      scene.add(brokenMesh)

      const particlesGeometry = new THREE.BufferGeometry()
      const particleCount = 300
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

      let targetX = 0,
        targetY = 0
      let currentX = 0,
        currentY = 0
      const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2
        targetY = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener("mousemove", handleMouseMove)

      let animationId = 0
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        currentX += (targetX - currentX) * 0.02
        currentY += (targetY - currentY) * 0.02

        brokenMesh.rotation.x += 0.001
        brokenMesh.rotation.y += 0.002
        brokenMesh.rotation.x += currentY * 0.01
        brokenMesh.rotation.y += currentX * 0.01

        particles.rotation.y = currentX * 0.2
        particles.rotation.x = currentY * 0.2
        particles.rotation.z += 0.0003
        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanupThreeInner = () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationId)
        brokenGeo.dispose()
        brokenMat.dispose()
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      cancelled = true
      cleanupThreeInner()
    }
  }, [])

  return <canvas ref={canvasRef} id="webgl" className="fixed inset-0 -z-10" />
}
