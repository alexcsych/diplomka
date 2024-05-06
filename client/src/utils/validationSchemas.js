import * as yup from 'yup'

export const LogInSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
})

export const SignUpSchema = yup.object().shape({
  userName: yup
    .string()
    .min(2, 'Name must be 2 characters long')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be 6 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  isAdmin: yup.bool().required('Role is required')
})

export const FilterSchema = yup.object().shape({
  itemName: yup.string(),
  fPrice: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price must be a positive number')
    .test(
      'is-less-than-or-equal',
      'Last price must be greater than or equal to first price',
      function (value) {
        const { lPrice } = this.parent
        return value === undefined || lPrice === undefined || value <= lPrice
      }
    ),
  lPrice: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price must be a positive number')
    .test(
      'is-greater-than-or-equal',
      'Last price must be greater than or equal to first price',
      function (value) {
        const { fPrice } = this.parent
        return value === undefined || fPrice === undefined || value >= fPrice
      }
    )
})
