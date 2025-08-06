import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <header className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            {icon && (
              <div className="relative">
                <div className="w-12 h-12 rounded-xl crypto-gradient flex items-center justify-center">
                  {icon}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </div>
      </div>
    </header>
  )
}
