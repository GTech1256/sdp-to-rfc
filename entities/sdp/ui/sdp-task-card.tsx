import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2 } from 'lucide-react'
import { SDPTask } from "@/shared/types/rfc"
import { PullRequestsSection } from "./pull-requests-section"

interface SDPTaskCardProps {
  task: SDPTask
  onRemove: (taskId: string, e?: React.MouseEvent) => void
  onUpdatePullRequests: (taskId: string, pullRequests: any[]) => void
  readOnly?: boolean
  expandedSDP: string | null
  onToggleExpand: (taskId: string | null) => void
  prUrls: Record<string, string>
  prErrors: Record<string, string>
  onUpdatePrUrl: (taskId: string, url: string) => void
  onAddPullRequest: (taskId: string) => void
}

export function SDPTaskCard({ 
  task, 
  onRemove, 
  onUpdatePullRequests,
  readOnly = false,
  expandedSDP,
  onToggleExpand,
  prUrls,
  prErrors,
  onUpdatePrUrl,
  onAddPullRequest
}: SDPTaskCardProps) {
  return (
    <Card className="glass-card gradient-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <h4 className="font-medium text-white">{task.title}</h4>
              <a 
                href={task.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mb-4">{task.description}</p>
            
            <PullRequestsSection
              task={task}
              onUpdatePullRequests={onUpdatePullRequests}
              readOnly={readOnly}
              isExpanded={expandedSDP === task.id}
              onToggleExpand={() => onToggleExpand(expandedSDP === task.id ? null : task.id)}
              prUrl={prUrls[task.id] || ''}
              prError={prErrors[task.id]}
              onUpdatePrUrl={(url) => onUpdatePrUrl(task.id, url)}
              onAddPullRequest={() => onAddPullRequest(task.id)}
            />
          </div>
          
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onRemove(task.id, e)}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
