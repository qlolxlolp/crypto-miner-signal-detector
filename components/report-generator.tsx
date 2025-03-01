"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Signal {
  id: number
  frequency: number
  amplitude: number
  pattern: string
  timestamp: string
  suspicionLevel: number
}

interface ReportGeneratorProps {
  signals: Signal[]
  threshold: number
}

export default function ReportGenerator({ signals, threshold }: ReportGeneratorProps) {
  // تبدیل تاریخ ISO به فرمت فارسی
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // تعیین وضعیت سیگنال بر اساس سطح مشکوک بودن
  const getSignalStatus = (suspicionLevel: number) => {
    if (suspicionLevel > 80) {
      return { label: "بسیار مشکوک", variant: "destructive" as const }
    } else if (suspicionLevel > threshold) {
      return { label: "مشکوک", variant: "warning" as const }
    } else {
      return { label: "عادی", variant: "outline" as const }
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        گزارش تحلیل سیگنال‌های رادیویی - تاریخ: {formatDate(new Date().toISOString())}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">شناسه</TableHead>
            <TableHead>فرکانس (MHz)</TableHead>
            <TableHead>دامنه</TableHead>
            <TableHead>الگو</TableHead>
            <TableHead>زمان شناسایی</TableHead>
            <TableHead>سطح مشکوک بودن</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((signal) => {
            const status = getSignalStatus(signal.suspicionLevel)
            return (
              <TableRow key={signal.id}>
                <TableCell>{signal.id}</TableCell>
                <TableCell>{signal.frequency.toFixed(1)}</TableCell>
                <TableCell>{signal.amplitude.toFixed(1)}</TableCell>
                <TableCell>{signal.pattern}</TableCell>
                <TableCell>{formatDate(signal.timestamp)}</TableCell>
                <TableCell>{signal.suspicionLevel.toFixed(0)}%</TableCell>
                <TableCell className="text-right">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="text-sm">
        <p>خلاصه گزارش:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>تعداد کل سیگنال‌های شناسایی شده: {signals.length}</li>
          <li>تعداد سیگنال‌های مشکوک: {signals.filter((s) => s.suspicionLevel > threshold).length}</li>
          <li>
            میانگین سطح مشکوک بودن:{" "}
            {(signals.reduce((sum, s) => sum + s.suspicionLevel, 0) / signals.length).toFixed(1)}%
          </li>
        </ul>
      </div>
    </div>
  )
}

