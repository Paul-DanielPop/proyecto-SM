"use client"

import { Outlet } from "react-router-dom"
import { AdminSidebar } from "./admin-sidebar"

export default function DashboardLayout() {

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
