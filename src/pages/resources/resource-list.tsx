"use client"

import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

// Datos de ejemplo
/* const mockResources = [
  {
    id: "1",
    name: "Piscina Olímpica",
    type: "Piscina",
    capacity: 50,
    schedule: "8:00 - 20:00",
    status: "active",
  },
  {
    id: "2",
    name: "Cancha de Tenis 1",
    type: "Cancha",
    capacity: 4,
    schedule: "9:00 - 21:00",
    status: "active",
  },
  {
    id: "3",
    name: "Sala de Pesas",
    type: "Gimnasio",
    capacity: 30,
    schedule: "6:00 - 22:00",
    status: "active",
  },
  {
    id: "4",
    name: "Cancha de Fútbol",
    type: "Cancha",
    capacity: 22,
    schedule: "10:00 - 20:00",
    status: "inactive",
  },
  {
    id: "5",
    name: "Sala de Yoga",
    type: "Sala",
    capacity: 15,
    schedule: "8:00 - 20:00",
    status: "active",
  },
] */

interface Resource {
  id: string
  name: string
  description: string
  capacity: number
  schedule: string
  status: "active" | "inactive"
}

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/resources`)
        if (!res.ok) throw new Error("Error cargando recursos")
        const data = await res.json()

        // Adaptar datos a la estructura Resource
        const adaptedResources: Resource[] = data.map((r: any) => ({
          id: r._id.$oid,
          name: r.name,
          description: r.description,
          capacity: parseInt(r.capacity, 10),
          schedule: `${r.openingTime} - ${r.closingTime}`,
          status: r.active ? "active" : "inactive",
        }))

        setResources(adaptedResources)
        setError(null)
      } catch (e: any) {
        setError(e.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: "DELETE",
        credentials: "include", // Incluir cookies para autenticación
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("No tienes permisos para eliminar recursos")
          navigate("/login")
          return
        }
        if (response.status === 403) {
          toast.error("No tienes permisos para eliminar recursos")
          return
        }
        if (response.status === 404) {
          toast.error("El recurso no existe")
          return
        }
        throw new Error(`Error al eliminar recurso: ${response.statusText}`)
      }

      setResources(resources.filter((resource) => resource.id !== id))
      toast.success(`Recurso eliminado correctamente`)
    } catch (error: any) {
      console.error("Error al eliminar recurso:", error)
      toast.error(error.message || "Error al eliminar el recurso")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = (id: string) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, status: resource.status === "active" ? "inactive" : "active" } : resource,
      ),
    )
  }

  if (loading) return <div>Cargando recursos...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Button onClick={() => navigate("/resources/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Recurso
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron recursos
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>{resource.capacity}</TableCell>
                  <TableCell>{resource.schedule}</TableCell>
                  <TableCell>
                    <Badge variant={resource.status === "active" ? "default" : "secondary"}>
                      {resource.status === "active" ? "Activo" : "Inactivo"}
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
                        <DropdownMenuItem onClick={() => navigate(`/resources/edit/${resource.id}`)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(resource.id)}>
                          {resource.status === "active" ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
