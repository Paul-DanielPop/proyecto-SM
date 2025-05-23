"use client"

import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { MoreHorizontal, Shield, ShieldOff, Unlock, Lock } from "lucide-react"
import { useState } from "react"


// Datos de ejemplo
const mockUsers = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    isAdmin: true,
    isBlocked: false,
    lastLogin: "2023-05-10 14:30",
  },
  {
    id: "2",
    name: "María López",
    email: "maria.lopez@example.com",
    isAdmin: false,
    isBlocked: false,
    lastLogin: "2023-05-09 10:15",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    isAdmin: false,
    isBlocked: true,
    lastLogin: "2023-05-05 08:45",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    isAdmin: false,
    isBlocked: false,
    lastLogin: "2023-05-08 16:20",
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@example.com",
    isAdmin: true,
    isBlocked: false,
    lastLogin: "2023-05-10 09:30",
  },
]

export default function UsersList() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleAdmin = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isAdmin: !user.isAdmin } : user)))
  }

  const toggleBlocked = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isBlocked: !user.isBlocked } : user)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "outline"}>
                      {user.isAdmin ? "Administrador" : "Usuario"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isBlocked ? "destructive" : "outline"}>
                      {user.isBlocked ? "Bloqueado" : "Activo"}
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
                        <DropdownMenuItem onClick={() => toggleAdmin(user.id)}>
                          {user.isAdmin ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-2" />
                              Quitar admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Hacer admin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleBlocked(user.id)}>
                          {user.isBlocked ? (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Bloquear
                            </>
                          )}
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
