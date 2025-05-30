import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import WithNotAuthRoute from './WithNotAuthRoute'
import ShopPage from './pages/ShopPage'
import WithErrorHandler from './components/WithErrorHandler/WithErrorHandler'
import ItemPage from './pages/ItemPage'
import ProfilePage from './pages/ProfilePage'
import WithAuthRoute from './WithAuthRoute'

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
          path='/item/:itemId'
          element={
            <WithErrorHandler>
              <ItemPage />
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
        <Route
          path='/profile/:pageId'
          element={
            <WithAuthRoute>
              <ProfilePage />
            </WithAuthRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
