import { useAuth } from "@/contexts/authContexts"
import { useEffect } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export function LogoutPage() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      logout()
      toast.success('Logout realizado com sucesso')
      navigate('/login', { replace: true })
    })
    
    return null
  }