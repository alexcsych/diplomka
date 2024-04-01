import React from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './SignUpForm.module.sass'
import { signupUser } from '../../store/slices/userSlice'
import { SignUpSchema } from '../../utils/validationSchemas'
import { useNavigate } from 'react-router-dom'

const SignUpForm = ({ signupUser }) => {
  const navigate = useNavigate()
  const initialValues = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  }

  const handleSubmit = (values, { resetForm }) => {
    signupUser(values)
    resetForm()
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Sign Up</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.inputBox}>
                <Field
                  className={`${styles.input} ${
                    touched.userName && errors.userName
                      ? `${styles.errorBox}`
                      : ''
                  }`}
                  type='text'
                  id='userName'
                  name='userName'
                  placeholder='Your Name'
                />
                <ErrorMessage
                  name='userName'
                  component='span'
                  className={styles.error}
                />
              </div>
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
              <div className={styles.inputBox}>
                <Field
                  className={`${styles.input} ${
                    touched.confirmPassword && errors.confirmPassword
                      ? `${styles.errorBox}`
                      : ''
                  }`}
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                />
                <ErrorMessage
                  name='confirmPassword'
                  component='span'
                  className={styles.error}
                />
              </div>
              <div className={styles.inputBox}>
                <Field
                  id='isAdmin'
                  name='isAdmin'
                  type='checkbox'
                  className={styles.checkbox}
                />
                <label className={styles.checkboxLabel} htmlFor='isAdmin'>
                  Sign up as Admin
                </label>
              </div>
              <button className={styles.submit} type='submit'>
                Sign up
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  signupUser: userData => dispatch(signupUser(userData))
})

export default connect(null, mapDispatchToProps)(SignUpForm)
