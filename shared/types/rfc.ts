export interface PullRequest {
  id: string
  url: string
  repository: string
  number: string
  state: 'open' | 'closed' | 'merged'
  author: string
}

export interface SDPTask {
  id: string
  url: string
  title: string
  description: string
  pullRequests: PullRequest[]
}

export interface Project {
  repository: string
  currentVersion: string
  changeType: 'patch' | 'minor' | 'major'
  nextVersion: string
}

export interface RFC {
  id: string
  title: string
  sdpCount: number
  prCount: number
  status: 'draft' | 'ready'
  updatedAt: string
  lastGenerated?: string
}

export interface RFCData {
  id: string
  title: string
  status: 'draft' | 'ready'
  sdpTasks: SDPTask[]
  projects: Project[]
  regressionLink: string
  generatedRFC?: string
  lastGenerated?: string
  updatedAt: string
}
