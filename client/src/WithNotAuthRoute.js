import React from 'react'
import { Navigate } from 'react-router-dom'

const WithNotAuthRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return !token ? children : <Navigate to='/' />
}

export default WithNotAuthRoute
