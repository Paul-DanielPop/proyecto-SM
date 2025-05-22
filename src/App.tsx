import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
/* import { Toaster } from "@/components/shadcn/sonner" */
import LoginPage from "./pages/login"
import Dashboard from "./pages/dashboard"
import DashboardLayout from "./components/app/dashboard-layout"
import ResourcesList from "./pages/resources/resource-list"
import ResourceForm from "./pages/resources/resource-form"
import ReservationsList from "./pages/reservations/reservation-list"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="resources" element={<ResourcesList />} />
            <Route path="resources/new" element={<ResourceForm />} />
            <Route path="resources/edit/:id" element={<ResourceForm />} />
            <Route path="reservations" element={<ReservationsList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
      {/* <Toaster /> */}
    </>
  )
}

export default App
