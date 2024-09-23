import React from 'react'
import Header from '../../components/Header'
import Banner from '../../components/Banner'
// import SearchBar from '../../components/SearchBar'
import Category from '../../components/Category'
import styles from './Home.module.sass'
import MyEditor from '../../components/draft'

function Home () {
  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <Banner></Banner>
        <div className={styles.container}>
          {/* <SearchBar></SearchBar> */}
          <Category></Category>
        </div>
      </div>
      <MyEditor></MyEditor>
    </>
  )
}

export default Home
