"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Switch } from "@/components/shadcn/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resourceSchema, type ResourceFormValues } from "@/lib/validations/resource"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/shadcn/form"

const API_URL = import.meta.env.VITE_API_URL

export default function ResourceForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    if (isEditing && id) {
      setLoading(true)
      fetch(`${API_URL}/resources/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Error al cargar recurso: ${res.statusText}`)
          }
          const data = await res.json()
          // Transformamos datos recibidos a la forma que espera el formulario
          form.reset({
            name: data.name,
            capacity: Number(data.capacity?.["$numberInt"] ?? data.capacity ?? 0),
            description: data.description ?? "",
            openTime: data.openingTime ?? "",
            closeTime: data.closingTime ?? "",
            isActive: data.active ?? true,
          })

        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => setLoading(false))
    }
  }, [isEditing, id, form])

  const onSubmit = async (values: ResourceFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(isEditing && id ? `${API_URL}/resources/${id}` : `${API_URL}/resources`, {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          capacity: values.capacity,
          description: values.description,
          openingTime: values.openTime,
          closingTime: values.closeTime,
          active: values.isActive
          /* images: [], // Si quieres enviar imágenes, añade aquí la lógica */
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? "actualizar" : "crear"} recurso: ${response.statusText}`)
      }

      if (isEditing) {
        toast.success("Recurso modificado correctamente")
      } else {
        toast.success("Recurso creado correctamente")
      }

      navigate("/resources")
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      toast.error("Algo ha salido mal")
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando recurso...</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
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
