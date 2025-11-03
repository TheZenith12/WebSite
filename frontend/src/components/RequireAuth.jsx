import React from 'react'
import { Navigate } from 'react-router-dom'
import auth from '../utils/auth'

function RequireAuth({ children }) {
  if (!auth.isLoggedIn()) return <Navigate to="/login" replace />
  return children
}

export default RequireAuth
