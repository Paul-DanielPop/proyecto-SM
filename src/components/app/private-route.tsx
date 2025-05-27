import { Navigate } from "react-router-dom"
import { useEffect, useState, type JSX } from "react"
import { getFirebaseAuth } from "@/firebase"

interface AuthUser {
  uid: string
  role: boolean
}

export function PrivateRoute({ children, roles }: { children: JSX.Element; roles?: ("admin" | "user")[] }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      console.error("Firebase Auth no disponible")
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // <-- importante para enviar la cookie
        })

        if (!res.ok) throw new Error("No autenticado")

        const user: AuthUser = await res.json()

        const userRole = user.role ? "admin" : "user"

        if (roles && !roles.includes(userRole)) {
          setAllowed(false)
        } else {
          setAllowed(true)
        }
      } catch (error) {
        console.error("Error autenticando:", error)
        setAllowed(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (!allowed) return <Navigate to="/login" replace />

  return children
}
