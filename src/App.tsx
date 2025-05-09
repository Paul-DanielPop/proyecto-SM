import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
/* import { Toaster } from "@/components/shadcn/sonner" */
import LoginPage from "./pages/login"
import Dashboard from "./pages/dashboard"
import DashboardLayout from "./components/app/dashboard-layout"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
      {/* <Toaster /> */}
    </>
  )
}

export default App
