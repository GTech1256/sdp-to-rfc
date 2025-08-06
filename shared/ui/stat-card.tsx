import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  gradient?: string
  valueColor?: string
}

export function StatCard({ title, value, icon, gradient = "defi-gradient", valueColor = "text-white" }: StatCardProps) {
  return (
    <Card className="glass-card gradient-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
