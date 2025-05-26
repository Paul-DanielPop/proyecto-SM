import * as z from "zod"

export const reservationSchema = z.object({
  userId: z.string().min(1, { message: "Debe seleccionar un usuario" }),
  resourceId: z.string().min(1, { message: "Debe seleccionar un recurso" }),
  date: z.date({ required_error: "Debe seleccionar una fecha" }),
  startTime: z.string().min(1, { message: "Debe seleccionar una hora de inicio" }),
  endTime: z.string().min(1, { message: "Debe seleccionar una hora de fin" }),
  participants: z.array(z.string()),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>
