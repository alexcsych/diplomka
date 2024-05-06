import React from 'react'
import Header from '../../components/Header'
import Banner from '../../components/Banner'
import SearchBar from '../../components/SearchBar'
import Category from '../../components/Category'
import styles from './Home.module.sass'

function Home () {
  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <Banner></Banner>
        <div className={styles.container}>
          <SearchBar></SearchBar>
          <Category></Category>
        </div>
      </div>
    </>
  )
}

export default Home
