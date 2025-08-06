"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from 'lucide-react'
import { RFC } from "@/shared/types/rfc"
import { RFCTableRow } from "@/entities/rfc/ui/rfc-table-row"

interface RFCDashboardProps {
  rfcs: RFC[]
  onRowClick: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (rfc: RFC) => void
}

export function RFCDashboard({ rfcs, onRowClick, onEdit, onDelete }: RFCDashboardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            RFC Dashboard
          </CardTitle>
          <Badge variant="outline" className="border-blue-400/50 text-blue-400">
            {rfcs.length} активных
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-300 font-medium">Название RFC</TableHead>
                <TableHead className="text-center text-gray-300 font-medium">SDP</TableHead>
                <TableHead className="text-center text-gray-300 font-medium">PR</TableHead>
                <TableHead className="text-gray-300 font-medium">Статус</TableHead>
                <TableHead className="text-gray-300 font-medium">Обновлено</TableHead>
                <TableHead className="text-gray-300 font-medium w-24">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfcs.map((rfc) => (
                <RFCTableRow 
                  key={rfc.id} 
                  rfc={rfc} 
                  onClick={onRowClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
