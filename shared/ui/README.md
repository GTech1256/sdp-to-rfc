# Shared UI Components

🎨 **Переиспользуемые UI компоненты общего назначения**

## Назначение

Модуль содержит базовые UI компоненты, которые используются во всех слоях приложения. Это строительные блоки интерфейса без привязки к бизнес-логике.

## Принципы

- 🎯 **Переиспользуемость** - компоненты должны работать в разных контекстах
- 🎨 **Консистентность** - единый дизайн во всем приложении  
- ⚙️ **Конфигурируемость** - настройка через пропсы
- ♻️ **Переиспользуемость** - можно использовать везде
- **Композиция** - предпочтение композиции над наследованием
- **Типобезопасность** - строгая типизация всех props
- **Доступность** - поддержка ARIA атрибутов и клавиатурной навигации

## Компоненты

### StatCard (`stat-card.tsx`)
Компонент для отображения статистических данных.

#### Props
\`\`\`typescript
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}
\`\`\`

#### Использование
\`\`\`typescript
<StatCard
  title="Всего RFC"
  value={totalRFCs}
  description="Созданных документов"
  icon={<FileText className="h-4 w-4" />}
/>
\`\`\`

#### Особенности
- **Стеклянная карточка** с размытием фона
- **Градиентные иконки** в круглых контейнерах
- **Адаптивная типографика** для разных размеров экранов
- **Hover эффекты** для интерактивности

#### Доступные градиенты
\`\`\`css
.defi-gradient     /* Синий → Голубой */
.crypto-gradient   /* Фиолетовый → Синий */
.nft-gradient      /* Розовый → Красный */
\`\`\`

### EmptyState (`empty-state.tsx`)
Компонент для отображения пустого состояния списков.

#### Props
\`\`\`typescript
interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}
\`\`\`

#### Использование
\`\`\`typescript
<EmptyState
  title="Нет RFC"
  description="Создайте первый RFC документ"
  action={{
    label: "Создать RFC",
    onClick: handleCreate
  }}
  icon={<FileText className="h-12 w-12" />}
/>
\`\`\`

#### Особенности
- **Центрированная компоновка** с вертикальным выравниванием
- **Градиентная иконка** в квадратном контейнере
- **Типографическая иерархия** (заголовок → описание → действие)
- **Опциональное действие** для интерактивности

#### Варианты использования
- Пустые списки данных
- Отсутствие результатов поиска
- Начальные состояния приложения
- Ошибки загрузки данных

### PageHeader (`page-header.tsx`)
Заголовок страницы с действиями.

#### Props
\`\`\`typescript
interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}
\`\`\`

#### Использование
\`\`\`typescript
<PageHeader
  title="RFC Dashboard"
  description="Управление документами RFC"
>
  <Button onClick={handleCreate}>
    Создать RFC
  </Button>
</PageHeader>
\`\`\`

#### Особенности
- **Sticky позиционирование** - остается наверху при скролле
- **Стеклянный эффект** с размытием фона
- **Градиентная иконка** с анимированным индикатором
- **Адаптивная компоновка** для мобильных устройств

#### Структура
\`\`\`tsx
<header className="glass-card sticky top-0 z-50">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-4">
      {/* Иконка с градиентом и пульсацией */}
      <div className="relative">
        <div className="crypto-gradient rounded-xl">
          {icon}
        </div>
        <div className="animate-pulse bg-green-400 rounded-full" />
      </div>
      
      {/* Заголовок с градиентным текстом */}
      <div>
        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>
    </div>
    
    {/* Действия справа */}
    {children}
  </div>
</header>
\`\`\`

## Стилизация

Все компоненты используют:
- Tailwind CSS для стилей
- shadcn/ui компоненты как основу
- Темную тему в стиле DeFiLlama
- Градиентные эффекты и анимации

### Дизайн-система
Все компоненты используют единую дизайн-систему:

#### Цвета
\`\`\`css
/* Основные цвета */
--primary: #3b82f6    /* Синий */
--secondary: #8b5cf6  /* Фиолетовый */
--accent: #06b6d4     /* Голубой */

/* Статусные цвета */
--success: #10b981    /* Зеленый */
--warning: #f59e0b    /* Желтый */
--error: #ef4444      /* Красный */
\`\`\`

#### Градиенты
\`\`\`css
.defi-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.crypto-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nft-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
\`\`\`

#### Эффекты
\`\`\`css
.glass-card {
  backdrop-blur: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.gradient-border::before {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
}
\`\`\`

### Адаптивность
Все компоненты адаптивны:

\`\`\`tsx
// Адаптивные сетки
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Адаптивная типографика
<h1 className="text-2xl lg:text-4xl font-bold">

// Адаптивные отступы
<div className="px-4 lg:px-8 py-6 lg:py-12">
\`\`\`

### Темная тема
Все компоненты оптимизированы для темной темы:

\`\`\`css
/* Темный фон */
body {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

/* Светлый текст */
.text-primary { color: #ffffff; }
.text-secondary { color: #d1d5db; }
.text-muted { color: #9ca3af; }
\`\`\`

## Доступность

### ARIA атрибуты
\`\`\`tsx
// Семантические роли
<div role="banner">        {/* PageHeader */}
<div role="status">        {/* StatCard */}
<div role="img">           {/* EmptyState icon */}

// Описания для screen readers
<div aria-label="Статистика RFC">
<div aria-describedby="empty-description">
\`\`\`

### Клавиатурная навигация
\`\`\`tsx
// Фокусируемые элементы
<button tabIndex={0}>
<a href="#" tabIndex={0}>

// Пропуск декоративных элементов
<div aria-hidden="true">  {/* Декоративные иконки */}
\`\`\`

### Контрастность
Все цвета соответствуют WCAG 2.1 AA:
- Текст на фоне: минимум 4.5:1
- Крупный текст: минимум 3:1
- Интерактивные элементы: минимум 3:1

## Тестирование

### Component тесты
\`\`\`typescript
describe('StatCard', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Test Title"
        value={42}
        icon={<div>Icon</div>}
      />
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('applies custom gradient', () => {
    render(
      <StatCard
        title="Test"
        value={1}
        icon={<div>Icon</div>}
        gradient="custom-gradient"
      />
    )
    
    expect(screen.getByRole('img')).toHaveClass('custom-gradient')
  })
})
\`\`\`

### Accessibility тесты
\`\`\`typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should not have accessibility violations', async () => {
  const { container } = render(<StatCard {...props} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
\`\`\`

### Visual regression тесты
\`\`\`typescript
it('matches visual snapshot', () => {
  const { container } = render(<StatCard {...props} />)
  expect(container.firstChild).toMatchSnapshot()
})
\`\`\`

## Расширение

### Добавление нового компонента

1. **Создайте файл компонента:**
\`\`\`tsx
// new-component.tsx
interface NewComponentProps {
  // Определите пропсы
}

export function NewComponent({ ...props }: NewComponentProps) {
  return (
    <div className="glass-card">
      {/* Реализация */}
    </div>
  )
}
\`\`\`

2. **Добавьте в barrel export:**
\`\`\`tsx
// index.ts
export { StatCard } from './stat-card'
export { EmptyState } from './empty-state'
export { PageHeader } from './page-header'
export { NewComponent } from './new-component'  // Новый компонент
\`\`\`

3. **Напишите тесты:**
\`\`\`tsx
// new-component.test.tsx
describe('NewComponent', () => {
  it('renders correctly', () => {
    // Тесты
  })
})
\`\`\`

4. **Обновите документацию:**
- Добавьте описание в этот README
- Приведите примеры использования
- Документируйте API

### Модификация существующих компонентов

При изменении компонентов:
- Сохраняйте обратную совместимость API
- Добавляйте новые пропсы как optional
- Обновляйте тесты и документацию
- Проверяйте использование во всем проекте

## Производительность

### Мемоизация
Для тяжелых компонентов:

\`\`\`tsx
import { memo } from 'react'

export const StatCard = memo(({ title, value, icon, gradient, valueColor, trend }: StatCardProps) => {
  // Компонент будет перерендериваться только при изменении пропсов
})
\`\`\`

### Ленивая загрузка
Для больших компонентов:

\`\`\`tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./heavy-component'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
\`\`\`

### Оптимизация изображений
Используйте Next.js Image:

\`\`\`tsx
import Image from 'next/image'

<Image
  src="/icon.png"
  alt="Description"
  width={64}
  height={64}
  priority={false}
/>
