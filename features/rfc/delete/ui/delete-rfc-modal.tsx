"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteRFCModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  rfcTitle: string
}

export function DeleteRFCModal({ isOpen, onClose, onConfirm, rfcTitle }: DeleteRFCModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-red-400/20 max-w-md">
        <DialogHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Удалить RFC?
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            Это действие нельзя будет отменить
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="glass-card rounded-lg p-4 border-red-400/20">
            <p className="text-gray-300 text-sm mb-2">Вы собираетесь удалить:</p>
            <p className="text-white font-medium break-words">{rfcTitle}</p>
          </div>
          
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-red-400 font-medium mb-1">Внимание!</p>
                <p className="text-red-300">
                  Все данные RFC, включая SDP-задачи, Pull Requests и настройки проектов будут безвозвратно удалены.
                </p>
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
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
