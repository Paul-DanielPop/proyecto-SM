import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
/* import { Toaster } from "@/components/shadcn/sonner" */
import LoginPage from "./pages/login"
import Dashboard from "./pages/dashboard"
import DashboardLayout from "./components/app/dashboard-layout"
import ResourcesList from "./pages/resources/resource-list"
import ResourceForm from "./pages/resources/resource-form"
import ReservationsList from "./pages/reservations/reservation-list"
import ReservationForm from "./pages/reservations/reservation-form"
import UsersList from "./pages/users/users-list"
import { PrivateRoute } from "./components/app/private-route"
import RegisterPage from "./pages/register"
import { Toaster } from "sonner"
import Chat from "./pages/chat/chat"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute roles={["user", "admin"]}><DashboardLayout /></PrivateRoute>}>
            <Route index element={<PrivateRoute roles={["user", "admin"]}><Dashboard /></PrivateRoute>} />
            <Route path="resources" element={<PrivateRoute roles={["user", "admin"]}><ResourcesList /></PrivateRoute>} />
            <Route path="resources/new" element={<PrivateRoute roles={["user", "admin"]}><ResourceForm /></PrivateRoute>} />
            <Route path="resources/edit/:id" element={<PrivateRoute roles={["user", "admin"]}><ResourceForm /></PrivateRoute>} />
            <Route path="reservations" element={<PrivateRoute roles={["user", "admin"]}><ReservationsList /></PrivateRoute>} />
            <Route path="reservations/new" element={<PrivateRoute roles={["user", "admin"]}><ReservationForm /></PrivateRoute>} />
            <Route path="reservations/edit/:id" element={<PrivateRoute roles={["user", "admin"]}><ReservationForm /></PrivateRoute>} />
            <Route path="users" element={<PrivateRoute roles={["user", "admin"]}><UsersList /></PrivateRoute>} />
            <Route path="chat" element={<PrivateRoute roles={["user", "admin"]}><Chat /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
      <Toaster richColors position="bottom-center"/>
    </>
  )
}

export default App
