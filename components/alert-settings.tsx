"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AlertSettingsProps {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

export default function AlertSettings({ enabled, setEnabled }: AlertSettingsProps) {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "تنظیمات هشدار ذخیره شد",
      description: "تنظیمات سیستم هشدار با موفقیت ذخیره شد.",
    })
  }

  const handleTestAlert = () => {
    if (!enabled) {
      toast({
        title: "هشدارها غیرفعال است",
        description: "لطفاً ابتدا هشدارها را فعال کنید.",
        variant: "destructive",
      })
      return
    }

    if (emailEnabled && !email) {
      toast({
        title: "آدرس ایمیل وارد نشده است",
        description: "لطفاً آدرس ایمیل را وارد کنید.",
        variant: "destructive",
      })
      return
    }

    if (smsEnabled && !phone) {
      toast({
        title: "شماره موبایل وارد نشده است",
        description: "لطفاً شماره موبایل را وارد کنید.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "هشدار آزمایشی ارسال شد",
      description: emailEnabled ? `هشدار آزمایشی به ${email} ارسال شد.` : `هشدار آزمایشی به ${phone} ارسال شد.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="alerts-main" className="font-bold">
          فعال‌سازی سیستم هشدار
        </Label>
        <Switch id="alerts-main" checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-alert">هشدار ایمیل</Label>
            </div>
            <Switch id="email-alert" checked={emailEnabled} onCheckedChange={setEmailEnabled} disabled={!enabled} />
          </div>

          {emailEnabled && (
            <div className="pl-6">
              <Label htmlFor="email" className="text-sm mb-1 block">
                آدرس ایمیل
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!enabled}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Label htmlFor="sms-alert">هشدار پیامک</Label>
            </div>
            <Switch id="sms-alert" checked={smsEnabled} onCheckedChange={setSmsEnabled} disabled={!enabled} />
          </div>

          {smsEnabled && (
            <div className="pl-6">
              <Label htmlFor="phone" className="text-sm mb-1 block">
                شماره موبایل
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!enabled}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSaveSettings} disabled={!enabled}>
              ذخیره تنظیمات
            </Button>
            <Button variant="outline" onClick={handleTestAlert} disabled={!enabled}>
              <Bell className="mr-2 h-4 w-4" />
              تست هشدار
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

