"use client"

import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Checkbox } from "@/components/shadcn/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { reservationSchema, type ReservationFormValues } from "@/lib/validations/reservations"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import type { ApiResource, Resource } from "../resources/resource-list"
import type { ApiUser, User } from "../users/users-list"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const API_URL = import.meta.env.VITE_API_URL

interface ApiError {
  message?: string
}

export default function ReservationForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [error, setError] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const [loadingCount, setLoadingCount] = useState(0)
  const isLoading = loadingCount > 0

  const startLoading = () => setLoadingCount((count) => count + 1)
  const endLoading = () => setLoadingCount((count) => Math.max(0, count - 1))

  const safeParseDate = (input: string) => {
    const date = new Date(input)
    return isNaN(date.getTime()) ? new Date() : date
  }

  function formatHour(dateString: string) {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      userId: "",
      resourceId: "",
      date: new Date(),
      time_slot: "",
      participants: [],
    },
  })

  async function fetchUsers() {
    startLoading()
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        if (response.status === 404) {
          setUsers([])
          setError(null)
          return
        }
        throw new Error(`Error al cargar usuarios: ${response.statusText}`)
      }
      const data: ApiUser[] = await response.json()
      const adaptedUsers = data.map((u) => ({
        id: u._id,
        nombre: u.nombre,
        email: u.email,
        admin: u.admin,
        banned: u.banned,
      }))
      setUsers(adaptedUsers)
      setError(null)
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Error al cargar usuarios")
    } finally {
      endLoading()
    }
  }

  async function fetchResources() {
    startLoading()
    try {
      const res = await fetch(`${API_URL}/resources`)
      if (!res.ok) throw new Error("Error cargando recursos")
      const data: ApiResource[] = await res.json()
      const adaptedResources: Resource[] = data.map((r) => ({
        id: r._id.$oid,
        name: r.name,
        description: r.description,
        capacity: typeof r.capacity === "string" ? parseInt(r.capacity, 10) : r.capacity,
        schedule: `${r.openingTime} - ${r.closingTime}`,
        status: r.active ? "active" : "inactive",
      }))
      setResources(adaptedResources)
      setError(null)
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Error desconocido")
    } finally {
      endLoading()
    }
  }

  const fetchReservation = async () => {
    if (!isEditing || !id) return
    startLoading()
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`)
      if (!res.ok) throw new Error("Error cargando la reserva")
      const data = await res.json()

      await fetchUsers()
      await fetchAvailability()

      form.reset({
        userId: data.reservedBy || "",
        resourceId: data.resource?.$oid || "",
        date: safeParseDate(data.date?.$date),
        time_slot:
          data.startTime?.$date && data.endTime?.$date
            ? `${formatHour(data.startTime.$date)}-${formatHour(data.endTime.$date)}`
            : "",
        participants: data.participantes || [],
      })

      setError(null)
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Error cargando la reserva")
    } finally {
      endLoading()
    }
  }

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`${API_URL}/reservations/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: resourceId,
          date: date.toISOString().split(".")[0] + "Z"
        }),
      })

      const data = await res.json()
      setTimeSlots(data.available_hours || [])
    } catch (error) {
      console.error("Error fetching availability", error)
    }
  }

  useEffect(() => {
    fetchResources()
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchReservation()
  }, [isEditing, id])

  const resourceId = form.watch("resourceId")
  const date = form.watch("date")

  useEffect(() => {
    if (!resourceId || !date) return

    fetchAvailability()
  }, [resourceId, date])

  const onSubmit = async (values: ReservationFormValues) => {
    startLoading()
    setError(null)
    const payload = {
      userId: values.userId,
      resourceId: values.resourceId,
      date: values.date,
      time_slot: values.time_slot,
      participantes: values.participants,
      state: "activa",
      reservedBy: values.userId,
      resource: values.resourceId,
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `${API_URL}/reservations/${id}` : `${API_URL}/reservations`

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorMsg = await res.text()
        throw new Error(errorMsg || "Error guardando la reserva")
      }

      if (isEditing) {
        toast.success("Reserva modificada correctamente")
      } else {
        toast.success("Reserva creada correctamente")
      }

      navigate("/reservations")
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Error guardando la reserva")
      toast.error(err.message || "Error al modificar el recurso")
    } finally {
      endLoading()
    }
  }

  const selectedUserId = form.watch("userId")
  const participantsOptions = users.filter((u) => u.id !== selectedUserId)

  const handleParticipantToggle = (participantId: string) => {
    const currentParticipants = form.getValues("participants") || []
    const isSelected = currentParticipants.includes(participantId)
    if (isSelected) {
      form.setValue("participants", currentParticipants.filter((id) => id !== participantId))
    } else {
      form.setValue("participants", [...currentParticipants, participantId])
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Procesando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Reserva" : "Nueva Reserva"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualice la información de la reserva"
            : "Complete el formulario para crear una nueva reserva"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un usuario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurso</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un recurso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resources.filter(r => r.status === "active").length === 0 ? (
                          <div className="px-2 py-1 text-sm text-gray-500">No hay recursos activos</div>
                        ) : (
                          resources
                            .filter((resource) => resource.status === "active")
                            .map((resource) => (
                              <SelectItem key={resource.id} value={resource.id}>
                                {resource.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Franja horaria</FormLabel>
                    {timeSlots.length > 0 ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una franja horaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-sm text-muted-foreground">No hay franjas horarias disponibles</div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Participantes adicionales</FormLabel>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {participantsOptions.map((participant) => {
                    const participants = form.watch("participants") || [];
                    const isChecked = participants.includes(participant.id);

                    return (
                      <div key={participant.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`participant-${participant.id}`}
                          checked={isChecked}
                          onCheckedChange={() => handleParticipantToggle(participant.id)}
                        />
                        <label htmlFor={`participant-${participant.id}`}>{participant.nombre}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="participants"
              render={() => {
                const participants = form.watch("participants") || [];

                if (participants.length === 0) return <></>;

                return (
                  <FormItem>
                    <FormLabel>Participantes seleccionados</FormLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {participants.map((participantId) => {
                        const participant = participantsOptions.find((p) => p.id === participantId);
                        return (
                          <div
                            key={participantId}
                            className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                          >
                            {participant?.nombre}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 h-4 w-4"
                              onClick={() => handleParticipantToggle(participantId)}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </FormItem>
                );
              }}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/reservations")}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );

}
