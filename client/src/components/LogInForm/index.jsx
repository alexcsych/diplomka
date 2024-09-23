import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './LogInForm.module.sass'
import { LogInSchema } from '../../utils/validationSchemas'
import { useNavigate } from 'react-router-dom'
import { loginUser, nullErrorUser } from '../../store/slices/userSlice'
import { connect } from 'react-redux'

const LogInForm = ({ userData, error, nullErrorUser, loginUser }) => {
  const navigate = useNavigate()
  const initialValues = {
    email: '',
    password: ''
  }

  const handleSubmit = values => {
    nullErrorUser()
    loginUser(values)
  }

  useEffect(() => {
    if (Object.keys(userData).length !== 0 && !error) {
      navigate('/')
    }
  }, [navigate, userData, error])

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={LogInSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.inputBox}>
                <Field
                  className={`${styles.input} ${
                    touched.email && errors.email ? `${styles.errorBox}` : ''
                  }`}
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Email'
                />
                <ErrorMessage
                  name='email'
                  component='span'
                  className={styles.error}
                />
              </div>
              <div className={styles.inputBox}>
                <Field
                  className={`${styles.input} ${
                    touched.password && errors.password
                      ? `${styles.errorBox}`
                      : ''
                  }`}
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Password'
                />
                <ErrorMessage
                  name='password'
                  component='span'
                  className={styles.error}
                />
              </div>
              {error && (
                <p className={styles.serverError}>
                  {error.title +
                    (error.validationErrors
                      ? ` ${error.validationErrors[0]}`
                      : '')}
                </p>
              )}
              <button className={styles.submit} type='submit'>
                Log In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    error: state.userData.error
  }
}

const mapDispatchToProps = dispatch => ({
  nullErrorUser: () => dispatch(nullErrorUser()),
  loginUser: userData => dispatch(loginUser(userData))
})

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm)
