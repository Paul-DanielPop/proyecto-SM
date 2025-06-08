"use client"

import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu"
import { Input } from "@/components/shadcn/input"
import { Switch } from "@/components/shadcn/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table"
import { MoreHorizontal, UserCheck, UserX, Shield, ShieldOff } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export interface ApiUser {
  _id: string
  nombre: string
  email: string
  admin: boolean
  banned: boolean
}
export interface User {
  id: string
  nombre: string
  email: string
  admin: boolean
  banned: boolean
}

interface UserUpdatePayload {
  admin?: boolean
  banned?: boolean
}

interface ApiError extends Error {
  status?: number
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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

      // Adaptar datos de la API al formato del componente
      const adaptedUsers: User[] = data.map((apiUser) => ({
        id: apiUser._id,
        nombre: apiUser.nombre,
        email: apiUser.email,
        admin: apiUser.admin,
        banned: apiUser.banned,
      }))

      setUsers(adaptedUsers)
      setError(null)
    } catch (e) {
      const error = e as ApiError
      console.error('Error fetching users:', error)
      setError(error.message || 'Error al cargar usuarios')
      toast.error(error.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, updates: UserUpdatePayload) => {
    setUpdatingUser(userId)
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.log('Error response body:', errorData)

        if (response.status === 401) {
          toast.error("No tienes permisos para modificar usuarios")
          return
        }
        if (response.status === 403) {
          toast.error("No tienes permisos para modificar usuarios")
          return
        }
        if (response.status === 404) {
          toast.error("Usuario no encontrado")
          return
        }
        if (response.status === 400) {
          let errorMessage = "Error de validación"
          try {
            const errorJson = JSON.parse(errorData)
            if (errorJson.errors) {
              errorMessage = `Errores de validación: ${JSON.stringify(errorJson.errors)}`
            } else if (errorJson.error) {
              errorMessage = errorJson.error
            }
          } catch {
            errorMessage = errorData
          }
          toast.error(errorMessage)
          return
        }
        throw new Error(`Error al actualizar usuario: ${response.statusText}`)
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, ...updates }
            : user
        )
      )

      const updateType = updates.admin !== undefined ? 'Permisos de administrador' : 'Estado de bloqueo'
      toast.success(`${updateType} actualizado correctamente`)

    } catch (e) {
      const error = e as ApiError
      console.error('Error updating user:', error)
      toast.error(error.message || 'Error al actualizar usuario')

      // Revertir el cambio en caso de error
      await fetchUsers()
    } finally {
      setUpdatingUser(null)
    }
  }

  const toggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    await updateUser(userId, { admin: !currentAdminStatus })
  }

  const toggleBanned = async (userId: string, currentBannedStatus: boolean) => {
    await updateUser(userId, { banned: !currentBannedStatus })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={fetchUsers} variant="outline">
          Reintentar
        </Button>
      </div>
    )
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
        <Button onClick={fetchUsers} variant="outline">
          Actualizar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.admin}
                        onCheckedChange={() => toggleAdmin(user.id, user.admin)}
                        disabled={updatingUser === user.id}
                      />
                      <Badge variant={user.admin ? "default" : "secondary"}>
                        {user.admin ? "Admin" : "Usuario"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!user.banned}
                        onCheckedChange={() => toggleBanned(user.id, user.banned)}
                        disabled={updatingUser === user.id}
                      />
                      <Badge variant={user.banned ? "destructive" : "default"}>
                        {user.banned ? "Bloqueado" : "Activo"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updatingUser === user.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleAdmin(user.id, user.admin)}>
                          {user.admin ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-2" />
                              Quitar Admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Hacer Admin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleBanned(user.id, user.banned)}>
                          {user.banned ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
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