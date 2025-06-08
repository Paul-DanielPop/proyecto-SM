"use client"

import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { LayoutDashboard, Dumbbell, Calendar, Users, LogOut, Menu, Bot } from "lucide-react"
/* import { useAuth } from "@/context/auth-context" */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/shadcn/sidebar"

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">GymAdmin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/")} isActive={isActive("/")}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/resources")} isActive={isActive("/resources")}>
                <Dumbbell className="h-5 w-5" />
                <span>Recursos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/reservations")} isActive={isActive("/reservations")}>
                <Calendar className="h-5 w-5" />
                <span>Reservas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/users")} isActive={isActive("/users")}>
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/chat")} isActive={isActive("/chat")}>
                <Bot className="h-5 w-5" />
                <span>Chatbot</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="border-b p-4 flex items-center">
          <SidebarTrigger className="lg:hidden mr-2">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <h1 className="text-xl font-bold">
            {location.pathname === "/" && "Dashboard"}
            {location.pathname.startsWith("/resources") && "Gestión de Recursos"}
            {location.pathname.startsWith("/reservations") && "Gestión de Reservas"}
            {location.pathname.startsWith("/users") && "Gestión de Usuarios"}
          </h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
