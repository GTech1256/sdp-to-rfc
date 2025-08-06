"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, GitPullRequest, ChevronDown, ExternalLink, AlertCircle, Code, Layers } from 'lucide-react'
import { ERROR_INVALID_GITHUB_URL } from "@/shared/error/const"

interface PullRequest {
  id: string
  url: string
  repository: string
  number: string
  state: string
  author: string
}

interface SDPTask {
  id: string
  url: string
  title: string
  description: string
  pullRequests: PullRequest[]
}

interface SDPSectionProps {
  sdpTasks: SDPTask[]
  onUpdate: (sdpTasks: SDPTask[]) => void
  readOnly?: boolean
}

export function SDPSection({ sdpTasks, onUpdate, readOnly = false }: SDPSectionProps) {
  const [expandedSDP, setExpandedSDP] = useState<string | null>(null)
  const [newSDPUrl, setNewSDPUrl] = useState("")
  const [prUrls, setPrUrls] = useState<Record<string, string>>({})
  const [prErrors, setPrErrors] = useState<Record<string, string>>({})

  const addSDPTask = async () => {
    if (!newSDPUrl.trim()) return

    const mockSDPData = {
      title: `SDP-${Math.floor(Math.random() * 10000)}: Исправление критической ошибки`,
      description: "Описание задачи из SDP трекера. Подробное описание проблемы и способов её решения."
    }

    const newTask: SDPTask = {
      id: Date.now().toString(),
      url: newSDPUrl,
      title: mockSDPData.title,
      description: mockSDPData.description,
      pullRequests: []
    }

    onUpdate([...sdpTasks, newTask])
    setNewSDPUrl("")
  }

  const removeSDPTask = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation() // Останавливаем всплытие события
    onUpdate(sdpTasks.filter(task => task.id !== taskId))
    const newPrUrls = { ...prUrls }
    const newPrErrors = { ...prErrors }
    delete newPrUrls[taskId]
    delete newPrErrors[taskId]
    setPrUrls(newPrUrls)
    setPrErrors(newPrErrors)
  }

  const updatePrUrl = (sdpId: string, url: string) => {
    setPrUrls(prev => ({ ...prev, [sdpId]: url }))
    if (prErrors[sdpId]) {
      setPrErrors(prev => ({ ...prev, [sdpId]: '' }))
    }
  }

  const validateGitHubUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { isValid: false, error: 'URL не может быть пустым' }
    }

    const githubPrPattern = /^https?:\/\/github(?:\.[\w.-]+)?\/([^\/\s]+)\/([^\/\s]+)\/pull\/(\d+)(?:#.*)?$/
    const match = url.match(githubPrPattern)
    
    if (!match) {
      return { 
        isValid: false, 
        error: ERROR_INVALID_GITHUB_URL
      }
    }

    return { isValid: true }
  }

  const addPullRequest = (sdpId: string) => {
    const url = prUrls[sdpId] || ''
    const validation = validateGitHubUrl(url)
    
    if (!validation.isValid) {
      setPrErrors(prev => ({ ...prev, [sdpId]: validation.error || 'Неверный URL' }))
      return
    }

    const urlParts = url.match(/https?:\/\/github(?:\.[\w.-]+)?\/([^\/\s]+)\/([^\/\s]+)\/pull\/(\d+)/)
    if (!urlParts) {
      setPrErrors(prev => ({ ...prev, [sdpId]: 'Не удалось распарсить URL' }))
      return
    }

    const [, owner, repo, prNumber] = urlParts
    const repository = `${owner}/${repo}`

    const currentTask = sdpTasks.find(task => task.id === sdpId)
    if (currentTask?.pullRequests.some(pr => pr.url === url)) {
      setPrErrors(prev => ({ ...prev, [sdpId]: 'Этот PR уже добавлен' }))
      return
    }

    const newPR: PullRequest = {
      id: Date.now().toString(),
      url,
      repository,
      number: prNumber,
      state: 'merged',
      author: 'developer'
    }

    const updatedTasks = sdpTasks.map(task =>
      task.id === sdpId
        ? { ...task, pullRequests: [...task.pullRequests, newPR] }
        : task
    )

    onUpdate(updatedTasks)
    setPrUrls(prev => ({ ...prev, [sdpId]: '' }))
    setPrErrors(prev => ({ ...prev, [sdpId]: '' }))
  }

  const removePullRequest = (sdpId: string, prId: string, e?: React.MouseEvent) => {
    e?.stopPropagation() // Останавливаем всплытие события
    const updatedTasks = sdpTasks.map(task =>
      task.id === sdpId
        ? { ...task, pullRequests: task.pullRequests.filter(pr => pr.id !== prId) }
        : task
    )
    onUpdate(updatedTasks)
  }

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center">
          <Code className="h-5 w-5 mr-2 text-blue-400" />
          SDP-задачи
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!readOnly && (
          <div className="flex space-x-3">
            <Input
              value={newSDPUrl}
              onChange={(e) => setNewSDPUrl(e.target.value)}
              placeholder="Ссылка на SDP-задачу"
              className="glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50"
            />
            <Button 
              onClick={addSDPTask} 
              disabled={!newSDPUrl.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {sdpTasks.map((task) => (
            <Card key={task.id} className="glass-card gradient-border">
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
                    
                    <Collapsible 
                      open={expandedSDP === task.id}
                      onOpenChange={(open) => setExpandedSDP(open ? task.id : null)}
                    >
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
                            <div className="flex space-x-3">
                              ????
                              <Input
                                value={prUrls[task.id] || ''}
                                onChange={(e) => updatePrUrl(task.id, e.target.value)}
                                placeholder="http://github.lmru.tech/owner/repo/pull/123"
                                size="sm"
                                className={`glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/50 ${
                                  prErrors[task.id] ? "border-red-400 focus:border-red-400 focus:ring-red-400/50" : ""
                                }`}
                              />
                              <Button 
                                size="sm" 
                                onClick={() => addPullRequest(task.id)}
                                disabled={!prUrls[task.id]?.trim()}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {prErrors[task.id] && (
                              <Alert className="glass-card border-red-400/50">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertDescription className="text-red-400">
                                  {prErrors[task.id]}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                        
                        {task.pullRequests.length > 0 ? (
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
                                {task.pullRequests.map((pr) => (
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
                                          onClick={(e) => removePullRequest(task.id, pr.id, e)}
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
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <GitPullRequest className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                            <p className="text-sm">Нет добавленных Pull Requests</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => removeSDPTask(task.id, e)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sdpTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl defi-gradient flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Добавьте SDP-задачи</h3>
            <p className="text-gray-400">Начните с добавления первой SDP-задачи для работы</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
