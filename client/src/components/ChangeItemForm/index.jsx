import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import styles from './ChangeItemForm.module.sass'
import { changeItem } from '../../store/slices/itemSlice'

const validationSchema = Yup.object().shape({
  itemName: Yup.string().required('Required'),
  type: Yup.string().required('Required'),
  params: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Required'),
      values: Yup.array().of(Yup.string().required('Required'))
    })
  ),
  price: Yup.number()
    .required('Required')
    .min(0, 'Price must be greater than or equal to 0')
})

function ChangeItemForm ({ changeItem, itemInfo, itemId, token, categoryData }) {
  const [itemImageFile, setItemImageFile] = useState(null)
  return (
    <Formik
      initialValues={{
        itemName: itemInfo.itemName,
        type: itemInfo.type,
        params: Object.keys(itemInfo.params).map(key => ({
          name: key,
          values: Array.isArray(itemInfo.params[key])
            ? [...itemInfo.params[key]]
            : [itemInfo.params[key]]
        })),
        itemImage: '',
        price: itemInfo.price
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const formattedParams = {}
        values.params.forEach(param => {
          if (param.values.length !== 0) {
            formattedParams[param.name] = param.values
          }
        })
        const formattedValues = {
          ...values,
          params: formattedParams
        }
        console.log('itemId :>> ', itemId)
        console.log('token formattedValues :>> ', token, formattedValues)
        const formData = new FormData()
        formData.append('_id', itemInfo._id)
        formData.append('itemName', values.itemName)
        formData.append('type', values.type)
        formData.append('params', JSON.stringify(formattedParams))
        if (
          values.itemImage !== '' &&
          values.itemImage !== undefined &&
          values.itemImage !== null
        ) {
          formData.append('itemImage', values.itemImage)
        }
        formData.append('price', values.price)
        changeItem(token, formData)
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className={styles.changeItemForm}>
          <div className={styles.textBox}>
            <label htmlFor='itemName'>Item Name</label>
            <Field name='itemName' type='text' />
            <ErrorMessage
              className={styles.error}
              name='itemName'
              component='div'
            />
          </div>
          <div className={styles.textBox}>
            <label htmlFor='type'>Type</label>
            <Field name='type' as='select'>
              <option value=''>Select type</option>
              {categoryData.map(category => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className={styles.error}
              name='type'
              component='div'
            />
          </div>
          <div className={styles.textBox}>
            <label htmlFor='price'>Price:</label>
            <Field name='price' type='number' />
            <ErrorMessage
              className={styles.error}
              name='price'
              component='div'
            />
          </div>
          <div className={styles.flexParams}>
            <FieldArray name='params'>
              {({ push, remove }) => (
                <>
                  {values.params.map((param, index) => (
                    <div key={index} className={styles.paramsBox}>
                      <div className={styles.textBox}>
                        <label htmlFor={`params[${index}].name`}>
                          Parameter Name
                        </label>
                        <Field name={`params[${index}].name`} type='text' />
                        <ErrorMessage
                          className={styles.error}
                          name={`params[${index}].name`}
                          component='div'
                        />
                      </div>
                      <FieldArray name={`params[${index}].values`}>
                        {({ push: pushValue, remove: removeValue }) => (
                          <>
                            {param.values.map((value, valueIndex) => (
                              <div key={valueIndex}>
                                <div className={styles.textBox}>
                                  <label
                                    htmlFor={`params[${index}].values[${valueIndex}]`}
                                  >
                                    Value
                                  </label>
                                  <Field
                                    name={`params[${index}].values[${valueIndex}]`}
                                    type='text'
                                  />
                                  <ErrorMessage
                                    className={styles.error}
                                    name={`params[${index}].values[${valueIndex}]`}
                                    component='div'
                                  />
                                </div>
                                <div className={styles.buttonBox}>
                                  <button
                                    type='button'
                                    onClick={() => removeValue(valueIndex)}
                                  >
                                    Remove Value
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button type='button' onClick={() => pushValue('')}>
                              Add Value
                            </button>
                          </>
                        )}
                      </FieldArray>
                      <button type='button' onClick={() => remove(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={() => push({ name: '', values: [''] })}
                  >
                    Add Parameter
                  </button>
                </>
              )}
            </FieldArray>
          </div>
          <div className={styles.textBox}>
            <label htmlFor='itemImage' className={styles.fileInputLabel}>
              Choose Image (.jpg, .jpeg, .png)
            </label>
            <input
              className={styles.fileInput}
              type='file'
              id='itemImage'
              name='itemImage'
              accept='.jpg, .jpeg, .png'
              onChange={event => {
                const file = event.currentTarget.files[0]
                console.log('file :>> ', file)
                setItemImageFile(file)
                setFieldValue('itemImage', file)
              }}
            />
          </div>
          <ErrorMessage
            className={styles.fileError}
            name='itemImage'
            component='div'
          />
          {itemImageFile && (
            <p className={styles.fileName}>{`File: ${itemImageFile.name}`}</p>
          )}
          <button type='submit'>Change Item</button>
        </Form>
      )}
    </Formik>
  )
}

const mapStateToProps = state => {
  return {
    token: state.userData.userData.token,
    itemId: state.itemData.itemId,
    categoryData: state.categoryData.categoryData,
    itemInfo: state.itemData.itemInfo
  }
}

const mapDispatchToProps = dispatch => ({
  changeItem: (token, data) => dispatch(changeItem({ token, data }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeItemForm)
