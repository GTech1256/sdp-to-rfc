# API Integration Guide

Руководство по интеграции с бэкендом для SDP → RFC сервиса.

## Текущее состояние

В настоящее время приложение использует **localStorage** для хранения данных. Все операции выполняются на клиенте без взаимодействия с сервером.

## Архитектура интеграции

### 1. Создание API слоя

Создать новый слой `shared/api` для работы с HTTP запросами:

\`\`\`
shared/
  api/
    base.ts          # Базовая конфигурация HTTP клиента
    rfc.ts           # API методы для RFC
    sdp.ts           # API методы для SDP задач
    github.ts        # Интеграция с GitHub API
    types.ts         # Типы для API запросов/ответов
\`\`\`

### 2. Замена storage на API calls

Заменить вызовы `storage.*` на соответствующие API методы в компонентах.

## API Endpoints

### RFC Management

#### GET /api/rfcs
Получение списка RFC пользователя.

**Query Parameters:**
- `page?: number` - номер страницы (default: 1)
- `limit?: number` - количество на странице (default: 20)
- `status?: 'draft' | 'ready'` - фильтр по статусу

**Response:**
\`\`\`typescript
{
  data: RFC[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

#### POST /api/rfcs
Создание нового RFC.

**Request Body:**
\`\`\`typescript
{
  title: string
}
\`\`\`

**Response:**
\`\`\`typescript
{
  data: RFC
}
\`\`\`

#### GET /api/rfcs/:id
Получение детальных данных RFC.

**Response:**
\`\`\`typescript
{
  data: RFCData
}
\`\`\`

#### PUT /api/rfcs/:id
Обновление RFC.

**Request Body:**
\`\`\`typescript
{
  title?: string,
  status?: 'draft' | 'ready',
  sdpTasks?: SDPTask[],
  projects?: Project[],
  regressionLink?: string,
  generatedRFC?: string
}
\`\`\`

**Response:**
\`\`\`typescript
{
  data: RFCData
}
\`\`\`

#### DELETE /api/rfcs/:id
Удаление RFC.

**Response:**
\`\`\`typescript
{
  success: boolean
}
\`\`\`

### SDP Integration

#### POST /api/sdp/fetch
Получение данных SDP задачи по URL.

**Request Body:**
\`\`\`typescript
{
  url: string
}
\`\`\`

**Response:**
\`\`\`typescript
{
  data: {
    title: string,
    description: string,
    status: string,
    assignee?: string,
    created: string,
    updated: string
  }
}
\`\`\`

### GitHub Integration

#### POST /api/github/validate-pr
Валидация Pull Request.

**Request Body:**
\`\`\`typescript
{
  url: string
}
\`\`\`

**Response:**
\`\`\`typescript
{
  data: {
    isValid: boolean,
    repository: string,
    number: string,
    state: 'open' | 'closed' | 'merged',
    author: string,
    title: string,
    mergeable?: boolean
  }
}
\`\`\`

#### POST /api/github/fetch-pr
Получение данных Pull Request.

**Request Body:**
\`\`\`typescript
{
  url: string
}
\`\`\`

**Response:**
\`\`\`typescript
{
  data: PullRequest
}
\`\`\`

## Типы для API

\`\`\`typescript
// shared/api/types.ts

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request types
export interface CreateRFCRequest {
  title: string
}

export interface UpdateRFCRequest {
  title?: string
  status?: 'draft' | 'ready'
  sdpTasks?: SDPTask[]
  projects?: Project[]
  regressionLink?: string
  generatedRFC?: string
}

export interface FetchSDPRequest {
  url: string
}

export interface ValidatePRRequest {
  url: string
}
\`\`\`

## Базовый HTTP клиент

\`\`\`typescript
// shared/api/base.ts

class ApiClient {
  private baseURL: string
  private token?: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message || 'API Error')
    }

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint
    
    return this.request<T>(url)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
)
\`\`\`

## RFC API методы

\`\`\`typescript
// shared/api/rfc.ts

import { apiClient } from './base'
import { RFC, RFCData } from '@/shared/types/rfc'
import { CreateRFCRequest, UpdateRFCRequest, PaginatedResponse } from './types'

export const rfcApi = {
  // Получение списка RFC
  async getRFCs(params?: {
    page?: number
    limit?: number
    status?: 'draft' | 'ready'
  }): Promise<PaginatedResponse<RFC>> {
    const response = await apiClient.get<PaginatedResponse<RFC>>('/api/rfcs', params)
    return response.data
  },

  // Создание RFC
  async createRFC(data: CreateRFCRequest): Promise<RFC> {
    const response = await apiClient.post<RFC>('/api/rfcs', data)
    return response.data
  },

  // Получение детальных данных RFC
  async getRFCData(id: string): Promise<RFCData> {
    const response = await apiClient.get<RFCData>(`/api/rfcs/${id}`)
    return response.data
  },

  // Обновление RFC
  async updateRFC(id: string, data: UpdateRFCRequest): Promise<RFCData> {
    const response = await apiClient.put<RFCData>(`/api/rfcs/${id}`, data)
    return response.data
  },

  // Удаление RFC
  async deleteRFC(id: string): Promise<void> {
    await apiClient.delete(`/api/rfcs/${id}`)
  }
}
\`\`\`

## Миграция с localStorage

### 1. Создание хука для API

\`\`\`typescript
// shared/hooks/useRFCApi.ts

import { useState, useEffect } from 'react'
import { rfcApi } from '@/shared/api/rfc'
import { RFC } from '@/shared/types/rfc'

export function useRFCs() {
  const [rfcs, setRfcs] = useState<RFC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRFCs()
  }, [])

  const loadRFCs = async () => {
    try {
      setLoading(true)
      const response = await rfcApi.getRFCs()
      setRfcs(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createRFC = async (title: string) => {
    try {
      const newRFC = await rfcApi.createRFC({ title })
      setRfcs(prev => [...prev, newRFC])
      return newRFC
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create RFC')
      throw err
    }
  }

  const deleteRFC = async (id: string) => {
    try {
      await rfcApi.deleteRFC(id)
      setRfcs(prev => prev.filter(rfc => rfc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete RFC')
      throw err
    }
  }

  return {
    rfcs,
    loading,
    error,
    createRFC,
    deleteRFC,
    refetch: loadRFCs
  }
}
\`\`\`

### 2. Обновление компонентов

\`\`\`typescript
// app/page.tsx (пример изменений)

export default function Dashboard() {
  const { rfcs, loading, error, createRFC, deleteRFC } = useRFCs()
  // ... остальная логика
}
\`\`\`

## Аутентификация

### JWT токены

\`\`\`typescript
// shared/lib/auth.ts

export class AuthService {
  private static TOKEN_KEY = 'auth_token'

  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
    apiClient.setToken(token)
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
\`\`\`

## Обработка ошибок

\`\`\`typescript
// shared/hooks/useErrorHandler.ts

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError('Произошла неизвестная ошибка')
    }
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
}
\`\`\`

## Переменные окружения

\`\`\`env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
\`\`\`

## Этапы миграции

1. **Создать API слой** - базовый HTTP клиент и типы
2. **Реализовать RFC API** - методы для работы с RFC
3. **Создать хуки** - useRFCs, useRFCData для замены storage
4. **Обновить компоненты** - заменить storage на API вызовы
5. **Добавить обработку ошибок** - loading states, error handling
6. **Интегрировать внешние API** - GitHub, SDP трекер
7. **Добавить аутентификацию** - JWT токены, защищенные роуты

Такая архитектура позволит легко масштабировать приложение и добавлять новые функции.
