"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Dumbbell, Calendar, Users, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BarChart, LineChart } from "@/components/app/charts"

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2% respecto a ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos Activos</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recursos Más Utilizados</CardTitle>
            <CardDescription>Los 5 recursos más reservados este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Horas Pico</CardTitle>
            <CardDescription>Distribución de reservas por hora del día</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Recursos</CardTitle>
            <CardDescription>Administra los recursos disponibles</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold">24 recursos</div>
            <Button variant="outline" onClick={() => navigate("/resources")}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Reservas</CardTitle>
            <CardDescription>Administra las reservas activas</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold">45 reservas</div>
            <Button variant="outline" onClick={() => navigate("/reservations")}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>Administra los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold">120 usuarios</div>
            <Button variant="outline" onClick={() => navigate("/users")}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
