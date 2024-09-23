import React, { useEffect } from 'react'
import {
  getNovaPoshtaAreas,
  getNovaPoshtaBranch,
  getNovaPoshtaCity,
  setIsMakeOrder,
  setAreasSelected,
  setBranchesSelected,
  setCitiesSelected,
  addOrder,
  getOrder
} from '../../store/slices/orderSlice'
import styles from './OrderForm.module.sass'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { clearCart } from '../../store/slices/cartSlice'

function OrderForm ({
  setIsMakeOrder,
  getNovaPoshtaAreas,
  getNovaPoshtaCity,
  getNovaPoshtaBranch,
  addOrder,
  getOrder,
  userData,
  orders,
  areas,
  cities,
  branches,
  areasSelected,
  citiesSelected,
  branchesSelected,
  setAreasSelected,
  setCitiesSelected,
  setBranchesSelected,
  totalSum,
  clearCart
}) {
  useEffect(() => {
    if (userData._id) {
      getNovaPoshtaAreas()
    }
  }, [getNovaPoshtaAreas, userData])

  const handleAreaChange = e => {
    const selectedArea = e.target.value
    setAreasSelected(selectedArea)
    setCitiesSelected('')
    setBranchesSelected('')
    getNovaPoshtaCity(selectedArea)
  }

  const handleCityChange = e => {
    const selectedCity = e.target.value
    setCitiesSelected(selectedCity)
    setBranchesSelected('')
    getNovaPoshtaBranch(selectedCity)
  }

  return (
    <Formik
      initialValues={{
        area: '',
        city: '',
        branch: '',
        phoneNumber: ''
      }}
      validationSchema={Yup.object({
        area: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        branch: Yup.string().required('Required'),
        phoneNumber: Yup.string()
          .matches(/^\+?3?8?(0\d{9})$/, 'Invalid phone number')
          .required('Required')
      })}
      onSubmit={async values => {
        console.log('areasSelected :>> ', areasSelected)
        await addOrder(userData._id, {
          ...values,
          area: areas.find(a => a.Ref === areasSelected)?.Description
        })
        setAreasSelected('')
        setCitiesSelected('')
        setBranchesSelected('')
        await getOrder(userData._id)
        setIsMakeOrder(false)
        clearCart()
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className={styles.container}>
          <div className={styles.formContainer}>
            <p className={styles.titleMakeOrder}>Make Order</p>
            <div className={styles.inputBox}>
              <label className={styles.label} htmlFor='area'>
                Choose area:
              </label>
              <Field
                as='select'
                id='area'
                name='area'
                className={
                  touched.area && errors.area ? `${styles.errorBox}` : ''
                }
                onChange={e => {
                  setFieldValue('area', e.target.value)
                  setFieldValue('city', '')
                  setFieldValue('branch', '')
                  handleAreaChange(e)
                }}
              >
                <option value=''>Select area</option>
                {areas.map(area => (
                  <option key={area.Ref} value={area.Ref}>
                    {area.Description}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                className={styles.error}
                name='area'
                component='div'
              />
            </div>
            <div className={styles.inputBox}>
              <label className={styles.label} htmlFor='city'>
                Choose city:
              </label>
              <Field
                className={
                  touched.city && errors.city ? `${styles.errorBox}` : ''
                }
                as='select'
                id='city'
                name='city'
                onChange={e => {
                  setFieldValue('city', e.target.value)
                  setFieldValue('branch', '')
                  handleCityChange(e)
                }}
                disabled={areasSelected === ''}
              >
                <option value=''>Select city</option>
                {areasSelected !== '' &&
                  cities.map(city => (
                    <option key={city.Ref} value={city.Description}>
                      {city.Description}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                className={styles.error}
                name='city'
                component='div'
              />
            </div>
            <div className={styles.inputBox}>
              <label className={styles.label} htmlFor='branch'>
                Choose branch:
              </label>
              <Field
                className={
                  touched.branch && errors.branch ? `${styles.errorBox}` : ''
                }
                as='select'
                id='branch'
                name='branch'
                disabled={citiesSelected === ''}
              >
                <option value=''>Select branch</option>
                {citiesSelected !== '' &&
                  branches.map(branch => (
                    <option key={branch.Ref} value={branch.Description}>
                      {branch.Description}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                className={styles.error}
                name='branch'
                component='div'
              />
            </div>
            <div className={styles.inputBox}>
              <label className={styles.label} htmlFor='phoneNumber'>
                Phone Number:
              </label>
              <Field
                className={
                  touched.phoneNumber && errors.phoneNumber
                    ? `${styles.errorBox}`
                    : ''
                }
                type='text'
                id='phoneNumber'
                name='phoneNumber'
                placeholder='Enter phone number (+380971234567)'
              />
              <ErrorMessage
                className={styles.error}
                name='phoneNumber'
                component='div'
              />
            </div>
          </div>
          <div className={styles.bottom}>
            <p className={styles.totalSum}>Total Sum: {totalSum} ₴</p>
            <div className={styles.btnBox}>
              <button className={styles.btn} type='submit'>
                Submit
              </button>
              <button
                onClick={() => {
                  setAreasSelected('')
                  setCitiesSelected('')
                  setBranchesSelected('')
                  setIsMakeOrder(false)
                }}
                className={styles.btn}
              >
                Cancel
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

const mapStateToProps = state => {
  return {
    totalSum: state.cartData.totalSum,
    userData: state.userData.userData,
    areasSelected: state.orderData.areasSelected,
    citiesSelected: state.orderData.citiesSelected,
    branchesSelected: state.orderData.branchesSelected,
    areas: state.orderData.areas,
    cities: state.orderData.cities,
    branches: state.orderData.branches
  }
}

const mapDispatchToProps = dispatch => ({
  getOrder: id => dispatch(getOrder(id)),
  clearCart: () => dispatch(clearCart()),
  addOrder: (id, values) => dispatch(addOrder({ id, values })),
  setIsMakeOrder: isMakeOrder => dispatch(setIsMakeOrder({ isMakeOrder })),
  getNovaPoshtaAreas: () => dispatch(getNovaPoshtaAreas()),
  getNovaPoshtaCity: AreaRef => dispatch(getNovaPoshtaCity({ AreaRef })),
  getNovaPoshtaBranch: CityName => dispatch(getNovaPoshtaBranch({ CityName })),
  setAreasSelected: areasSelected =>
    dispatch(setAreasSelected({ areasSelected })),
  setCitiesSelected: citiesSelected =>
    dispatch(setCitiesSelected({ citiesSelected })),
  setBranchesSelected: branchesSelected =>
    dispatch(setBranchesSelected({ branchesSelected }))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderForm)
