"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Zap, Sparkles } from 'lucide-react'
import { useRouter } from "next/navigation"
import { RFC } from "@/shared/types/rfc"
import { storage } from "@/shared/lib/storage"
import { PageHeader } from "@/shared/ui/page-header"
import { EmptyState } from "@/shared/ui/empty-state"
import { StatsOverview } from "@/widgets/stats-overview/ui/stats-overview"
import { RFCDashboard } from "@/widgets/rfc-dashboard/ui/rfc-dashboard"
import { CreateRFCModal } from "@/features/rfc/create/ui/create-rfc-modal"
import { EditRFCModal } from "@/features/rfc/edit/ui/edit-rfc-modal"
import { DeleteRFCModal } from "@/features/rfc/delete/ui/delete-rfc-modal"

export default function Dashboard() {
  const [rfcs, setRfcs] = useState<RFC[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRFC, setSelectedRFC] = useState<RFC | null>(null)
  const router = useRouter()

  useEffect(() => {
    setRfcs(storage.getRFCs())
  }, [])

  const handleCreateRFC = (title: string) => {
    const newRFC: RFC = {
      id: Date.now().toString(),
      title,
      sdpCount: 0,
      prCount: 0,
      status: 'draft',
      updatedAt: new Date().toISOString()
    }
    
    const updatedRfcs = [...rfcs, newRFC]
    setRfcs(updatedRfcs)
    storage.saveRFCs(updatedRfcs)
    setIsCreateModalOpen(false)
    
    router.push(`/rfc/${newRFC.id}`)
  }

  const handleEditRFC = (title: string) => {
    if (!selectedRFC) return

    const updatedRfcs = rfcs.map(rfc =>
      rfc.id === selectedRFC.id
        ? { ...rfc, title, updatedAt: new Date().toISOString() }
        : rfc
    )
    
    setRfcs(updatedRfcs)
    storage.saveRFCs(updatedRfcs)
    
    // Также обновляем данные RFC если они существуют
    const rfcData = storage.getRFCData(selectedRFC.id)
    if (rfcData) {
      storage.saveRFCData({
        ...rfcData,
        title,
        updatedAt: new Date().toISOString()
      })
    }
    
    setSelectedRFC(null)
  }

  const handleDeleteRFC = () => {
    if (!selectedRFC) return

    const updatedRfcs = rfcs.filter(rfc => rfc.id !== selectedRFC.id)
    setRfcs(updatedRfcs)
    storage.saveRFCs(updatedRfcs)
    storage.deleteRFC(selectedRFC.id)
    
    setSelectedRFC(null)
  }

  const handleRowClick = (rfcId: string) => {
    router.push(`/rfc/${rfcId}`)
  }

  const handleEdit = (rfcId: string) => {
    const rfc = rfcs.find(r => r.id === rfcId)
    if (rfc) {
      setSelectedRFC(rfc)
      setIsEditModalOpen(true)
    }
  }

  const handleDelete = (rfc: RFC) => {
    setSelectedRFC(rfc)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="SDP → RFC"
        subtitle="Автоматизация RFC-задач"
        icon={<Zap className="h-6 w-6 text-white" />}
        actions={
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 neon-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать RFC
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <StatsOverview rfcs={rfcs} />

          {rfcs.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-12 w-12 text-white" />}
              title="Добро пожаловать в SDP → RFC"
              description="Создайте свой первый RFC для автоматизации процесса подготовки задач"
              action={
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 neon-glow"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Создать первый RFC
                </Button>
              }
            />
          ) : (
            <RFCDashboard 
              rfcs={rfcs} 
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {rfcs.length > 0 && (
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl neon-glow border-0"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* Modals */}
      <CreateRFCModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRFC}
      />

      <EditRFCModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedRFC(null)
        }}
        onSubmit={handleEditRFC}
        currentTitle={selectedRFC?.title || ''}
      />

      <DeleteRFCModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedRFC(null)
        }}
        onConfirm={handleDeleteRFC}
        rfcTitle={selectedRFC?.title || ''}
      />
    </div>
  )
}
