import * as z from "zod"

export const resourceSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string(),
  capacity: z.coerce.number().min(1, { message: "La capacidad debe ser al menos 1" }),
  openTime: z.string().min(1, { message: "Debe seleccionar una hora de apertura" }),
  closeTime: z.string().min(1, { message: "Debe seleccionar una hora de cierre" }),
  isActive: z.boolean(),
})

export type ResourceFormValues = z.infer<typeof resourceSchema>
