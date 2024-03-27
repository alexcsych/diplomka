import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import styles from './SignUpForm.module.sass'

const SignUpForm = () => {
  const initialValues = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  }

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Please enter your name'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  })

  const handleSubmit = (values, { resetForm }) => {
    alert(JSON.stringify(values, null, 2))
    resetForm()
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Sign Up</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                <label className={styles.checkboxLabel} for='isAdmin'>
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

export default SignUpForm
