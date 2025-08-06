import { TableRow, TableCell } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from 'lucide-react'
import { Project } from "@/shared/types/rfc"
import { getRepositoryUrl } from "@/shared/lib/utils"

interface ProjectTableRowProps {
  project: Project
  onChangeTypeUpdate: (repository: string, changeType: 'patch' | 'minor' | 'major') => void
  onVersionUpdate: (repository: string, nextVersion: string) => void
  readOnly?: boolean
}

export function ProjectTableRow({ 
  project, 
  onChangeTypeUpdate, 
  onVersionUpdate, 
  readOnly = false 
}: ProjectTableRowProps) {
  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'patch':
        return 'bg-green-400/20 text-green-400 border-green-400/50'
      case 'minor':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
      case 'major':
        return 'bg-red-400/20 text-red-400 border-red-400/50'
      default:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/50'
    }
  }

  return (
    <TableRow className="border-white/10 hover:bg-white/5">
      <TableCell className="font-mono text-sm">
        <div className="flex items-center space-x-2">
          <a
            href={getRepositoryUrl(project.repository)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center space-x-2 group"
          >
            <span className="group-hover:underline">{project.repository}</span>
            <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </TableCell>
      <TableCell>
        <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/50">
          {project.currentVersion}
        </Badge>
      </TableCell>
      <TableCell>
        {readOnly ? (
          <Badge className={getChangeTypeColor(project.changeType)}>
            {project.changeType}
          </Badge>
        ) : (
          <RadioGroup
            value={project.changeType}
            onValueChange={(value) => onChangeTypeUpdate(project.repository, value as any)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="patch" 
                id={`${project.repository}-patch`}
                className="border-green-400 text-green-400"
              />
              <Label htmlFor={`${project.repository}-patch`} className="text-sm text-green-400">
                patch
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="minor" 
                id={`${project.repository}-minor`}
                className="border-yellow-400 text-yellow-400"
              />
              <Label htmlFor={`${project.repository}-minor`} className="text-sm text-yellow-400">
                minor
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="major" 
                id={`${project.repository}-major`}
                className="border-red-400 text-red-400"
              />
              <Label htmlFor={`${project.repository}-major`} className="text-sm text-red-400">
                major
              </Label>
            </div>
          </RadioGroup>
        )}
      </TableCell>
      <TableCell>
        {readOnly ? (
          <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/50">
            {project.nextVersion}
          </Badge>
        ) : (
          <Input
            value={project.nextVersion}
            onChange={(e) => onVersionUpdate(project.repository, e.target.value)}
            className="w-28 glass-card border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/50"
            size="sm"
          />
        )}
      </TableCell>
    </TableRow>
  )
}
