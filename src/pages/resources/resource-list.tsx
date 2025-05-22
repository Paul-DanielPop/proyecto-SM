"use client"

import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import {  MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Datos de ejemplo
const mockResources = [
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
]

export default function ResourcesList() {
  const [resources, setResources] = useState(mockResources)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const toggleStatus = (id: string) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, status: resource.status === "active" ? "inactive" : "active" } : resource,
      ),
    )
  }

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
              <TableHead>Tipo</TableHead>
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
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.capacity}</TableCell>
                  <TableCell>{resource.schedule}</TableCell>
                  <TableCell>
                    {/* <Badge variant={resource.status === "active" ? "default" : "secondary"}>
                      {resource.status === "active" ? "Activo" : "Inactivo"}
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
