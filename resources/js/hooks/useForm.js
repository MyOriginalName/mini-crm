import { useState, useCallback } from 'react';
import { getFieldError } from '@/utils/validation';

export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value, isCompany = false) => {
    const error = getFieldError({ name, required: true }, value, isCompany);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return !error;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    const isCompany = values.type === 'company';

    Object.keys(values).forEach(key => {
      const error = getFieldError({ name: key, required: true }, values[key], isCompany);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value, values.type === 'company');
  }, [validateField, values.type]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      // Обработка ошибок от сервера
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [initialValues, onSubmit, validateForm, values]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  };
}; 