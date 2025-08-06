import { FileText, Activity, CheckCircle, GitPullRequest } from 'lucide-react'
import { RFC } from "@/shared/types/rfc"
import { StatCard } from "@/shared/ui/stat-card"

interface StatsOverviewProps {
  rfcs: RFC[]
}

export function StatsOverview({ rfcs }: StatsOverviewProps) {
  const stats = {
    total: rfcs.length,
    draft: rfcs.filter(rfc => rfc.status === 'draft').length,
    ready: rfcs.filter(rfc => rfc.status === 'ready').length,
    totalPRs: rfcs.reduce((sum, rfc) => sum + rfc.prCount, 0)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Всего RFC"
        value={stats.total}
        icon={<FileText className="h-6 w-6 text-white" />}
        gradient="defi-gradient"
      />
      
      <StatCard
        title="В работе"
        value={stats.draft}
        icon={<Activity className="h-6 w-6 text-white" />}
        gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
        valueColor="text-yellow-400"
      />
      
      <StatCard
        title="Готово"
        value={stats.ready}
        icon={<CheckCircle className="h-6 w-6 text-white" />}
        gradient="bg-gradient-to-br from-green-400 to-emerald-500"
        valueColor="text-green-400"
      />
      
      <StatCard
        title="Pull Requests"
        value={stats.totalPRs}
        icon={<GitPullRequest className="h-6 w-6 text-white" />}
        gradient="nft-gradient"
        valueColor="text-purple-400"
      />
    </div>
  )
}
