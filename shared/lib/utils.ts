import { ERROR_INVALID_GITHUB_URL } from "../error/const";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const validateGitHubUrl = (url: string): { isValid: boolean; error?: string } => {
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

export const getRepositoryUrl = (repository: string) => {
  if (repository.includes('github.')) {
    if (repository.startsWith('http')) {
      return repository
    }
    return `https://${repository}`
  }
  
  if (repository.includes('/')) {
    return `https://github.com/${repository}`
  }
  
  return `https://github.com/${repository}`
}

export const calculateNextVersion = (current: string, changeType: 'patch' | 'minor' | 'major'): string => {
  const [major, minor, patch] = current.split('.').map(Number)
  
  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      return current
  }
}
