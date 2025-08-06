"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight, Code, GitBranch, FileText, Clock, CheckCircle, Users, TrendingUp, Sparkles, Play, Star, Github, ExternalLink, ChevronDown, Activity, Shield, Rocket, Target, BarChart3 } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Автоматический парсинг SDP",
      description: "Извлекаем данные из SDP-задач автоматически",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "Интеграция с GitHub",
      description: "Связываем Pull Requests с задачами",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Генерация RFC",
      description: "Создаем готовые RFC-документы одним кликом",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Аналитика проектов",
      description: "Отслеживаем версии и изменения",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { value: "10x", label: "Быстрее создание RFC", icon: <Clock className="h-5 w-5" /> },
    { value: "100%", label: "Автоматизация процесса", icon: <Zap className="h-5 w-5" /> },
    { value: "0", label: "Ошибок в документации", icon: <Shield className="h-5 w-5" /> },
    { value: "∞", label: "Возможностей интеграции", icon: <Rocket className="h-5 w-5" /> }
  ]

  const testimonials = [
    {
      name: "Алексей Петров",
      role: "Senior Developer",
      avatar: "/developer-working.png",
      text: "SDP → RFC сэкономил нам часы работы. Теперь создание RFC занимает минуты, а не дни!"
    },
    {
      name: "Мария Иванова", 
      role: "Tech Lead",
      avatar: "/tech-lead.png",
      text: "Отличный инструмент для автоматизации рутинных задач. Команда довольна результатом."
    },
    {
      name: "Дмитрий Сидоров",
      role: "DevOps Engineer", 
      avatar: "/devops-lifecycle.png",
      text: "Интеграция с GitHub работает безупречно. Рекомендую всем командам разработки."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl crypto-gradient flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SDP → RFC
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Возможности
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                Как работает
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Отзывы
              </a>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                Начать работу
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 text-blue-400">
              <Sparkles className="h-4 w-4 mr-2" />
              Автоматизация RFC-процессов
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Превращаем SDP-задачи
              </span>
              <br />
              <span className="text-white">в готовые RFC</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Автоматизируйте создание RFC-документов из SDP-задач и Pull Requests. 
              Экономьте время, избегайте ошибок, ускоряйте процессы разработки.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 neon-glow px-8 py-4 text-lg"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Начать бесплатно
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Посмотреть демо
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card gradient-border">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-10 h-10 rounded-lg defi-gradient flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-400">
              <Target className="h-4 w-4 mr-2" />
              Ключевые возможности
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Всё что нужно для <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">автоматизации</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Мощные инструменты для превращения рутинных задач в автоматизированные процессы
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`glass-card cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'gradient-border neon-glow' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Card className="glass-card gradient-border">
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeFeature].gradient} flex items-center justify-center mx-auto mb-4`}>
                        {features[activeFeature].icon}
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {features[activeFeature].title}
                      </h4>
                      <p className="text-gray-300">
                        {features[activeFeature].description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-400">
              <Activity className="h-4 w-4 mr-2" />
              Простой процесс
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Как это <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">работает</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Всего 3 простых шага до готового RFC-документа
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Добавьте SDP-задачи",
                description: "Вставьте ссылки на ваши SDP-задачи, система автоматически извлечет всю необходимую информацию",
                icon: <Code className="h-8 w-8" />,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "Привяжите Pull Requests",
                description: "Добавьте ссылки на связанные PR из GitHub, настройте версионирование проектов",
                icon: <GitBranch className="h-8 w-8" />,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Получите готовый RFC",
                description: "Система сгенерирует полноценный RFC-документ со всеми деталями и планами внедрения",
                icon: <FileText className="h-8 w-8" />,
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <Card key={index} className="glass-card gradient-border relative">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mx-auto mb-6 mt-4`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 text-yellow-400">
              <Star className="h-4 w-4 mr-2" />
              Отзывы пользователей
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Что говорят <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">разработчики</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card gradient-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar || "/placeholder.svg"} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="glass-card gradient-border">
            <div className="p-12">
              <div className="w-20 h-20 rounded-2xl crypto-gradient flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Готовы автоматизировать ваши RFC?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к командам, которые уже экономят время с SDP → RFC
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 neon-glow px-8 py-4 text-lg"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Начать сейчас
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl crypto-gradient flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SDP → RFC
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Автоматизируем создание RFC-документов для ускорения процессов разработки
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Как работает</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Отзывы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Статус</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SDP → RFC. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
