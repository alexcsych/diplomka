import React, { useEffect } from 'react'
import styles from './Home.module.sass'
import { getUser } from '../../store/slices/userSlice'
import Header from '../../components/Header'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Banner from '../../components/Banner'
import SearchBar from '../../components/SearchBar'
import Category from '../../components/Category'
import { getCategory } from '../../store/slices/categorySlice'

function Home ({ getUser, getCategory, error }) {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser(token)
    }
    getCategory()
  }, [getUser, getCategory])

  useEffect(() => {
    if (error) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [error, navigate])

  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <Banner></Banner>
        <SearchBar></SearchBar>
        <Category></Category>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return { error: state.userData.error }
}

const mapDispatchToProps = dispatch => ({
  getUser: token => dispatch(getUser(token)),
  getCategory: () => dispatch(getCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
