"use client"

import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
<<<<<<< HEAD
import {  MoreHorizontal, Pencil, Plus, X } from "lucide-react"
=======
import { MoreHorizontal, Pencil, Plus, X } from "lucide-react"
>>>>>>> main
import { useState } from "react"
import { useNavigate } from "react-router-dom"


// Datos de ejemplo
const mockReservations = [
  {
    id: "1",
    user: "Juan Pérez",
    resource: "Piscina Olímpica",
    date: "2023-05-10",
    startTime: "10:00",
    endTime: "12:00",
    participants: 3,
    status: "active",
  },
  {
    id: "2",
    user: "María López",
    resource: "Cancha de Tenis 1",
    date: "2023-05-11",
    startTime: "14:00",
    endTime: "16:00",
    participants: 2,
    status: "active",
  },
  {
    id: "3",
    user: "Carlos Rodríguez",
    resource: "Sala de Pesas",
    date: "2023-05-09",
    startTime: "08:00",
    endTime: "09:00",
    participants: 1,
    status: "completed",
  },
  {
    id: "4",
    user: "Ana Martínez",
    resource: "Cancha de Fútbol",
    date: "2023-05-08",
    startTime: "16:00",
    endTime: "18:00",
    participants: 22,
    status: "cancelled",
  },
  {
    id: "5",
    user: "Pedro Sánchez",
    resource: "Sala de Yoga",
    date: "2023-05-12",
    startTime: "09:00",
    endTime: "10:00",
    participants: 8,
    status: "active",
  },
]

export default function ReservationsList() {
  const [reservations, setReservations] = useState(mockReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const navigate = useNavigate()

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.resource.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "active") {
      return matchesSearch && reservation.status === "active"
    } else if (activeTab === "completed") {
      return matchesSearch && reservation.status === "completed"
    } else if (activeTab === "cancelled") {
      return matchesSearch && reservation.status === "cancelled"
    }

    return matchesSearch
  })

  const handleCancel = (id: string) => {
    setReservations(
      reservations.map((reservation) =>
        reservation.id === id ? { ...reservation, status: "cancelled" } : reservation,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Button onClick={() => navigate("/reservations/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ReservationsTable
            reservations={filteredReservations}
            onCancel={handleCancel}
            onEdit={(id) => navigate(`/reservations/edit/${id}`)}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <ReservationsTable
            reservations={filteredReservations}
            onCancel={handleCancel}
            onEdit={(id) => navigate(`/reservations/edit/${id}`)}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <ReservationsTable
            reservations={filteredReservations}
            onCancel={handleCancel}
            onEdit={(id) => navigate(`/reservations/edit/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReservationsTableProps {
  reservations: typeof mockReservations
  onCancel: (id: string) => void
  onEdit: (id: string) => void
}

function ReservationsTable({ reservations, onCancel, onEdit }: ReservationsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No se encontraron reservas
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.user}</TableCell>
                <TableCell>{reservation.resource}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{`${reservation.startTime} - ${reservation.endTime}`}</TableCell>
                <TableCell>{reservation.participants}</TableCell>
                <TableCell>
                  {/* <Badge
                    variant={
                      reservation.status === "active"
                        ? "default"
                        : reservation.status === "completed"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {reservation.status === "active"
                      ? "Activa"
                      : reservation.status === "completed"
                        ? "Completada"
                        : "Cancelada"}
                  </Badge> */}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {reservation.status === "active" && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit(reservation.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onCancel(reservation.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </>
                      )}
                      {reservation.status !== "active" && (
                        <DropdownMenuItem onClick={() => onEdit(reservation.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
