import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Resorts from './pages/Resorts'
import EditResort from './pages/EditResorts'
import Files from './pages/Files'
import AddResort from './pages/AddResorts'
import auth from './utils/auth'

function App() {
  return (
    <BrowserRouter>
  <div className="min-h-screen flex bg-gray-50">
    {auth.isLoggedIn() && <Sidebar />}
    <div className="flex-1 flex flex-col">
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resorts" element={<RequireAuth><Resorts /></RequireAuth>} />
          <Route path="/resorts/new" element={<RequireAuth><AddResort /></RequireAuth>} />
          <Route path="/resorts/edit/:id" element={<RequireAuth><EditResort /></RequireAuth>} />
          <Route path="/files" element={<RequireAuth><Files /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  </div>
</BrowserRouter>

  )
}

export default App
