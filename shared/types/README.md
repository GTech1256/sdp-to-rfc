# Shared Types

🏷️ **Типы данных и интерфейсы приложения**

## Назначение

Модуль содержит все TypeScript типы и интерфейсы, используемые в приложении. Это единый источник истины для структуры данных, который обеспечивает типобезопасность во всех слоях архитектуры.

## Файлы

### `rfc.ts`
Содержит основные типы для работы с RFC и связанными сущностями:

- **`RFC`** - основная сущность RFC с метаданными
- **`RFCData`** - полные данные RFC включая SDP задачи и проекты
- **`SDPTask`** - задача из SDP трекера
- **`PullRequest`** - информация о Pull Request
- **`Project`** - проект с версионированием

## Структура данных

### RFC (Request for Comments)
Основная сущность системы - документ RFC:

\`\`\`typescript
interface RFC {
  id: string              // Уникальный идентификатор
  title: string           // Название RFC
  status: 'draft' | 'ready'  // Статус документа
  createdAt: string       // Дата создания (ISO string)
  updatedAt: string       // Дата последнего обновления (ISO string)
}
\`\`\`

**Использование:**
- В списках RFC на главной странице
- Для отображения статистики
- В навигации и фильтрации

### RFCData
Полные данные RFC со всеми деталями:

\`\`\`typescript
interface RFCData extends RFC {
  sdpTasks: SDPTask[]     // Массив SDP-задач
  projects: Project[]     // Массив проектов
  regressionLink?: string  // Ссылка на регресс-тест
  generatedRFC?: string   // Сгенерированный RFC текст
}
\`\`\`

**Использование:**
- В редакторе RFC
- При генерации документов
- Для детального отображения

### SDPTask
SDP-задача с привязанными Pull Requests:

\`\`\`typescript
interface SDPTask {
  id: string              // Уникальный идентификатор
  url: string             // Ссылка на SDP-задачу
  title: string           // Название задачи
  description: string     // Описание задачи
  status: string          // Статус задачи
  assignee?: string       // Ответственный за задачу
  created: string         // Дата создания задачи (ISO string)
  updated: string         // Дата последнего обновления задачи (ISO string)
}
\`\`\`

**Особенности:**
- URL должен быть валидной ссылкой на SDP трекер
- Title и description извлекаются автоматически (пока мокаются)
- Pull Requests могут быть пустым массивом

### PullRequest
Pull Request из GitHub:

\`\`\`typescript
interface PullRequest {
  id: string              // Уникальный идентификатор
  url: string             // Ссылка на GitHub PR
  repository: string      // Репозиторий (owner/repo)
  number: string          // Номер PR
  state: 'open' | 'closed' | 'merged'  // Статус (merged, open, closed)
  author: string          // Автор PR
  title: string           // Название PR
  mergeable?: boolean      // Возможность слияния PR
}
\`\`\`

**Валидация URL:**
- Должен соответствовать паттерну GitHub PR
- Поддерживает GitHub Enterprise (custom domains)
- Автоматически парсится repository и number

### Project
Проект с версионированием:

\`\`\`typescript
interface Project {
  id: string              // Уникальный идентификатор проекта
  name: string            // Название проекта
  repository: string      // Название репозитория
  pullRequests: PullRequest[]  // Массив Pull Requests
}
\`\`\`

**Семантическое версионирование:**
- `patch` - исправления багов (1.0.0 → 1.0.1)
- `minor` - новые функции (1.0.0 → 1.1.0)
- `major` - breaking changes (1.0.0 → 2.0.0)

## Принципы типизации

### Строгость
Все поля обязательны, кроме явно помеченных как optional (`?`):

\`\`\`typescript
// ✅ Правильно
interface StrictType {
  required: string
  optional?: string
}

// ❌ Неправильно
interface LooseType {
  field: string | undefined  // Используйте optional вместо union с undefined
}
\`\`\`

### Литеральные типы
Используются для ограничения возможных значений:

\`\`\`typescript
// ✅ Хорошо - ограниченный набор значений
status: 'draft' | 'ready'
state: 'open' | 'closed' | 'merged'

// ❌ Плохо - слишком широкий тип
status: string
\`\`\`

### Консистентность
Одинаковые концепции имеют одинаковые типы:

\`\`\`typescript
// Все ID - строки
interface RFC { id: string }
interface SDPTask { id: string }
interface PullRequest { id: string }
interface Project { id: string }

// Все даты - ISO строки
interface RFC { createdAt: string, updatedAt: string }
interface RFCData { createdAt: string, updatedAt: string }
interface SDPTask { created: string, updated: string }
\`\`\`

## Расширение типов

### Добавление новых полей
При добавлении полей в существующие интерфейсы:

\`\`\`typescript
// ✅ Обратно совместимо - optional поле
interface RFC {
  id: string
  title: string
  // ... существующие поля
  newField?: string  // Новое optional поле
}

// ❌ Ломает совместимость - обязательное поле
interface RFC {
  id: string
  title: string
  newRequiredField: string  // Сломает существующий код
}
\`\`\`

### Создание новых интерфейсов
Для новых сущностей создавайте отдельные интерфейсы:

\`\`\`typescript
// Новая сущность
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

// Связь с существующими сущностями
interface RFCData {
  // ... существующие поля
  assignedTo?: User  // Optional связь
}
\`\`\`

## Утилитарные типы

### Частичные типы
Для форм и обновлений:

\`\`\`typescript
// Для создания RFC (без id и дат)
type CreateRFCInput = Omit<RFC, 'id' | 'createdAt' | 'updatedAt'>

// Для обновления RFC (все поля optional кроме id)
type UpdateRFCInput = Partial<RFC> & { id: string }
\`\`\`

### Выборочные типы
Для специфичных случаев использования:

\`\`\`typescript
// Только для отображения в списках
type RFCListItem = Pick<RFC, 'id' | 'title' | 'status' | 'createdAt' | 'updatedAt'>

// Только статистика
type RFCStats = Pick<RFC, 'status'>
\`\`\`

## Валидация

### Runtime проверки
Типы не проверяются в runtime, поэтому добавляйте валидацию:

\`\`\`typescript
// Валидация RFC статуса
const isValidRFCStatus = (status: string): status is RFC['status'] => {
  return status === 'draft' || status === 'ready'
}

// Валидация состояния PR
const isValidPRState = (state: string): state is PullRequest['state'] => {
  return state === 'open' || state === 'closed' || state === 'merged'
}
\`\`\`

### Type guards
Для безопасной работы с данными:

\`\`\`typescript
const isRFCData = (data: unknown): data is RFCData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'status' in data &&
    Array.isArray((data as any).sdpTasks)
  )
}

const isProject = (data: unknown): data is Project => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'repository' in data &&
    Array.isArray((data as any).pullRequests)
  )
}
\`\`\`

## Миграции

При изменении структуры данных:

1. **Добавьте новые поля как optional**
2. **Создайте миграционные функции**
3. **Обновите валидацию**
4. **Протестируйте на существующих данных**

\`\`\`typescript
// Миграция с версии 1 на версию 2
const migrateRFCDataV1toV2 = (oldData: RFCDataV1): RFCDataV2 => {
  return {
    ...oldData,
    newField: 'defaultValue',  // Добавляем новое поле
    version: 2
  }
}
\`\`\`

## Использование в компонентах

### Props интерфейсы
Наследуйте от базовых типов:

\`\`\`typescript
interface RFCCardProps {
  rfc: RFC
  onClick: (id: string) => void
  onEdit?: (rfc: RFC) => void
  onDelete?: (rfc: RFC) => void
}
\`\`\`

### State типы
Используйте для типизации состояния:

\`\`\`typescript
const [rfcs, setRfcs] = useState<RFC[]>([])
const [selectedRFC, setSelectedRFC] = useState<RFC | null>(null)
const [rfcData, setRfcData] = useState<RFCData | null>(null)
const [projects, setProjects] = useState<Project[]>([])
\`\`\`

## Экспорт

Все типы экспортируются из этого файла:

\`\`\`typescript
export type {
  RFC,
  RFCData,
  SDPTask,
  PullRequest,
  Project
}
\`\`\`

Импорт в других файлах:

\`\`\`typescript
import { RFC, RFCData, SDPTask, PullRequest, Project } from '@/shared/types/rfc'
\`\`\`

Эти типы обеспечивают типобезопасность во всем приложении и служат контрактом между различными слоями архитектуры.
