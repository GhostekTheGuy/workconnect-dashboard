import { createFormHook } from '@tanstack/react-form'

import {
  CheckboxField,
  MultiSelectChipsField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
} from './fields'
import { fieldContext, formContext } from './form-context'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    MultiSelectChipsField,
    SwitchField,
    CheckboxField,
  },
  formComponents: {},
})
