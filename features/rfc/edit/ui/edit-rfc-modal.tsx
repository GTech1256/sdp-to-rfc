"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save, X } from 'lucide-react'

interface EditRFCModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string) => void
  currentTitle: string
}

export function EditRFCModal({ isOpen, onClose, onSubmit, currentTitle }: EditRFCModalProps) {
  const [title, setTitle] = useState(currentTitle)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle)
      setError("")
    }
  }, [isOpen, currentTitle])

  const validateTitle = (value: string) => {
    if (value.length < 5) {
      return "Название должно содержать минимум 5 символов"
    }
    if (value.length > 100) {
      return "Название не должно превышать 100 символов"
    }
    return ""
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setError(validateTitle(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateTitle(title)
    if (validationError) {
      setError(validationError)
      return
    }
    onSubmit(title)
    onClose()
  }

  const isValid = title.length >= 5 && title.length <= 100 && title !== currentTitle

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Редактировать RFC
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            Измените название вашего RFC
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-gray-300 font-medium">
              Название RFC *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Введите название RFC..."
              autoFocus
              className={`glass-card border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50 ${
                error ? "border-red-400 focus:border-red-400 focus:ring-red-400/50" : ""
              }`}
            />
            {error && (
              <p className="text-sm text-red-400 flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                <span>{error}</span>
              </p>
            )}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {title.length}/100 символов
              </p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full transition-colors ${
                      title.length >= (i + 1) * 20 ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
