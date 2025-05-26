"use client"

import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Checkbox } from "@/components/shadcn/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { cn } from "@/lib/utils"
import { reservationSchema, type ReservationFormValues } from "@/lib/validations/reservations"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

// Datos de ejemplo
const mockUsers = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María López" },
  { id: "3", name: "Carlos Rodríguez" },
  { id: "4", name: "Ana Martínez" },
  { id: "5", name: "Pedro Sánchez" },
]

const mockResources = [
  { id: "1", name: "Piscina Olímpica" },
  { id: "2", name: "Cancha de Tenis 1" },
  { id: "3", name: "Sala de Pesas" },
  { id: "4", name: "Cancha de Fútbol" },
  { id: "5", name: "Sala de Yoga" },
]

const mockParticipants = [
  { id: "1", name: "Luis García" },
  { id: "2", name: "Elena Torres" },
  { id: "3", name: "Roberto Díaz" },
  { id: "4", name: "Carmen Ruiz" },
  { id: "5", name: "Javier Moreno" },
]

// Datos de ejemplo para edición
const mockReservation = {
  id: "1",
  userId: "1",
  resourceId: "1",
  date: new Date("2023-05-10"),
  startTime: "10:00",
  endTime: "12:00",
  participants: ["2", "3"],
}

export default function ReservationForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      userId: "",
      resourceId: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      participants: [],
    },
  })

  useEffect(() => {
    if (isEditing) {
      // En un caso real, aquí se haría una petición al backend
      // Este es solo un ejemplo para demostración
      form.reset({
        userId: mockReservation.userId,
        resourceId: mockReservation.resourceId,
        date: mockReservation.date,
        startTime: mockReservation.startTime,
        endTime: mockReservation.endTime,
        participants: mockReservation.participants,
      })
    }
  }, [isEditing, form])

  const onSubmit = (values: ReservationFormValues) => {
    // En un caso real, aquí se haría la petición al backend
    // Este es solo un ejemplo para demostración
    console.log(values)

    navigate("/reservations")
  }

  const handleParticipantToggle = (participantId: string) => {
    const currentParticipants = form.getValues("participants") || []
    const isSelected = currentParticipants.includes(participantId)

    if (isSelected) {
      form.setValue(
        "participants",
        currentParticipants.filter((id) => id !== participantId),
      )
    } else {
      form.setValue("participants", [...currentParticipants, participantId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Reserva" : "Nueva Reserva"}</CardTitle>
        <CardDescription>
          {isEditing ? "Actualice la información de la reserva" : "Complete el formulario para crear una nueva reserva"}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un usuario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un recurso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockResources.map((resource) => (
                          <SelectItem key={resource.id} value={resource.id}>
                            {resource.name}
                          </SelectItem>
                        ))}
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
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Participantes adicionales</FormLabel>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {mockParticipants.map((participant) => {
                    const participants = form.watch("participants") || []
                    const isChecked = participants.includes(participant.id)

                    return (
                      <div key={participant.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`participant-${participant.id}`}
                          checked={isChecked}
                          onCheckedChange={() => handleParticipantToggle(participant.id)}
                        />
                        <label htmlFor={`participant-${participant.id}`}>{participant.name}</label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="participants"
              render={() => {
                const participants = form.watch("participants") || []

                if (participants.length === 0) return <></>

                return (
                  <FormItem>
                    <FormLabel>Participantes seleccionados</FormLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {participants.map((participantId) => {
                        const participant = mockParticipants.find((p) => p.id === participantId)
                        return (
                          <div
                            key={participantId}
                            className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                          >
                            {participant?.name}
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
                        )
                      })}
                    </div>
                  </FormItem>
                )
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
  )
}
