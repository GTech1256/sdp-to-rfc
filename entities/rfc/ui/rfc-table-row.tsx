import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ExternalLink } from 'lucide-react'
import { RFC } from "@/shared/types/rfc"
import { formatDate } from "@/shared/lib/utils"
import { RFCStatusBadge } from "./rfc-status-badge"

interface RFCTableRowProps {
  rfc: RFC
  onClick: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (rfc: RFC) => void
}

export function RFCTableRow({ rfc, onClick, onEdit, onDelete }: RFCTableRowProps) {
  const handleRowClick = () => {
    onClick(rfc.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(rfc.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(rfc)
  }

  return (
    <TableRow className="border-white/10 hover:bg-white/5 transition-all duration-200 group">
      <TableCell 
        className="font-medium text-white py-4 cursor-pointer"
        onClick={handleRowClick}
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <span className="group-hover:text-blue-400 transition-colors">{rfc.title}</span>
          <ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </TableCell>
      <TableCell className="text-center" onClick={handleRowClick}>
        <Badge className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10">
          {rfc.sdpCount}
        </Badge>
      </TableCell>
      <TableCell className="text-center" onClick={handleRowClick}>
        <Badge className="border-purple-400/50 text-purple-400 bg-purple-400/10">
          {rfc.prCount}
        </Badge>
      </TableCell>
      <TableCell onClick={handleRowClick}>
        <RFCStatusBadge status={rfc.status} />
      </TableCell>
      <TableCell className="text-gray-400" onClick={handleRowClick}>
        {formatDate(rfc.updatedAt)}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-8 w-8 p-0"
            title="Редактировать RFC"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"
            title="Удалить RFC"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
