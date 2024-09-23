import React from 'react'
import { Navigate } from 'react-router-dom'

const WithAuthRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to='/' />
}

export default WithAuthRoute
