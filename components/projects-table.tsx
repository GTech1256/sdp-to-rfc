"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, GitBranch, ExternalLink } from 'lucide-react'

interface Project {
  repository: string
  currentVersion: string
  changeType: 'patch' | 'minor' | 'major'
  nextVersion: string
}

interface ProjectsTableProps {
  projects: Project[]
  onUpdate: (projects: Project[]) => void
  onChangeTypeUpdate: (repository: string, changeType: 'patch' | 'minor' | 'major') => void
  readOnly?: boolean
}

export function ProjectsTable({ projects, onUpdate, onChangeTypeUpdate, readOnly = false }: ProjectsTableProps) {
  const updateNextVersion = (repository: string, nextVersion: string) => {
    const updatedProjects = projects.map(project =>
      project.repository === repository
        ? { ...project, nextVersion }
        : project
    )
    onUpdate(updatedProjects)
  }

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

  // Функция для определения URL репозитория
  const getRepositoryUrl = (repository: string) => {
    // Проверяем, содержит ли репозиторий полный путь с доменом
    if (repository.includes('github.')) {
      // Если это уже полный URL или содержит домен GitHub Enterprise
      if (repository.startsWith('http')) {
        return repository
      }
      // Если это домен без протокола, добавляем https
      return `https://${repository}`
    }
    
    // Если это стандартный формат owner/repo, используем github.com
    if (repository.includes('/')) {
      return `https://github.com/${repository}`
    }
    
    // Fallback для других случаев
    return `https://github.com/${repository}`
  }

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center">
          <GitBranch className="h-5 w-5 mr-2 text-cyan-400" />
          Проекты
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length > 0 ? (
          <div className="glass-card rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">Repository</TableHead>
                  <TableHead className="text-gray-300">Current Version</TableHead>
                  <TableHead className="text-gray-300">Change Type</TableHead>
                  <TableHead className="text-gray-300">Next Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.repository} className="border-white/10 hover:bg-white/5">
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
                          onChange={(e) => updateNextVersion(project.repository, e.target.value)}
                          className="w-28 glass-card border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/50"
                          size="sm"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl nft-gradient flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Проекты появятся автоматически</h3>
            <p className="text-gray-400">После добавления Pull Requests проекты будут сгенерированы</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
