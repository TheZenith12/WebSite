import React, { Fragment, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { List, PlusCircle, Menu, X, LogOut } from "lucide-react";
import auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function doLogout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ===================== MOBILE SIDEBAR ===================== */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-50">
            <Transition.Child
              enter="transition ease-in-out duration-200 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-64 bg-white border-r">
                {/* Close button */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-bold text-lg">Resorts Admin</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X size={22} />
                  </button>
                </div>

                {/* Mobile nav items */}
                <Nav />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="font-bold text-lg">Resorts Admin</Link>
        </div>
        <Nav />
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Title */}
          <div className="text-sm text-gray-700 hidden md:block">Admin Panel</div>

          {/* Admin dropdown */}
          <button
            onClick={doLogout}
            className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ===================== NAV LINKS COMPONENT ===================== */
function Nav() {
  return (
    <nav className="p-4 space-y-1">
      <NavItem to="/resorts" icon={<List size={16} />}>Resorts</NavItem>
      <NavItem to="/resorts/new" icon={<PlusCircle size={16} />}>Add Resort</NavItem>
    </nav>
  );
}

function NavItem({ to, children, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50"
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm text-gray-800">{children}</span>
    </Link>
  );
}
