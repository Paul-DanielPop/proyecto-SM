import * as z from "zod"

export const reservationSchema = z.object({
  userId: z.string().min(1, { message: "Debe seleccionar un usuario" }),
  resourceId: z.string().min(1, { message: "Debe seleccionar un recurso" }),
  date: z.date({ required_error: "Debe seleccionar una fecha" }),
  time_slot: z.string().min(1, { message: "Debe seleccionar una franja horaria" }),
  participants: z.array(z.string()),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>
