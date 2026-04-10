import { useEffect, useRef } from 'react'
import styles from './CharacterCanvas.module.css'

const FRAME_COUNT = 4
const FRAME_W = 48
const FRAME_H = 48
const FRAME_INTERVAL_MS = 500

export function CharacterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = FRAME_W * 2
    canvas.height = FRAME_H * 2
    ctx.scale(2, 2)
    ctx.imageSmoothingEnabled = false

    const img = new Image()
    img.src = '/sprites/warrior-idle.png'

    const draw = () => {
      if (!img.complete) return
      ctx.clearRect(0, 0, FRAME_W, FRAME_H)
      ctx.drawImage(
        img,
        frameRef.current * FRAME_W, 0, FRAME_W, FRAME_H,
        0, 0, FRAME_W, FRAME_H
      )
    }

    img.onload = draw

    const interval = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % FRAME_COUNT
      draw()
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} pixel`}
      style={{ width: '96px', height: '96px' }}
    />
  )
}
