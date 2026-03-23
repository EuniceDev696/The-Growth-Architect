import Sidebar from "../admin/Sidebar"
import { Outlet } from "react-router-dom"

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-indigo-500 text-white p-4">
          Admin Panel
        </header>

        {/* Page content */}
        <main className="p-6 bg-slate-100 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
