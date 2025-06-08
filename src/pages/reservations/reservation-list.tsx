"use client"

import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { MoreHorizontal, Pencil, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

interface Reservation {
  id: string
  reservedBy: string
  reservedByName: string
  resource: string
  resourceName: string
  date: string
  startTime: string
  endTime: string
  participantesId: string[]
  nombres_participantes: string[]
  state: "activa" | "completeda" | "cancelada"
}

interface ApiReservation {
  _id: {
    $oid: string
  }
  reservedBy: string
  reservedByName: string
  resource: {
    $oid: string
  }
  resourceName: string
  date: {
    $date: string
  }
  startTime: {
    $date: string
  }
  endTime: {
    $date: string
  }
  participantesId: string[]
  nombres_participantes: string[]
  state: "activa" | "completeda" | "cancelada"
}

export default function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<Reservation["state"]>("activa")
  const navigate = useNavigate()

  async function fetchReservations(): Promise<Reservation[]> {
    const response = await fetch(`${API_URL}/reservations`);
    if (!response.ok) throw new Error("Error al obtener las reservas");
    const data = await response.json();

    return data.map((r: ApiReservation) => ({
      id: r._id?.$oid ?? "",
      reservedBy: r.reservedBy,
      reservedByName: r.reservedByName,
      resource: r.resource?.$oid ?? "",
      resourceName: r.resourceName,
      date: new Date(r.date.$date).toLocaleDateString("es-ES"),
      startTime: new Date(new Date(r.startTime.$date).getTime() - 2 * 60 * 60 * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(new Date(r.endTime.$date).getTime() - 2 * 60 * 60 * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      participantesId: r.participantesId,
      nombres_participantes: r.nombres_participantes,
      state: r.state,
    }));
  }

  useEffect(() => {
    setLoading(true)
    fetchReservations()
      .then(setReservations)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.reservedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.resourceName.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "activa") {
      return matchesSearch && reservation.state === "activa"
    } else if (activeTab === "completeda") {
      return matchesSearch && reservation.state === "completeda"
    } else if (activeTab === "cancelada") {
      return matchesSearch && reservation.state === "cancelada"
    }

    return matchesSearch
  })

  const handleCancel = async (id: string) => {
    const reservation = reservations.find((reservation) => reservation.id === id)
    let payload = null
    if (reservation?.state === "activa") {
      payload = {state:"cancelada"}
    }
    await fetch(`${API_URL}/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setReservations(
      reservations.map((reservation) =>
        reservation.id === id ? { ...reservation, state: "cancelada" } : reservation,
      ),
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
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

      <Tabs defaultValue="activa" onValueChange={(value) => setActiveTab(value as Reservation["state"])}>
        <TabsList>
          <TabsTrigger value="activa">Activas</TabsTrigger>
          <TabsTrigger value="completeda">Completadas</TabsTrigger>
          <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
        </TabsList>
        <TabsContent value="activa" className="mt-4">
          <ReservationsTable
            reservations={filteredReservations}
            onCancel={handleCancel}
            onEdit={(id) => navigate(`/reservations/edit/${id}`)}
          />
        </TabsContent>
        <TabsContent value="completeda" className="mt-4">
          <ReservationsTable
            reservations={filteredReservations}
            onCancel={handleCancel}
            onEdit={(id) => navigate(`/reservations/edit/${id}`)}
          />
        </TabsContent>
        <TabsContent value="cancelada" className="mt-4">
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
  reservations: Reservation[]
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
                <TableCell className="font-medium">{reservation.reservedByName}</TableCell>
                <TableCell>{reservation.resourceName}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{`${reservation.startTime} - ${reservation.endTime}`}</TableCell>
                <TableCell>{`[${reservation.nombres_participantes.join(', ')}]`}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      reservation.state === "activa"
                        ? "default"
                        : reservation.state === "completeda"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {reservation.state === "activa"
                      ? "Activa"
                      : reservation.state === "completeda"
                        ? "Completada"
                        : "Cancelada"}
                  </Badge>
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
                      {reservation.state === "activa" && (
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
                      {reservation.state !== "activa" && (
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
