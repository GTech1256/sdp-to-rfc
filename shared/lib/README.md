# Shared Library

Общие утилиты и библиотеки, используемые во всем приложении.

## Структура

- `storage.ts` - Работа с localStorage для хранения данных
- `utils.ts` - Общие утилитарные функции

## storage.ts

Модуль для работы с локальным хранилищем данных. Предоставляет CRUD операции для RFC.

### Основные функции

#### `getRFCs(): RFC[]`
Получает все RFC из localStorage.

#### `getRFCData(id: string): RFCData | null`
Получает детальные данные RFC по ID.

#### `saveRFC(rfc: RFC): void`
Сохраняет новый RFC или обновляет существующий.

#### `saveRFCData(data: RFCData): void`
Сохраняет детальные данные RFC.

#### `deleteRFC(id: string): void`
Удаляет RFC и связанные данные.

### Ключи хранения
- `sdp-rfc-service-rfcs` - список RFC
- `sdp-rfc-service-rfc-data-{id}` - детальные данные RFC

#### API

\`\`\`typescript
export const storage = {
  getRFCs(): RFC[]
  getRFCData(id: string): RFCData | null
  saveRFC(rfc: RFC): void
  saveRFCData(data: RFCData): void
  deleteRFC(id: string): void
}
\`\`\`

#### Особенности

**SSR-совместимость:**
\`\`\`typescript
// Проверка доступности window
if (typeof window === 'undefined') return []
\`\`\`

**Обработка ошибок:**
\`\`\`typescript
try {
  return saved ? JSON.parse(saved) : []
} catch (error) {
  console.error('Failed to parse localStorage data:', error)
  return []
}
\`\`\`

**Типобезопасность:**
\`\`\`typescript
// Все методы строго типизированы
getRFCs(): RFC[]  // Всегда возвращает массив
getRFCData(id: string): RFCData | null  // Может вернуть null
\`\`\`

#### Использование

\`\`\`typescript
// Получение списка RFC
const rfcs = storage.getRFCs()

// Сохранение нового RFC
const newRFC: RFC = { /* ... */ }
storage.saveRFC(newRFC)

// Работа с данными RFC
const rfcData = storage.getRFCData('123')
if (rfcData) {
  storage.saveRFCData({ ...rfcData, title: 'New Title' })
}

// Удаление RFC
storage.deleteRFC('123')
\`\`\`

## utils.ts

Общие утилитарные функции для приложения.

### Основные функции

#### `cn(...inputs: ClassValue[]): string`
Объединяет CSS классы с помощью clsx и tailwind-merge.

#### `generateId(): string`
Генерирует уникальный ID для новых сущностей.

#### `formatDate(date: string): string`
Форматирует дату в читаемый вид.

#### `validateUrl(url: string): boolean`
Валидирует URL адрес.

### Форматирование дат

\`\`\`typescript
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
\`\`\`

**Пример:**
\`\`\`typescript
formatDate('2024-01-15T10:30:00.000Z') // "15.01.2024, 10:30"
\`\`\`

### Валидация GitHub URL

\`\`\`typescript
export const validateGitHubUrl = (url: string): {
  isValid: boolean
  error?: string
} => {
  // Проверка на пустоту
  if (!url.trim()) {
    return { isValid: false, error: 'URL не может быть пустым' }
  }

  // Регулярное выражение для GitHub PR
  const githubPrPattern = /^https?:\/\/github(?:\.[\w.-]+)?\/([^\/\s]+)\/([^\/\s]+)\/pull\/(\d+)(?:#.*)?$/
  
  if (!url.match(githubPrPattern)) {
    return { 
      isValid: false, 
      error: 'Неверный формат URL. Ожидается ссылка на Pull Request в GitHub' 
    }
  }

  return { isValid: true }
}
\`\`\`

**Поддерживаемые форматы:**
- `https://github.com/owner/repo/pull/123`
- `http://github.lmru.tech/owner/repo/pull/456`
- `https://github.enterprise.com/owner/repo/pull/789#discussion_r123`

