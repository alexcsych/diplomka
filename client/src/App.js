import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import WithNotAuthRoute from './WithNotAuthRoute'
import ShopPage from './pages/ShopPage'
import WithErrorHandler from './components/WithErrorHandler/WithErrorHandler'

function App () {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <WithErrorHandler>
              <Home />
            </WithErrorHandler>
          }
        />
        <Route
          path='/shop'
          element={
            <WithErrorHandler>
              <ShopPage />
            </WithErrorHandler>
          }
        />
        <Route
          path='/login'
          element={
            <WithNotAuthRoute>
              <LogIn />
            </WithNotAuthRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <WithNotAuthRoute>
              <SignUp />
            </WithNotAuthRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
