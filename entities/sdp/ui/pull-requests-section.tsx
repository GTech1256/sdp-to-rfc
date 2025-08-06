import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GitPullRequest, ChevronDown, Plus, AlertCircle } from 'lucide-react'
import { SDPTask } from "@/shared/types/rfc"
import { PullRequestsTable } from "./pull-requests-table"

interface PullRequestsSectionProps {
  task: SDPTask
  onUpdatePullRequests: (taskId: string, pullRequests: any[]) => void
  readOnly?: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  prUrl: string
  prError?: string
  onUpdatePrUrl: (url: string) => void
  onAddPullRequest: () => void
}

export function PullRequestsSection({
  task,
  onUpdatePullRequests,
  readOnly = false,
  isExpanded,
  onToggleExpand,
  prUrl,
  prError,
  onUpdatePrUrl,
  onAddPullRequest
}: PullRequestsSectionProps) {
  const removePullRequest = (prId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const updatedPRs = task.pullRequests.filter(pr => pr.id !== prId)
    onUpdatePullRequests(task.id, updatedPRs)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAddPullRequest()
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
        >
          <GitPullRequest className="h-4 w-4 mr-2" />
          Pull Requests ({task.pullRequests.length})
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        {!readOnly && (
          <div className="space-y-3 mb-4">
            <form className="flex space-x-3" onSubmit={handleSubmit}>
                <Input
                  value={prUrl}
                  onChange={(e) => onUpdatePrUrl(e.target.value)}
                  placeholder="http://github.lmru.tech/owner/repo/pull/123"
                  size="sm"
                  className={`glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/50 ${
                    prError ? "border-red-400 focus:border-red-400 focus:ring-red-400/50" : ""
                    }`}
                    />
                <Button 
                  size="sm" 
                  type="submit"
                  disabled={!prUrl?.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            {prError && (
              <Alert className="glass-card border-red-400/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {prError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <PullRequestsTable
          pullRequests={task.pullRequests}
          onRemove={removePullRequest}
          readOnly={readOnly}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
