import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, GitPullRequest } from 'lucide-react'
import { PullRequest } from "@/shared/types/rfc"

interface PullRequestsTableProps {
  pullRequests: PullRequest[]
  onRemove: (prId: string, e?: React.MouseEvent) => void
  readOnly?: boolean
}

export function PullRequestsTable({ pullRequests, onRemove, readOnly = false }: PullRequestsTableProps) {
  if (pullRequests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <GitPullRequest className="h-8 w-8 mx-auto mb-3 text-gray-600" />
        <p className="text-sm">Нет добавленных Pull Requests</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300">Repository</TableHead>
            <TableHead className="text-gray-300">PR #</TableHead>
            <TableHead className="text-gray-300">State</TableHead>
            <TableHead className="text-gray-300">Author</TableHead>
            {!readOnly && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pullRequests.map((pr) => (
            <TableRow key={pr.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-mono text-sm text-cyan-400">
                {pr.repository}
              </TableCell>
              <TableCell>
                <a 
                  href={pr.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  #{pr.number}
                </a>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    pr.state === 'merged'
                      ? 'bg-purple-400/20 text-purple-400 border-purple-400/50'
                      : pr.state === 'open'
                        ? 'bg-green-400/20 text-green-400 border-green-400/50'
                        : 'bg-gray-400/20 text-gray-400 border-gray-400/50'
                  }
                >
                  {pr.state}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">{pr.author}</TableCell>
              {!readOnly && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onRemove(pr.id, e)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
