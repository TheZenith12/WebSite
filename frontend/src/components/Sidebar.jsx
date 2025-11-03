import React from 'react'
import { Link } from 'react-router-dom'
import { List, PlusCircle } from 'lucide-react'

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/" className="font-bold text-lg">Resorts Admin</Link>
      </div>
      <nav className="p-4 space-y-1">
        <NavItem to="/resorts" icon={<List size={16} />}>Resorts</NavItem>
        <NavItem to="/resorts/new" icon={<PlusCircle size={16} />}>Add Resort</NavItem>
      </nav>
    </aside>
  )
}

function NavItem({ to, children, icon }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm text-gray-800">{children}</span>
    </Link>
  )
}

export default Sidebar
