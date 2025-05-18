// import * as yup from 'yup';

// export const applyFormSchema = yup.object({
//   displayName: yup.string().required('Display name is required'),
//   username: yup.string().required('Username is required'),
//   bio: yup.string().required('Bio is required'),
//   categories: yup.array()
//     .min(1, 'Select at least one category')
//     .required('Categories are required'),
//   social: yup.object({
//     facebook: yup.string()
//       .notRequired()
//       .min(3, 'Must be at least 3 characters'),
//     instagram: yup.string()
//       .notRequired()
//       .min(3, 'Must be at least 3 characters'),
//     twitter: yup.string()
//       .notRequired()
//       .min(3, 'Must be at least 3 characters'),
//     tiktok: yup.string()
//       .notRequired()
//       .min(3, 'Must be at least 3 characters')
//   }).test(
//     'at-least-one-social',
//     'Please provide at least one social media username',
//     (value) => {
//       return Object.values(value || {}).some(val => typeof val === 'string' && val.length > 0);
//     }
//   ),
//   pricing: yup.object({
//     quarterly: yup.string().required(),
//     biAnnual: yup.string().required(),
//     yearly: yup.string().required()
//   }),
//   legal: yup.object({
//     terms: yup.boolean()
//       .oneOf([true], 'You must agree to the terms')
//       .required('Terms agreement is required'),
//     isAdult: yup.boolean()
//       .oneOf([true], 'You must confirm you are at least 18 years old')
//       .required('Age confirmation is required')
//   }).required('Legal agreements are required'),
//   monthlyPrice: yup.number()
//     .required('Monthly price is required')
//     .min(4.99, 'Minimum price is $4.99')
//     .typeError('Must be a valid number'),
//   discounts: yup.object({
//     quarterly: yup.string().required(),
//     biAnnual: yup.string().required(),
//     yearly: yup.string().required()
//   }),
//   quarterlyPrice: yup.number(),
//   biAnnualPrice: yup.number(),
//   yearlyPrice: yup.number()
// });

import * as yup from 'yup';

export const applyFormSchema = yup.object({
  displayName: yup.string().required('Display name is required'),
  username: yup.string().required('Username is required'),
  bio: yup.string().required('Bio is required'),
  categories: yup.array()
    .min(1, 'Select at least one category')
    .required('Categories are required'),
  social: yup.object({
    facebook: yup.string().notRequired(),
    instagram: yup.string().notRequired(),
    twitter: yup.string().notRequired(),
    tiktok: yup.string().notRequired()
  }).test(
    'at-least-one-social',
    'Please provide at least one social media username',
    (value) => {
      return Object.values(value || {}).some(val => typeof val === 'string' && val.length > 0);
    }
  ),
  monthlyPrice: yup.number()
    .required('Monthly price is required')
    .min(4.99, 'Minimum price is $4.99')
    .typeError('Must be a valid number'),
  discounts: yup.object({
    quarterly: yup.string().required(),
    biAnnual: yup.string().required(),
    yearly: yup.string().required()
  }),
  legal: yup.object({
    terms: yup.boolean()
      .oneOf([true], 'You must agree to the terms')
      .required('Terms agreement is required'),
    contentGuidelines: yup.boolean()
      .oneOf([true], 'You must agree to the content guidelines')
      .required('Content guidelines agreement is required'),
    isAdult: yup.boolean()
      .oneOf([true], 'You must confirm you are at least 18 years old')
      .required('Age confirmation is required')
  }).required('Legal agreements are required')
});