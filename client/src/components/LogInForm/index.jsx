import React from 'react'
import styles from './LogInForm.module.sass'
import { useFormik } from 'formik'

const LogInForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2))
    }
  })
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.inputBox}>
            <input
              className={styles.input}
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <span className={styles.error}>Error</span>
          </div>
          <div className={styles.inputBox}>
            <input
              className={styles.input}
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <span className={styles.error}>Error</span>
          </div>

          <button className={styles.submit} type='submit'>
            log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default LogInForm
