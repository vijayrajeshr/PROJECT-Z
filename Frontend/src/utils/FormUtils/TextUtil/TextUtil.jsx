import React from 'react'
import { Field, ErrorMessage } from 'formik';
import css from './TextUtil.module.css'

const TextUtil = (props) => {
  const {name, placeholder, type, as, children, ...restProps} = props;

  // Helper function to get proper placeholder text for date fields
  const getPlaceholder = () => {
    if (type === 'date') {
      // Show custom placeholder based on field name
      if (name === 'dateOfBirth') return 'Date of Birth';
      if (name === 'anniversary') return 'Anniversary';
      return placeholder;
    }
    return placeholder;
  }

  const getLabelText = () => {
    if (type === 'date') {
      return getPlaceholder();
    }
    return null;
  }

  return (
    <div className={css.fieldBox}>
      {getLabelText() && <label className={css.fieldLabel}>{getLabelText()}</label>}
      {as === 'select' ? (
        <Field name={name} as={as} className={css.field} {...restProps}>
          {children}
        </Field>
      ) : (
        <Field 
          name={name} 
          type={type || 'text'} 
          placeholder={getPlaceholder()} 
          className={css.field} 
          {...restProps} 
        />
      )}
      <ErrorMessage name={name}>
        {msg => <div className={css.errorMessage}>{msg}</div>}
      </ErrorMessage>
    </div>
  )
}

export default TextUtil