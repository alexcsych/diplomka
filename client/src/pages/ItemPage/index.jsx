import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import styles from './ItemPage.module.sass'
import ItemInfo from '../../components/ItemInfo'
import { getItemById, nullItemId } from '../../store/slices/itemSlice'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import ItemAllInfo from '../../components/ItemAllInfo'
import { getComments } from '../../store/slices/commentSlice'
import Comment from '../../components/Comment'
import ChangeItemForm from '../../components/ChangeItemForm'
import { getCategory } from '../../store/slices/categorySlice'

function ItemPage ({
  getCategory,
  nullItemId,
  userData,
  getItemById,
  getComments
}) {
  const { itemId } = useParams()
  console.log('itemId :>> ', itemId)
  console.log('userData._id :>> ', userData._id)
  useEffect(() => {
    nullItemId()
    getCategory()
    getItemById(
      Object.keys(userData).length === 0 ? itemId : itemId,
      userData._id
    )
    getComments(itemId)
  }, [nullItemId, getCategory, getItemById, userData, getComments, itemId])
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
            {userData.isAdmin && (
              <p
                className={`${styles.linkSwitch} ${
                  step === 'changeItem' ? styles.activeLinkSwitch : ''
                }`}
                onClick={() => {
                  setStep('changeItem')
                }}
              >
                Change Item
              </p>
            )}
          </div>
          {step === 'info' ? (
            <ItemInfo setStep={() => setStep('allInfo')}></ItemInfo>
          ) : step === 'allInfo' ? (
            <ItemAllInfo></ItemAllInfo>
          ) : step === 'comments' ? (
            <Comment></Comment>
          ) : (
            <ChangeItemForm></ChangeItemForm>
          )}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return { userData: state.userData.userData }
}

const mapDispatchToProps = dispatch => ({
  getCategory: () => dispatch(getCategory()),
  nullItemId: () => dispatch(nullItemId()),
  getItemById: (id, user) => dispatch(getItemById({ id, user })),
  getComments: id => dispatch(getComments(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemPage)
