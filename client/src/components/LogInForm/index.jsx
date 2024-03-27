import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import styles from './LogInForm.module.sass'

const LogInForm = () => {
  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const handleSubmit = (values, { resetForm }) => {
    alert(JSON.stringify(values, null, 2))
    resetForm()
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
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

export default LogInForm
