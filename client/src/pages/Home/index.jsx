import React, { useEffect } from 'react'
import { getUser } from '../../store/slices/userSlice'
import Header from '../../components/Header'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Home ({ getUser, error }) {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser(token)
    }
  }, [getUser])

  useEffect(() => {
    if (error) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [error, navigate])

  return (
    <>
      <Header></Header>
    </>
  )
}

const mapStateToProps = state => {
  return { error: state.userData.error }
}

const mapDispatchToProps = dispatch => ({
  getUser: token => dispatch(getUser(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
