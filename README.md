# SDP → RFC Service

🚀 **Автоматизация создания RFC-документов из SDP-задач и Pull Requests**

## 📋 Описание

SDP → RFC Service - это веб-приложение для автоматизации процесса создания RFC (Request for Comments) документов на основе SDP-задач и связанных Pull Requests. Приложение помогает командам разработки экономить время и избегать ошибок при подготовке документации для релизов.

## ✨ Основные возможности

- 🔗 **Интеграция с SDP** - автоматическое извлечение данных из SDP-задач
- 🐙 **Поддержка GitHub** - связывание Pull Requests с задачами
- 📄 **Генерация RFC** - создание готовых документов одним кликом
- 📊 **Управление версиями** - отслеживание изменений в проектах
- 💾 **Локальное хранение** - данные сохраняются в браузере
- 🎨 **Современный UI** - темная тема в стиле DeFi/Crypto

## 🏗️ Архитектура

Проект построен на основе **Feature-Sliced Design (FSD)** - современной методологии архитектуры фронтенд-приложений.

\`\`\`
src/
├── app/                    # Конфигурация приложения и страницы
├── pages/                  # Страницы приложения (в app/ для Next.js)
├── widgets/                # Композитные блоки интерфейса
├── features/               # Бизнес-функции приложения
├── entities/               # Бизнес-сущности
└── shared/                 # Переиспользуемые ресурсы
\`\`\`

## 🚀 Быстрый старт

### Установка

\`\`\`bash
# Клонирование репозитория
git clone <repository-url>
cd sdp-rfc-service

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
\`\`\`

### Использование

1. **Создайте новый RFC** на главной странице
2. **Добавьте SDP-задачи** по ссылкам из трекера
3. **Привяжите Pull Requests** из GitHub
4. **Настройте версионирование** проектов
5. **Сгенерируйте RFC** одним кликом

## 🛠️ Технологический стек

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + localStorage
- **Architecture**: Feature-Sliced Design (FSD)
- **Icons**: Lucide React

## 📁 Структура проекта

### Слои архитектуры

- **`app/`** - Конфигурация Next.js, глобальные стили, layout
- **`shared/`** - Общие компоненты, утилиты, типы
- **`entities/`** - Бизнес-сущности (RFC, SDP, Project)
- **`features/`** - Функциональные возможности (создание, редактирование, удаление)
- **`widgets/`** - Композитные блоки (дашборд, статистика)

### Ключевые файлы

- `app/page.tsx` - Главная страница с дашбордом
- `app/rfc/[id]/page.tsx` - Редактор RFC
- `app/landing/page.tsx` - Лендинг-страница
- `shared/types/rfc.ts` - Типы данных
- `shared/lib/storage.ts` - Работа с localStorage

## 🎨 UI/UX

### Дизайн-система

- **Цветовая схема**: Темная тема с градиентами
- **Компоненты**: shadcn/ui с кастомизацией
- **Эффекты**: Стеклянные карточки, неоновые свечения
- **Анимации**: Плавные переходы и hover-эффекты

### Адаптивность

- Mobile-first подход
- Поддержка всех размеров экранов
- Оптимизированная навигация для мобильных устройств

## 📊 Управление данными

### Хранение

- **localStorage** для персистентности данных
- **Автосохранение** каждые 5 секунд
- **Синхронизация** между компонентами через React Context

### Структура данных

\`\`\`typescript
interface RFC {
  id: string
  title: string
  sdpCount: number
  prCount: number
  status: 'draft' | 'ready'
  updatedAt: string
}

interface RFCData {
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
\`\`\`

## 🔧 Разработка

### Команды

\`\`\`bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшн версии
npm start

# Линтинг
npm run lint

# Проверка типов
npm run type-check
\`\`\`

### Соглашения

- **Именование файлов**: kebab-case
- **Компоненты**: PascalCase
- **Хуки**: camelCase с префиксом `use`
- **Типы**: PascalCase с суффиксом по контексту

## 🧪 Тестирование

\`\`\`bash
# Запуск тестов
npm run test

# Тесты с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e
\`\`\`

## 📈 Производительность

- **Code Splitting** на уровне страниц
- **Lazy Loading** для тяжелых компонентов
- **Оптимизация изображений** через Next.js Image
- **Минификация** CSS и JS в продакшене

## 🔒 Безопасность

- **Валидация данных** на клиенте
- **Санитизация** пользовательского ввода
- **CSP заголовки** для защиты от XSS
- **Безопасное хранение** в localStorage

## 🚀 Деплой

### Vercel (рекомендуется)

\`\`\`bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel
\`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- 📧 Email: support@sdp-rfc.dev
- 💬 Telegram: @sdp-rfc-support
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/sdp-rfc-service/issues)

## 🗺️ Roadmap

- [ ] Интеграция с GitHub API
- [ ] Поддержка GitLab
- [ ] Экспорт в различные форматы
- [ ] Система шаблонов
- [ ] Уведомления и алерты
- [ ] Командная работа
- [ ] Аналитика и метрики

---

**Сделано с ❤️ для команд разработки**
