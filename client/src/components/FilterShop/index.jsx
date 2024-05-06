import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import { FilterSchema } from '../../utils/validationSchemas'
import {
  getFilterByCategory,
  getItemsByCategory,
  selectedFilterChange,
  setCategory,
  setFirstPrice,
  setItemName,
  setLastPrice
} from '../../store/slices/itemSlice'
import { useEffect } from 'react'
import { getCategory } from '../../store/slices/categorySlice'
import styles from './FilterShop.module.sass'

function FilterShop ({
  getItemsByCategory,
  getFilterByCategory,
  selectedFilterChange,
  filterData,
  categoryId,
  prevCategoryId,
  selectedFilter,
  getCategory,
  categoryData,
  setCategory,
  setItemName,
  setFirstPrice,
  setLastPrice,
  itemName,
  fPrice,
  lPrice,
  page,
  lastPage
}) {
  useEffect(() => {
    if (categoryData.length === 0) {
      getCategory()
    }
    if (!categoryId && categoryData.length > 0) {
      setCategory(categoryData[0]._id)
    }
    if (
      categoryId &&
      (categoryId !== prevCategoryId || Object.keys(filterData).length === 0)
    ) {
      console.log('getFilterByCategory')
      getFilterByCategory(categoryId)
    }
    if (
      categoryId &&
      (categoryId !== prevCategoryId ||
        page !== lastPage ||
        Object.keys(filterData).length === 0)
    ) {
      console.log('getItemsByCategory')
      getItemsByCategory({
        categoryId: categoryId,
        filter: {
          itemName: itemName,
          fPrice: fPrice,
          lPrice: lPrice,
          otherFilter: selectedFilter,
          page: page
        }
      })
    }
  }, [
    getCategory,
    getItemsByCategory,
    getFilterByCategory,
    categoryId,
    prevCategoryId,
    filterData,
    categoryData,
    setCategory,
    itemName,
    fPrice,
    lPrice,
    selectedFilter,
    page,
    lastPage
  ])

  const initialValues = {
    itemName: itemName,
    fPrice: fPrice,
    lPrice: lPrice,
    ...selectedFilter
  }

  const handleSubmit = (values, { resetForm }) => {
    resetForm()
  }

  const handlePriceChange = (e, price, setValue) => {
    const { name, value } = e.target
    const { name1, value1 } = price
    FilterSchema.validate({ [name]: value, [name1]: value1 })
      .then(() => {
        setValue(value)
        getItemsByCategory({
          categoryId: categoryId,
          filter: {
            itemName: itemName,
            [name]: value,
            [name1]: value1,
            otherFilter: selectedFilter
          }
        })
      })
      .catch(error => {})
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={FilterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className={styles.inputBox}>
              <Field
                className={`${styles.input} ${
                  touched.itemName && errors.itemName
                    ? `${styles.errorBox}`
                    : ''
                }`}
                type='text'
                id='itemName'
                name='itemName'
                placeholder='Item name'
                onChange={e => {
                  setFieldValue('itemName', e.target.value)
                  setItemName(e.target.value)
                  getItemsByCategory({
                    categoryId: categoryId,
                    filter: {
                      itemName: e.target.value,
                      fPrice: fPrice,
                      lPrice: lPrice,
                      otherFilter: selectedFilter
                    }
                  })
                }}
              />
              <ErrorMessage
                className={styles.error}
                name='itemName'
                component='span'
              />
            </div>
            <div className={styles.inputBox}>
              <Field
                className={styles.input}
                as='select'
                name='categoryId'
                value={categoryId}
                onChange={e => setCategory(e.target.value)}
              >
                {categoryData.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Field>
            </div>
            <div className={styles.price}>
              <div className={styles.inputBox}>
                <p className={styles.priceTitle}>fPrice</p>
                <Field
                  className={`${styles.input} ${
                    touched.fPrice && errors.fPrice ? `${styles.errorBox}` : ''
                  }`}
                  type='number'
                  id='fPrice'
                  name='fPrice'
                  onChange={e => {
                    setFieldValue('fPrice', e.target.value)
                    handlePriceChange(
                      e,
                      { name1: 'lPrice', value1: lPrice },
                      setFirstPrice
                    )
                  }}
                />
                <ErrorMessage
                  className={styles.error}
                  name='fPrice'
                  component='span'
                />
              </div>
              <div className={styles.inputBox}>
                <p className={styles.priceTitle}>lPrice</p>
                <Field
                  className={`${styles.input} ${
                    touched.lPrice && errors.lPrice ? `${styles.errorBox}` : ''
                  }`}
                  type='number'
                  id='lPrice'
                  name='lPrice'
                  onChange={e => {
                    setFieldValue('lPrice', e.target.value)
                    handlePriceChange(
                      e,
                      { name1: 'fPrice', value1: fPrice },
                      setLastPrice
                    )
                  }}
                />
                <ErrorMessage
                  className={styles.error}
                  name='lPrice'
                  component='span'
                />
              </div>
            </div>
            <div className={styles.checkboxFilter}>
              {Object.keys(filterData).map((filter, index) => (
                <div className={styles.checkboxGroup} key={index}>
                  <p className={styles.filterTitle}>{filter}</p>
                  {Object.keys(filterData[filter]).map((f, subIndex) => (
                    <div className={styles.checkboxContainer} key={subIndex}>
                      <div className={styles.checkboxInput}>
                        <input
                          type='checkbox'
                          id={`${filter}_${f}`}
                          name={`${filter}_${f}`}
                          value={`${filter}_${f}`}
                          checked={selectedFilter[`${filter}_${f}`]}
                          onChange={e => {
                            selectedFilterChange(
                              `${filter}_${f}`,
                              e.target.checked
                            )
                            const updatedFilter = {
                              ...selectedFilter,
                              [`${filter}_${f}`]: e.target.checked
                            }
                            getItemsByCategory({
                              categoryId: categoryId,
                              filter: {
                                itemName: itemName,
                                fPrice: fPrice,
                                lPrice: lPrice,
                                otherFilter: updatedFilter
                              }
                            })
                          }}
                        />
                        <label htmlFor={`${filter}_${f}`}>
                          {`${f} - ${filterData[filter][f]}`}{' '}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

const mapStateToProps = state => {
  return {
    filterData: state.itemData.filterData,
    categoryId: state.itemData.categoryId,
    prevCategoryId: state.itemData.prevCategoryId,
    selectedFilter: state.itemData.selectedFilter,
    categoryData: state.categoryData.categoryData,
    itemName: state.itemData.itemName,
    fPrice: state.itemData.fPrice,
    lPrice: state.itemData.lPrice,
    page: state.itemData.page,
    lastPage: state.itemData.lastPage
  }
}

const mapDispatchToProps = dispatch => ({
  getItemsByCategory: categoryId => dispatch(getItemsByCategory(categoryId)),
  getFilterByCategory: categoryId => dispatch(getFilterByCategory(categoryId)),
  selectedFilterChange: (key, checked) =>
    dispatch(selectedFilterChange({ key, checked })),
  getCategory: () => dispatch(getCategory()),
  setCategory: categoryId => dispatch(setCategory({ categoryId })),
  setItemName: itemName => dispatch(setItemName({ itemName })),
  setFirstPrice: fPrice => dispatch(setFirstPrice({ fPrice })),
  setLastPrice: lPrice => dispatch(setLastPrice({ lPrice }))
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterShop)
