"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Download, FileText, Radio, Settings, Wifi } from "lucide-react"
import SignalVisualizer from "@/components/signal-visualizer"
import FrequencySpectrum from "@/components/frequency-spectrum"
import AlertSettings from "@/components/alert-settings"
import ReportGenerator from "@/components/report-generator"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [isScanning, setIsScanning] = useState(false)
  const [frequency, setFrequency] = useState(900)
  const [detectionThreshold, setDetectionThreshold] = useState(70)
  const [detectedSignals, setDetectedSignals] = useState<any[]>([])
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const { toast } = useToast()

  const handleStartScan = () => {
    setIsScanning(true)
    toast({
      title: "اسکن آغاز شد",
      description: `در حال اسکن فرکانس ${frequency} مگاهرتز...`,
    })

    // شبیه‌سازی یافتن سیگنال‌ها پس از 3 ثانیه
    setTimeout(() => {
      const simulatedSignals = simulateSignalDetection(frequency)
      setDetectedSignals(simulatedSignals)

      if (simulatedSignals.some((signal) => signal.suspicionLevel > detectionThreshold) && alertsEnabled) {
        toast({
          title: "هشدار! سیگنال مشکوک شناسایی شد",
          description: "سیگنال‌های مشکوک به ماینر رمزارز شناسایی شدند. لطفاً گزارش را بررسی کنید.",
          variant: "destructive",
        })
      }
    }, 3000)
  }

  const handleStopScan = () => {
    setIsScanning(false)
    toast({
      title: "اسکن متوقف شد",
      description: "اسکن سیگنال‌های رادیویی متوقف شد.",
    })
  }

  const simulateSignalDetection = (baseFrequency: number) => {
    // شبیه‌سازی یافتن سیگنال‌ها در اطراف فرکانس پایه
    return [
      {
        id: 1,
        frequency: baseFrequency - 2.3,
        amplitude: 45 + Math.random() * 20,
        pattern: "ثابت",
        timestamp: new Date().toISOString(),
        suspicionLevel: 65 + Math.random() * 20,
      },
      {
        id: 2,
        frequency: baseFrequency + 1.7,
        amplitude: 60 + Math.random() * 30,
        pattern: "نوسانی",
        timestamp: new Date().toISOString(),
        suspicionLevel: 75 + Math.random() * 25,
      },
      {
        id: 3,
        frequency: baseFrequency + 5.2,
        amplitude: 30 + Math.random() * 15,
        pattern: "متناوب",
        timestamp: new Date().toISOString(),
        suspicionLevel: 45 + Math.random() * 30,
      },
    ]
  }

  const handleDownloadReport = () => {
    // در یک برنامه واقعی، این تابع گزارش PDF را تولید و دانلود می‌کند
    toast({
      title: "گزارش دانلود شد",
      description: "گزارش تحلیل سیگنال‌ها با موفقیت دانلود شد.",
    })
  }

  return (
    <main className="container mx-auto py-6 font-bnazanin">
      <h1 className="text-3xl font-bold text-center mb-6">سیستم شناسایی سیگنال‌های رادیویی ماینرهای رمزارز</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>تنظیمات اسکن</span>
            </CardTitle>
            <CardDescription>پارامترهای اسکن سیگنال را تنظیم کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">فرکانس (مگاهرتز)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="frequency"
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  min={100}
                  max={2000}
                />
                <span className="text-sm text-muted-foreground">MHz</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">آستانه تشخیص</Label>
              <Slider
                id="threshold"
                min={0}
                max={100}
                step={1}
                value={[detectionThreshold]}
                onValueChange={(value) => setDetectionThreshold(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>کم</span>
                <span>{detectionThreshold}%</span>
                <span>زیاد</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alerts">فعال‌سازی هشدارها</Label>
              <Switch id="alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {!isScanning ? (
              <Button className="w-full" onClick={handleStartScan}>
                <Radio className="mr-2 h-4 w-4" />
                شروع اسکن
              </Button>
            ) : (
              <Button className="w-full" variant="destructive" onClick={handleStopScan}>
                <Radio className="mr-2 h-4 w-4" />
                توقف اسکن
              </Button>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={handleDownloadReport}
              disabled={detectedSignals.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              دانلود گزارش
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>نمایش سیگنال‌ها</CardTitle>
            <CardDescription>نمایش گرافیکی سیگنال‌های دریافتی</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visualizer">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visualizer">نمایش سیگنال</TabsTrigger>
                <TabsTrigger value="spectrum">طیف فرکانسی</TabsTrigger>
              </TabsList>
              <TabsContent value="visualizer" className="h-[300px]">
                <SignalVisualizer isActive={isScanning} frequency={frequency} />
              </TabsContent>
              <TabsContent value="spectrum" className="h-[300px]">
                <FrequencySpectrum signals={detectedSignals} baseFrequency={frequency} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {detectedSignals.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>گزارش سیگنال‌های شناسایی شده</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportGenerator signals={detectedSignals} threshold={detectionThreshold} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>سیستم هشدار</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlertSettings enabled={alertsEnabled} setEnabled={setAlertsEnabled} />

              {detectedSignals.some((signal) => signal.suspicionLevel > detectionThreshold) && (
                <Alert variant="destructive" className="mt-4">
                  <Wifi className="h-4 w-4" />
                  <AlertTitle>هشدار! سیگنال مشکوک شناسایی شد</AlertTitle>
                  <AlertDescription>
                    سیگنال‌های مشکوک به ماینر رمزارز در فرکانس {frequency} مگاهرتز شناسایی شدند.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <Toaster />
    </main>
  )
}

