import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { List, PlusCircle, LogOut } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import auth from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();

  function doLogout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">
      {/* 🔵 Topbar → Sidebar дээр нэгтгэгдсэн хэсэг */}
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <Link to="/" className="font-bold text-lg">
          Resorts Admin
        </Link>

        <Menu as="div" className="relative">
          <Menu.Button className="px-3 py-1 rounded bg-gray-100 text-sm">
            Admin
          </Menu.Button>

          <Transition>
            <Menu.Items className="absolute right-0 mt-2 bg-white border rounded shadow">
              <Menu.Item>
                <button
                  onClick={doLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-50 text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* 🧭 Sidebar Navigation */}
      <nav className="p-4 space-y-1 flex-1">
        <NavItem to="/resorts" icon={<List size={16} />}>
          Resorts
        </NavItem>

        <NavItem to="/resorts/new" icon={<PlusCircle size={16} />}>
          Add Resort
        </NavItem>
      </nav>
    </aside>
  );
}

function NavItem({ to, icon, children }) {
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

export default Sidebar;
