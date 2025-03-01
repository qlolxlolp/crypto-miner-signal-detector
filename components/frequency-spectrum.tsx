"use client"

import { useEffect, useRef } from "react"

interface Signal {
  id: number
  frequency: number
  amplitude: number
  pattern: string
  suspicionLevel: number
}

interface FrequencySpectrumProps {
  signals: Signal[]
  baseFrequency: number
}

export default function FrequencySpectrum({ signals, baseFrequency }: FrequencySpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // رسم طیف فرکانسی
    const drawSpectrum = () => {
      if (!ctx || !canvas) return

      // پاک کردن canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // رسم محورها
      ctx.beginPath()
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1

      // محور افقی (فرکانس)
      ctx.moveTo(40, canvas.height - 30)
      ctx.lineTo(canvas.width - 20, canvas.height - 30)

      // محور عمودی (دامنه)
      ctx.moveTo(40, canvas.height - 30)
      ctx.lineTo(40, 20)
      ctx.stroke()

      // رسم برچسب‌های محور
      ctx.fillStyle = "#1e293b"
      ctx.font = "12px var(--font-bnazanin)"

      // برچسب محور عمودی
      ctx.save()
      ctx.translate(15, canvas.height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = "center"
      ctx.fillText("دامنه (dB)", 0, 0)
      ctx.restore()

      // برچسب محور افقی
      ctx.textAlign = "center"
      ctx.fillText("فرکانس (MHz)", canvas.width / 2, canvas.height - 5)

      // محدوده فرکانس برای نمایش
      const minFreq = baseFrequency - 10
      const maxFreq = baseFrequency + 10
      const freqRange = maxFreq - minFreq

      // رسم خطوط راهنما و مقادیر فرکانس
      const freqSteps = 5
      for (let i = 0; i <= freqSteps; i++) {
        const freq = minFreq + (freqRange * i) / freqSteps
        const x = 40 + ((canvas.width - 60) * i) / freqSteps

        // خط راهنمای عمودی
        ctx.beginPath()
        ctx.strokeStyle = "#e2e8f0"
        ctx.setLineDash([2, 2])
        ctx.moveTo(x, canvas.height - 30)
        ctx.lineTo(x, 20)
        ctx.stroke()
        ctx.setLineDash([])

        // مقدار فرکانس
        ctx.fillText(freq.toFixed(0), x, canvas.height - 15)
      }

      // رسم خطوط راهنمای افقی و مقادیر دامنه
      const ampSteps = 4
      for (let i = 0; i <= ampSteps; i++) {
        const y = 20 + ((canvas.height - 50) * (ampSteps - i)) / ampSteps
        const amp = (100 * i) / ampSteps

        // خط راهنمای افقی
        ctx.beginPath()
        ctx.strokeStyle = "#e2e8f0"
        ctx.setLineDash([2, 2])
        ctx.moveTo(40, y)
        ctx.lineTo(canvas.width - 20, y)
        ctx.stroke()
        ctx.setLineDash([])

        // مقدار دامنه
        ctx.textAlign = "right"
        ctx.fillText(amp.toFixed(0), 35, y + 4)
      }

      // رسم سیگنال‌ها
      if (signals.length > 0) {
        signals.forEach((signal) => {
          // تبدیل فرکانس به موقعیت x
          const x = 40 + ((canvas.width - 60) * (signal.frequency - minFreq)) / freqRange

          // تبدیل دامنه به موقعیت y
          const y = canvas.height - 30 - ((canvas.height - 50) * signal.amplitude) / 100

          // رنگ بر اساس سطح مشکوک بودن
          let color = "#3b82f6" // آبی برای سیگنال‌های عادی
          if (signal.suspicionLevel > 80) {
            color = "#ef4444" // قرمز برای سیگنال‌های بسیار مشکوک
          } else if (signal.suspicionLevel > 60) {
            color = "#f97316" // نارنجی برای سیگنال‌های مشکوک
          }

          // رسم میله سیگنال
          ctx.beginPath()
          ctx.fillStyle = color
          ctx.rect(x - 3, y, 6, canvas.height - 30 - y)
          ctx.fill()

          // رسم دایره در بالای میله
          ctx.beginPath()
          ctx.fillStyle = color
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fill()

          // نمایش فرکانس دقیق بالای سیگنال
          ctx.fillStyle = "#1e293b"
          ctx.textAlign = "center"
          ctx.fillText(signal.frequency.toFixed(1), x, y - 10)
        })
      } else {
        // پیام در صورت عدم وجود سیگنال
        ctx.fillStyle = "#94a3b8"
        ctx.textAlign = "center"
        ctx.font = "14px var(--font-bnazanin)"
        ctx.fillText("هیچ سیگنالی شناسایی نشده است", canvas.width / 2, canvas.height / 2)
      }
    }

    drawSpectrum()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [signals, baseFrequency])

  return (
    <div className="w-full h-full bg-secondary/30 rounded-md">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

