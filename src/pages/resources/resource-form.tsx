"use client"

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Switch } from "@/components/shadcn/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resourceSchema, type ResourceFormValues } from "@/lib/validations/resource"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/shadcn/form"

// Tipos de recursos disponibles
/* const resourceTypes = [
  { value: "piscina", label: "Piscina" },
  { value: "cancha", label: "Cancha" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "sala", label: "Sala" },
  { value: "otro", label: "Otro" },
] */

// Datos de ejemplo para edición
const mockResource = {
  id: "1",
  name: "Piscina Olímpica",
  type: "piscina",
  capacity: 50,
  description: "Piscina olímpica de 50 metros con 8 carriles",
  openTime: "08:00",
  closeTime: "20:00",
  images: [],
  isActive: true,
}

export default function ResourceForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  /* const { toast } = useToast() */

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      description: "",
      openTime: "",
      closeTime: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (isEditing) {
      // En un caso real, aquí se haría una petición al backend
      // Este es solo un ejemplo para demostración
      form.reset({
        name: mockResource.name,
        capacity: mockResource.capacity,
        description: mockResource.description,
        openTime: mockResource.openTime,
        closeTime: mockResource.closeTime,
        isActive: mockResource.isActive,
      })
    }
  }, [isEditing, form])

  const onSubmit = (values: ResourceFormValues) => {
    // En un caso real, aquí se haría la petición al backend
    // Este es solo un ejemplo para demostración
    console.log(values)

    /* toast({
      title: isEditing ? "Recurso actualizado" : "Recurso creado",
      description: isEditing
        ? "El recurso ha sido actualizado correctamente"
        : "El recurso ha sido creado correctamente",
    }) */

    navigate("/resources")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Recurso" : "Nuevo Recurso"}</CardTitle>
        <CardDescription>
          {isEditing ? "Actualice la información del recurso" : "Complete el formulario para crear un nuevo recurso"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Estado</FormLabel>
                      <FormDescription>
                        {field.value ? "El recurso está activo" : "El recurso está inactivo"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="openTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de apertura</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closeTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de cierre</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Imágenes</FormLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <Button type="button" variant="outline">
                    Subir imagen
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/resources")}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
