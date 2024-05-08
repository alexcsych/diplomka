import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import styles from './ItemPage.module.sass'
import ItemInfo from '../../components/ItemInfo'
import { getItemById } from '../../store/slices/itemSlice'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import ItemAllInfo from '../../components/ItemAllInfo'
import { getComments } from '../../store/slices/commentSlice'
import Comment from '../../components/Comment'

function ItemPage ({ getItemById, getComments }) {
  const { itemId } = useParams()
  useEffect(() => {
    getItemById(itemId)
    getComments(itemId)
  }, [getItemById, getComments, itemId])
  const [step, setStep] = useState('info')
  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.linkSwitcher}>
            <p
              className={`${styles.linkSwitch} ${
                step === 'info' ? styles.activeLinkSwitch : ''
              }`}
              onClick={() => {
                setStep('info')
              }}
            >
              All about the product
            </p>
            <p
              className={`${styles.linkSwitch} ${
                step === 'allInfo' ? styles.activeLinkSwitch : ''
              }`}
              onClick={() => {
                setStep('allInfo')
              }}
            >
              Characteristics
            </p>
            <p
              className={`${styles.linkSwitch} ${
                step === 'comments' ? styles.activeLinkSwitch : ''
              }`}
              onClick={() => {
                setStep('comments')
              }}
            >
              Leave feedback
            </p>
          </div>

          {step === 'info' ? (
            <ItemInfo setStep={() => setStep('allInfo')}></ItemInfo>
          ) : step === 'allInfo' ? (
            <ItemAllInfo></ItemAllInfo>
          ) : (
            <Comment></Comment>
          )}
        </div>
      </div>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  getItemById: id => dispatch(getItemById(id)),
  getComments: id => dispatch(getComments(id))
})

export default connect(null, mapDispatchToProps)(ItemPage)
