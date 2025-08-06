"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Trash2, AlertTriangle, Zap, Sparkles, Activity, TrendingUp, Code, GitBranch, FileText, Plus, AlertCircle } from 'lucide-react'
import { RFCData, SDPTask, Project, PullRequest } from "@/shared/types/rfc"
import { storage } from "@/shared/lib/storage"
import { validateGitHubUrl, calculateNextVersion } from "@/shared/lib/utils"
import { RFCStatusBadge } from "@/entities/rfc/ui/rfc-status-badge"
import { SDPTaskCard } from "@/entities/sdp/ui/sdp-task-card"
import { ProjectTableRow } from "@/entities/project/ui/project-table-row"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/shared/ui/empty-state"
import { DeleteRFCModal } from "@/features/rfc/delete/ui/delete-rfc-modal"

export default function RFCEditor() {
  const params = useParams()
  const router = useRouter()
  const rfcId = params.id as string

  const [rfcData, setRfcData] = useState<RFCData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [expandedSDP, setExpandedSDP] = useState<string | null>(null)
  const [newSDPUrl, setNewSDPUrl] = useState("")
  const [sdpUrlError, setSdpUrlError] = useState("")
  const [prUrls, setPrUrls] = useState<Record<string, string>>({})
  const [prErrors, setPrErrors] = useState<Record<string, string>>({})
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const savedRfcData = storage.getRFCData(rfcId)
    
    if (savedRfcData) {
      setRfcData(savedRfcData)
    } else {
      const rfcs = storage.getRFCs()
      const rfc = rfcs.find((r) => r.id === rfcId)
      if (rfc) {
        const newRfcData: RFCData = {
          id: rfcId,
          title: rfc.title,
          status: 'draft',
          sdpTasks: [],
          projects: [],
          regressionLink: '',
          updatedAt: new Date().toISOString()
        }
        setRfcData(newRfcData)
        storage.saveRFCData(newRfcData)
      }
    }
    setIsLoading(false)
  }, [rfcId])

  useEffect(() => {
    if (!rfcData) return

    const interval = setInterval(() => {
      setAutoSaveStatus('saving')
      try {
        const updatedData = {
          ...rfcData,
          updatedAt: new Date().toISOString()
        }
        storage.saveRFCData(updatedData)
        
        const rfcs = storage.getRFCs()
        const updatedRfcs = rfcs.map((rfc) => 
          rfc.id === rfcId 
            ? { 
                ...rfc, 
                sdpCount: rfcData.sdpTasks.length,
                prCount: rfcData.sdpTasks.reduce((sum, sdp) => sum + sdp.pullRequests.length, 0),
                status: rfcData.status,
                updatedAt: new Date().toISOString()
              }
            : rfc
        )
        storage.saveRFCs(updatedRfcs)
        
        setAutoSaveStatus('saved')
      } catch (error) {
        setAutoSaveStatus('error')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [rfcData, rfcId])

  const updateRfcData = (updates: Partial<RFCData>) => {
    if (!rfcData) return
    
    const updatedData = { ...rfcData, ...updates }
    
    if (rfcData.status === 'ready' && (updates.sdpTasks || updates.projects)) {
      updatedData.status = 'draft'
      updatedData.generatedRFC = undefined
      updatedData.lastGenerated = undefined
    }
    
    setRfcData(updatedData)
  }

  const generateUniqueProjects = (sdpTasks: SDPTask[]): Project[] => {
    const repositories = new Set<string>()
    
    sdpTasks.forEach(sdp => {
      sdp.pullRequests.forEach(pr => {
        repositories.add(pr.repository)
      })
    })

    return Array.from(repositories).map(repo => ({
      repository: repo,
      currentVersion: '1.0.0',
      changeType: 'patch' as const,
      nextVersion: '1.0.1'
    }))
  }

  const addSDPTask = async ({ sdpUrl }: { sdpUrl: string }) => {
    if (!sdpUrl.trim()) return

    const number = sdpUrl.match(/SPD-(\d+)/)?.[1] || "XXXX"

    const mockSDPData = {
      title: `SDP-${number}: Исправление критической ошибки`,
      description: "Описание задачи из SDP трекера. Подробное описание проблемы и способов её решения."
    }

    const newTask: SDPTask = {
      id: Date.now().toString(),
      url: sdpUrl,
      title: mockSDPData.title,
      description: mockSDPData.description,
      pullRequests: []
    }

    const updatedTasks = [...rfcData!.sdpTasks, newTask]
    updateRfcData({ 
      sdpTasks: updatedTasks,
      projects: generateUniqueProjects(updatedTasks)
    })
    setNewSDPUrl("")
  }

  const removeSDPTask = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const updatedTasks = rfcData!.sdpTasks.filter(task => task.id !== taskId)
    updateRfcData({ 
      sdpTasks: updatedTasks,
      projects: generateUniqueProjects(updatedTasks)
    })
    
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

    const currentTask = rfcData!.sdpTasks.find(task => task.id === sdpId)
    if (currentTask?.pullRequests.some(pr => pr.url === url)) {
      setPrErrors(prev => ({ ...prev, [sdpId]: 'Этот PR уже добавлен' }))
      return
    }
    
    // Функция для случайного выбора состояния PR
    function getRandomPRState(): 'open' | 'closed' | 'merged' {
      const states: Array<'open' | 'closed' | 'merged'> = ['open', 'closed', 'merged']
      return states[Math.floor(Math.random() * states.length)]
    }

    const newPR: PullRequest = {
      id: Date.now().toString(),
      url,
      repository,
      number: prNumber,
      state: getRandomPRState(),
      author: 'developer'
    }

    const updatedTasks = rfcData!.sdpTasks.map(task =>
      task.id === sdpId
        ? { ...task, pullRequests: [...task.pullRequests, newPR] }
        : task
    )

    updateRfcData({ 
      sdpTasks: updatedTasks,
      projects: generateUniqueProjects(updatedTasks)
    })

    setPrUrls(prev => ({ ...prev, [sdpId]: '' }))
    setPrErrors(prev => ({ ...prev, [sdpId]: '' }))
  }

  const updatePullRequests = (taskId: string, pullRequests: any[]) => {
    const updatedTasks = rfcData!.sdpTasks.map(task =>
      task.id === taskId ? { ...task, pullRequests } : task
    )
    updateRfcData({ 
      sdpTasks: updatedTasks,
      projects: generateUniqueProjects(updatedTasks)
    })
  }

  const generateRFC = () => {
    if (!rfcData) return

    const title = rfcData.sdpTasks.length === 1 
      ? rfcData.sdpTasks[0].title 
      : rfcData.title

    const description = rfcData.sdpTasks
      .map(sdp => `${sdp.description}\n${sdp.url}`)
      .join('\n\n')

    const deploymentPlan = rfcData.projects
      .map(project => `• ${project.repository} Собрать тег ${project.nextVersion}`)
      .join('\n')

    const rollbackPlan = rfcData.projects
      .map(project => `• ${project.repository} Откатить на тег ${project.currentVersion}`)
      .join('\n')

    const generatedRFC = `# ${title}

## Описание
${description}

## План внедрения
${deploymentPlan}

## План отката
${rollbackPlan}

## Продукты
• 0179
• 0796

${rfcData.regressionLink ? `## Регрессионное тестирование
${rfcData.regressionLink}` : ''}`

    updateRfcData({
      status: 'ready',
      generatedRFC,
      lastGenerated: new Date().toISOString()
    })
  }

  const copyToClipboard = () => {
    if (rfcData?.generatedRFC) {
      navigator.clipboard.writeText(rfcData.generatedRFC)
    }
  }

  const handleDelete = () => {
    const rfcs = storage.getRFCs()
    const updatedRfcs = rfcs.filter((rfc) => rfc.id !== rfcId)
    storage.saveRFCs(updatedRfcs)
    storage.deleteRFC(rfcId)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 rounded-2xl crypto-gradient flex items-center justify-center animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      </div>
    )
  }

  if (!rfcData) {
    return <div className="flex items-center justify-center min-h-screen text-white">RFC не найден</div>
  }

  const canGenerate = rfcData.sdpTasks.length > 0 && 
    rfcData.sdpTasks.some(sdp => sdp.pullRequests.length > 0)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const sdpUrl = (formData.get('sdpUrl') as string).trim()
    
    // Проверка валидности ссылки на SDP
    const sdpUrlPattern = /^https:\/\/tracker\.yandex\.ru\/SPD-\d+$/
    if (!sdpUrlPattern.test(sdpUrl)) {
      setSdpUrlError('Пожалуйста, введите корректную ссылку на SDP-задачу в формате: https://tracker.yandex.ru/SPD-XXXX')
      return
    }

    // Проверка уникальности SDP-задачи по номеру
    const newSdpNumber = sdpUrl.match(/SPD-(\d+)/)?.[1]
    if (newSdpNumber) {
      const isDuplicate = rfcData.sdpTasks.some(task => {
        const taskNumber = task.url.match(/SPD-(\d+)/)?.[1]
        return taskNumber === newSdpNumber
      })
      if (isDuplicate) {
        setSdpUrlError(`SDP-задача с номером ${newSdpNumber} уже добавлена`)
        return
      }
    }

    setSdpUrlError("")
    addSDPTask({ sdpUrl })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Главная
              </Button>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">{rfcData.title}</span>
              <RFCStatusBadge status={rfcData.status} />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  autoSaveStatus === 'saving' ? 'bg-yellow-400 animate-pulse' :
                  autoSaveStatus === 'saved' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span>
                  {autoSaveStatus === 'saving' && 'Сохранение...'}
                  {autoSaveStatus === 'saved' && 'Сохранено'}
                  {autoSaveStatus === 'error' && 'Ошибка сохранения'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDeleteModalOpen(true)}
                className="border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* SDP Tasks Section */}
          <Card className="glass-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-400" />
                SDP-задачи
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {rfcData.status === 'draft' && (
                <>
                  <form className="flex space-x-3" onSubmit={handleSubmit}>
                    <Input
                      name="sdpUrl"
                      value={newSDPUrl}
                      onChange={(e) => {
                        setNewSDPUrl(e.target.value)
                        if (sdpUrlError) setSdpUrlError("")
                      }}
                      placeholder="Ссылка на SDP-задачу"
                      className="glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50"
                    />
                    <Button 
                    type="submit"
                    disabled={!newSDPUrl.trim()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  </form>
                  
                  {sdpUrlError && (
                    <Alert className="glass-card border-red-400/50">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-400">
                        {sdpUrlError}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              <div className="space-y-4">
                {rfcData.sdpTasks.map((task) => (
                  <SDPTaskCard
                    key={task.id}
                    task={task}
                    onRemove={removeSDPTask}
                    onUpdatePullRequests={updatePullRequests}
                    readOnly={rfcData.status === 'ready'}
                    expandedSDP={expandedSDP}
                    onToggleExpand={setExpandedSDP}
                    prUrls={prUrls}
                    prErrors={prErrors}
                    onUpdatePrUrl={updatePrUrl}
                    onAddPullRequest={addPullRequest}
                  />
                ))}
              </div>

              {rfcData.sdpTasks.length === 0 && (
                <EmptyState
                  icon={<Code className="h-8 w-8 text-white" />}
                  title="Добавьте SDP-задачи"
                  description="Начните с добавления первой SDP-задачи для работы"
                />
              )}
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card className="glass-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center">
                <GitBranch className="h-5 w-5 mr-2 text-cyan-400" />
                Проекты
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {rfcData.projects.length > 0 ? (
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
                      {rfcData.projects.map((project) => (
                        <ProjectTableRow
                          key={project.repository}
                          project={project}
                          onChangeTypeUpdate={(repository, changeType) => {
                            const updatedProjects = rfcData.projects.map(p =>
                              p.repository === repository
                                ? {
                                    ...p,
                                    changeType,
                                    nextVersion: calculateNextVersion(p.currentVersion, changeType)
                                  }
                                : p
                            )
                            updateRfcData({ projects: updatedProjects })
                          }}
                          onVersionUpdate={(repository, nextVersion) => {
                            const updatedProjects = rfcData.projects.map(p =>
                              p.repository === repository ? { ...p, nextVersion } : p
                            )
                            updateRfcData({ projects: updatedProjects })
                          }}
                          readOnly={rfcData.status === 'ready'}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  icon={<GitBranch className="h-8 w-8 text-white" />}
                  title="Проекты появятся автоматически"
                  description="После добавления Pull Requests проекты будут сгенерированы"
                />
              )}
            </CardContent>
          </Card>

          {/* Regression Link */}
          <Card className="glass-card">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-400" />
                Регрессионное тестирование
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label htmlFor="regression" className="text-gray-300">
                  Ссылка на регресс-тест
                </Label>
                <Input
                  id="regression"
                  value={rfcData.regressionLink}
                  onChange={(e) => updateRfcData({ regressionLink: e.target.value })}
                  placeholder="https://allure..."
                  readOnly={rfcData.status === 'ready'}
                  className="glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* RFC Preview */}
          {rfcData.generatedRFC ? (
            <Card className="glass-card">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-400" />
                    Превью RFC
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    {rfcData.lastGenerated && (
                      <Badge className="bg-green-400/20 text-green-400 border-green-400/50 text-xs">
                        {new Date(rfcData.lastGenerated).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Badge>
                    )}
                    <Button 
                      onClick={copyToClipboard} 
                      size="sm" 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Копировать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="glass-card rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 leading-relaxed">
                    {rfcData.generatedRFC}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl defi-gradient flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Превью RFC</h3>
                  <p className="text-gray-400">Превью появится после генерации</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          <div className="sticky bottom-6">
            {rfcData.status === 'draft' ? (
              <Button 
                onClick={generateRFC}
                disabled={!canGenerate}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 neon-glow py-4 text-lg font-medium"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Сформировать RFC
              </Button>
            ) : (
              <Button 
                onClick={() => updateRfcData({ status: 'draft' })}
                variant="outline"
                className="w-full border-blue-400/50 text-blue-400 hover:bg-blue-400/10 py-4 text-lg font-medium"
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Обновить RFC
              </Button>
            )}
            
            {!canGenerate && (
              <Alert className="mt-4 glass-card border-yellow-400/50">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-400">
                  Добавьте хотя бы одну SDP-задачу с Pull Request для генерации RFC
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteRFCModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        rfcTitle={rfcData.title}
      />
    </div>
  )
}