**Использование:**
\`\`\`typescript
const validation = validateGitHubUrl(userInput)
if (!validation.isValid) {
  setError(validation.error)
  return
}
\`\`\`

### Генерация URL репозитория

\`\`\`typescript
export const getRepositoryUrl = (repository: string): string => {
  // GitHub Enterprise с доменом
  if (repository.includes('github.')) {
    if (repository.startsWith('http')) {
      return repository
    }
    return `https://${repository}`
  }
  
  // Стандартный формат owner/repo
  if (repository.includes('/')) {
    return `https://github.com/${repository}`
  }
  
  // Fallback
  return `https://github.com/${repository}`
}
\`\`\`

**Примеры:**
\`\`\`typescript
getRepositoryUrl('facebook/react')
// → 'https://github.com/facebook/react'

getRepositoryUrl('github.lmru.tech/team/project')
// → 'https://github.lmru.tech/team/project'

getRepositoryUrl('https://github.com/vercel/next.js')
// → 'https://github.com/vercel/next.js'
\`\`\`

### Вычисление версий

\`\`\`typescript
export const calculateNextVersion = (
  current: string, 
  changeType: 'patch' | 'minor' | 'major'
): string => {
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
\`\`\`

**Семантическое версионирование:**
\`\`\`typescript
calculateNextVersion('1.2.3', 'patch')  // → '1.2.4'
calculateNextVersion('1.2.3', 'minor')  // → '1.3.0'
calculateNextVersion('1.2.3', 'major')  // → '2.0.0'
\`\`\`

## Принципы разработки

- Функции должны быть чистыми где возможно
- Обработка ошибок через возвращаемые значения
- Типизация всех параметров и возвращаемых значений

## Тестирование

### Unit тесты
Каждая утилита должна иметь тесты:

\`\`\`typescript
describe('formatDate', () => {
  it('formats date in Russian locale', () => {
    const result = formatDate('2024-01-15T10:30:00.000Z')
    expect(result).toBe('15.01.2024, 10:30')
  })

  it('handles invalid dates', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })
})
\`\`\`

### Edge cases
Тестируйте граничные случаи:

\`\`\`typescript
describe('validateGitHubUrl', () => {
  it('validates correct GitHub URLs', () => {
    const result = validateGitHubUrl('https://github.com/owner/repo/pull/123')
    expect(result.isValid).toBe(true)
  })

  it('rejects empty URLs', () => {
    const result = validateGitHubUrl('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('пустым')
  })

  it('rejects invalid formats', () => {
    const result = validateGitHubUrl('https://gitlab.com/owner/repo/merge_requests/123')
    expect(result.isValid).toBe(false)
  })
})
\`\`\`

## Расширение

### Добавление новых утилит

1. **Создайте чистую функцию:**
\`\`\`typescript
export const newUtility = (input: InputType): OutputType => {
  // Реализация
  return result
}
\`\`\`

2. **Добавьте типы:**
\`\`\`typescript
interface InputType {
  // Определение входных данных
}

type OutputType = {
  // Определение результата
}
\`\`\`

3. **Напишите тесты:**
\`\`\`typescript
describe('newUtility', () => {
  it('works correctly', () => {
    // Тесты
  })
})
\`\`\`

4. **Обновите документацию:**
- Добавьте описание в этот README
- Приведите примеры использования

### Рефакторинг существующих утилит

При изменении утилит:
- Сохраняйте обратную совместимость
- Добавляйте новые параметры как optional
- Обновляйте тесты
- Проверяйте использование во всем проекте

## Производительность

### Мемоизация
Для тяжелых вычислений:

\`\`\`typescript
const memoizedCalculation = useMemo(() => {
  return expensiveCalculation(data)
}, [data])
\`\`\`

### Ленивые вычисления
Для необязательных операций:

\`\`\`typescript
const getLazyResult = () => {
  return heavyComputation()  // Вызывается только при необходимости
}
\`\`\`

## Безопасность

### Санитизация данных
\`\`\`typescript
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}
\`\`\`

### Валидация входных данных
\`\`\`typescript
const processUserInput = (input: unknown): ProcessedData | null => {
  if (typeof input !== 'string' || input.length === 0) {
    return null
  }
  
  return { processed: input }
}
\`\`\`

## Миграция на API

При переходе на бэкенд, функции из `storage.ts` будут заменены на API вызовы, но интерфейс останется тем же для обратной совместимости.
