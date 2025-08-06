"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, FileText } from 'lucide-react'
import { useState } from "react"

interface RFCPreviewProps {
  content: string
  onCopy: () => void
  lastGenerated?: string
}

export function RFCPreview({ content, onCopy, lastGenerated }: RFCPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-400" />
            Превью RFC
          </CardTitle>
          <div className="flex items-center space-x-3">
            {lastGenerated && (
              <Badge className="bg-green-400/20 text-green-400 border-green-400/50 text-xs">
                {formatDate(lastGenerated)}
              </Badge>
            )}
            <Button 
              onClick={handleCopy} 
              size="sm" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Скопировано
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Копировать
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="glass-card rounded-lg p-6 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 leading-relaxed">
            {content}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
