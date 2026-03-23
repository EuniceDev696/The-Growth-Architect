import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { apiRequest } from "../../lib/api"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const data = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      if (!data?.admin) {
        throw new Error("Invalid login response")
      }
      login()
      setEmail("")
      setPassword("")
      navigate("/admin/dashboard")
    } catch (error) {
      alert(error.message || "Invalid login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded"
        />

        <button className="w-full bg-indigo-600 text-white py-3 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
