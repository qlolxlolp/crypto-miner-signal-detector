"use client"

import { useEffect, useRef, useState } from "react"

interface SignalVisualizerProps {
  isActive: boolean
  frequency: number
}

export default function SignalVisualizer({ isActive, frequency }: SignalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationId, setAnimationId] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // تنظیم اندازه canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // تابع رسم سیگنال
    const drawSignal = () => {
      if (!ctx || !canvas) return

      // پاک کردن canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // رسم خط پایه
      ctx.beginPath()
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      // اگر اسکن فعال است، سیگنال را رسم کن
      if (isActive) {
        // رسم سیگنال اصلی
        ctx.beginPath()
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2

        const now = Date.now() / 1000
        const baseAmplitude = canvas.height / 4

        for (let x = 0; x < canvas.width; x++) {
          // ایجاد سیگنال پیچیده با استفاده از چند سینوس با فرکانس‌های مختلف
          const t = x / canvas.width
          const frequencyFactor = frequency / 500 // فاکتور مقیاس برای فرکانس

          // سیگنال اصلی
          const mainSignal = Math.sin(2 * Math.PI * (t * 10 + now) * frequencyFactor) * baseAmplitude

          // نویز با فرکانس بالا
          const noise = Math.sin(2 * Math.PI * (t * 50 + now * 2)) * (baseAmplitude / 10)

          // سیگنال ماینر شبیه‌سازی شده (با فرکانس ثابت)
          const minerSignal =
            isActive && Math.random() > 0.7 ? Math.sin(2 * Math.PI * (t * 30)) * (baseAmplitude / 3) : 0

          const y = canvas.height / 2 - (mainSignal + noise + minerSignal)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // رسم اطلاعات فرکانس
      ctx.fillStyle = "#1e293b"
      ctx.font = "14px var(--font-bnazanin)"
      ctx.textAlign = "right"
      ctx.fillText(`فرکانس: ${frequency} MHz`, canvas.width - 10, 20)

      if (isActive) {
        const id = requestAnimationFrame(drawSignal)
        setAnimationId(id)
      }
    }

    drawSignal()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isActive, frequency, animationId])

  return (
    <div className="w-full h-full bg-secondary/30 rounded-md relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          برای مشاهده سیگنال، اسکن را شروع کنید
        </div>
      )}
    </div>
  )
}

