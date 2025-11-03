import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { LogOut } from 'lucide-react'
import auth from '../utils/auth'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const navigate = useNavigate()
  function doLogout() {
    auth.logout()
    navigate('/login')
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
      <div className="text-sm text-gray-600">Admin panel</div>
      <div className="flex items-center gap-4">
        <Menu as="div" className="relative">
          <Menu.Button className="px-3 py-1 rounded bg-gray-100">Admin</Menu.Button>
          <Transition>
            <Menu.Items className="absolute right-0 mt-2 bg-white border rounded shadow">
              <Menu.Item>
                <button onClick={doLogout} className="flex items-center gap-2 px-4 py-2 w-full text-left">
                  <LogOut size={16} /> Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}

export default Topbar
