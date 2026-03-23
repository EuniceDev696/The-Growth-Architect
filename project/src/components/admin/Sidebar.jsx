import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const links = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Clients", path: "/admin/clients" },
  { name: "Programs", path: "/admin/programs" },
  {name: "Meeting", path: "/admin/meeting"},
  { name: "Messages", path: "/admin/messages" },
  { name: "Newsletter", path: "/admin/newsletter" },
  { name: "Settings", path: "/admin/settings" },
  {name: "Bookings", path: "/admin/bookings"}

]

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-teal-500 text-white p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-10">The Growth Architect</h2>

      <nav className="space-y-4 flex-1">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 rounded bg-slate-800 text-indigo-400 font-medium"
                : "block px-3 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white"
            }
            end={link.path === "/admin/dashboard"}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
      >
        Logout
      </button>
    </aside>
  )
}
