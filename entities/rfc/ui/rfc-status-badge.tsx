import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from 'lucide-react'

interface RFCStatusBadgeProps {
  status: 'draft' | 'ready'
  showIcon?: boolean
}

export function RFCStatusBadge({ status, showIcon = true }: RFCStatusBadgeProps) {
  return (
    <div className="flex items-center space-x-2">
      {showIcon && (
        status === 'draft' ? (
          <Clock className="h-4 w-4 text-yellow-400" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-400" />
        )
      )}
      <Badge 
        className={
          status === 'draft' 
            ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
            : 'bg-green-400/20 text-green-400 border-green-400/50'
        }
      >
        {status === 'draft' ? 'Draft' : 'Ready'}
      </Badge>
    </div>
  )
}
