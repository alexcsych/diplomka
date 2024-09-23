import React, { useEffect, useState } from 'react'
import styles from './ProfileInfo.module.sass'
import { connect } from 'react-redux'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { UserEditingSchema } from '../../utils/validationSchemas'
import {
  clearUpdatedUserData,
  nullErrorUser,
  updateUser
} from '../../store/slices/userSlice'

function ProfileInfo ({
  nullErrorUser,
  error,
  userData,
  updatedUserData,
  updateUser,
  clearUpdatedUserData
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [userImageFile, setUserImageFile] = useState(null)
  const initialValues = {
    userName: userData.userName,
    email: userData.email,
    userImage: '',
    password: ''
  }

  const onSubmit = values => {
    const { userName, email, password, userImage } = values
    const formData = new FormData()
    nullErrorUser()
    if (userName !== userData.userName) {
      formData.append('userName', userName)
    }
    if (email !== userData.email) {
      formData.append('email', email)
    }
    if (password !== '') {
      formData.append('password', password)
    }
    if (userImageFile !== null && userImageFile !== undefined) {
      formData.append('userImage', userImageFile)
    }
    console.log(values)
    console.log('userImage :>> ', userImage)
    console.log('formData :>> ', formData)
    updateUser({ token: userData.token, formData })
  }

  useEffect(() => {
    if (Object.keys(updatedUserData).length !== 0 && !error) {
      setIsEditing(false)
      setUserImageFile(null)
    }
  }, [updatedUserData, error])

  return (
    <div className={styles.container}>
      {!isEditing ? (
        <>
          <div className={styles.info}>
            <p>Personal Data</p>
            <div className={styles.infoRow}>
              <p className={styles.title}>Name:</p>
              <p>{userData.userName}</p>
            </div>
            <div className={styles.infoRow}>
              <p className={styles.title}>Email:</p>
              <p>{userData.email}</p>
            </div>
          </div>
          <div className={styles.imgBox}>
            <img
              className={styles.img}
              src={userData.userImage}
              alt='userImage'
            />
            <button
              className={styles.btn}
              onClick={() => {
                clearUpdatedUserData()
                setIsEditing(true)
              }}
            >
              Change Info
            </button>
          </div>
        </>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={UserEditingSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.formBox}>
                <div className={styles.inputBox}>
                  <Field
                    type='text'
                    name='userName'
                    placeholder='Enter your name'
                    className={`${styles.input} ${
                      touched.itemName && errors.itemName
                        ? `${styles.errorBox}`
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name='userName'
                    component='div'
                    className={styles.error}
                  />
                </div>
                <div className={styles.inputBox}>
                  <Field
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    className={`${styles.input} ${
                      touched.itemName && errors.itemName
                        ? `${styles.errorBox}`
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className={styles.error}
                  />
                </div>
                <div className={styles.inputBox}>
                  <Field
                    type='password'
                    name='password'
                    placeholder='Enter new password (not required)'
                    className={`${styles.input} ${
                      touched.itemName && errors.itemName
                        ? `${styles.errorBox}`
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name='password'
                    component='div'
                    className={styles.error}
                  />
                </div>
                <div className={styles.inputBox}>
                  <label htmlFor='userImage' className={styles.fileInputLabel}>
                    Choose Image (.jpg, .jpeg, .png)
                  </label>
                  <input
                    type='file'
                    id='userImage'
                    name='userImage'
                    className={styles.fileInput}
                    accept='.jpg, .jpeg, .png'
                    onChange={event => {
                      const file = event.currentTarget.files[0]
                      console.log('file :>> ', file)
                      setUserImageFile(file)
                    }}
                  />
                </div>
                {userImageFile && (
                  <p className={styles.fileName}>
                    {`File: ${userImageFile.name}`}
                  </p>
                )}
                {error && (
                  <p className={styles.serverError}>
                    {error.title +
                      (error.validationErrors
                        ? ` ${error.validationErrors[0]}`
                        : '')}
                  </p>
                )}
              </div>
              <div className={styles.btnFlex}>
                <div className={styles.btnContainer}>
                  <button className={styles.btn} type='submit'>
                    Submit
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => {
                      setUserImageFile(null)
                      nullErrorUser()
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    updatedUserData: state.userData.updatedUserData,
    error: state.userData.error
  }
}

const mapDispatchToProps = dispatch => ({
  nullErrorUser: () => dispatch(nullErrorUser()),
  updateUser: ({ token, formData }) =>
    dispatch(updateUser({ token, formData })),
  clearUpdatedUserData: () => dispatch(clearUpdatedUserData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo)
